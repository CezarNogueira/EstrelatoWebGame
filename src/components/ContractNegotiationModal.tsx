import { useMemo, useState } from "react";
import { Player, Team } from "../types";
import {
  FileSignature,
  AlertCircle,
  Clock,
  Building2,
  Flame,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Wallet,
  Handshake,
  ArrowLeftRight,
} from "lucide-react";
import { formatCurrency } from "../utils";

// ---------------------------------------------------------------------------
// Types
//
// IMPORTANT: in this version the USER is the footballer. The CLUB (an AI
// board) makes the offer and reacts to whatever the user asks for. This is
// the reverse of a manager-mode negotiation.
// ---------------------------------------------------------------------------

export type SquadRole = "STARTER" | "COMPETING" | "ROTATION";

export interface ContractExtras {
  signingBonus: number;
  releaseClause: number;
  role: SquadRole;
}

interface OfferTerms {
  salary: number;
  years: number;
  signingBonusPct: number; // % of annual salary, paid once
  releaseClause: number; // 0 = no clause
  role: SquadRole;
}

interface WillingnessScores {
  salaryScore: number;
  roleScore: number;
  releaseScore: number;
  yearsScore: number;
  bonusScore: number;
  overall: number; // club's overall willingness to accept the user's ask
}

type Outcome = "accepted" | "rejected" | "withdrawn";

interface HistoryEntry {
  round: number;
  ask: OfferTerms;
  scores: WillingnessScores;
  outcome: Outcome;
  message: string;
  clubResponse?: OfferTerms;
}

type Phase = "review" | "negotiate" | "final" | "withdrawn";

const ROLE_LABEL: Record<SquadRole, string> = {
  STARTER: "Titular Absoluto",
  COMPETING: "Disputando Posição",
  ROTATION: "Peça de Rotação",
};

const MAX_ROUNDS = 3;

// ---------------------------------------------------------------------------
// Deterministic "club personality" helpers so the same club/player pairing
// negotiates the same way every time you open this modal in a save,
// instead of re-rolling on every re-render.
// ---------------------------------------------------------------------------

function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h = (h ^= h >>> 16) >>> 0;
  return h / 4294967296;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContractNegotiationModal({
  player,
  team,
  type,
  onComplete,
  onCancel,
}: {
  player: Player;
  team: Team;
  type: "PRO" | "TRANSFER" | "RENEWAL";
  onComplete: (salary: number, years: number, details: ContractExtras) => void;
  onCancel?: () => void;
}) {
  // --- Club context: how badly do they want you, and how deep are their pockets? ---
  const ctx = useMemo(() => {
    const marketValue = player.marketValue;
    const tier = clamp(Math.log10(marketValue + 1) / 7, 0, 1); // 0 (unknown) .. 1 (superstar)

    const teamAny = team as unknown as Record<string, unknown>;
    const reputationField =
      typeof teamAny.reputation === "number"
        ? clamp((teamAny.reputation as number) / 100, 0, 1)
        : typeof teamAny.prestige === "number"
        ? clamp((teamAny.prestige as number) / 100, 0, 1)
        : undefined;

    const clubPower = reputationField ?? clamp(0.25 + seededRandom(`${team.name}|power`) * 0.65, 0, 1);
    const interest = clamp(
      0.3 + seededRandom(`${player.name}${team.name}|interest`) * 0.5 + tier * 0.2,
      0,
      1
    );

    let leverage = false;
    let leverageLabel = "";
    if (type === "TRANSFER") {
      leverage = seededRandom(`${player.name}|suitors`) < clamp(0.25 + tier * 0.45, 0, 0.85);
      leverageLabel = "Outros clubes de olho em você";
    } else if (type === "RENEWAL") {
      leverage = seededRandom(`${player.name}${team.name}|expiring`) < 0.4;
      leverageLabel = "Seu contrato está perto do fim";
    } else {
      leverage = seededRandom(`${player.name}|scouted`) < clamp(0.15 + tier * 0.3, 0, 0.6);
      leverageLabel = "Olheiros de outros clubes te acompanham";
    }

    const clubConfidence = clamp(interest * 0.6 + tier * 0.4, 0, 1);

    let openingMultiplier = 0.78 + clubPower * 0.12 + interest * 0.18 + (leverage ? 0.08 : 0);
    if (type === "PRO") openingMultiplier *= 0.8;
    if (type === "RENEWAL" && !leverage) openingMultiplier *= 0.95;

    const fairSalary = marketValue * 0.12;
    const idealSalary = Math.max(80, Math.round((fairSalary * openingMultiplier) / 10) * 10);
    const idealYears = clamp(Math.round(2 + interest * 3), 1, 5);
    const idealBonusPct = Math.round(4 + clubPower * 10 + interest * 6);
    const idealClauseMultiplier = 3 + interest * 3;
    const idealReleaseClause = Math.round((marketValue * idealClauseMultiplier) / 100) * 100;
    const idealRole: SquadRole = clubConfidence > 0.6 ? "STARTER" : clubConfidence > 0.35 ? "COMPETING" : "ROTATION";

    const clubIdeal: OfferTerms = {
      salary: idealSalary,
      years: idealYears,
      signingBonusPct: idealBonusPct,
      releaseClause: idealReleaseClause,
      role: idealRole,
    };

    return { marketValue, clubPower, interest, leverage, leverageLabel, clubConfidence, clubIdeal };
  }, [player.marketValue, player.name, team.name, type]);

  const { marketValue, clubPower, interest, leverage, leverageLabel, clubConfidence, clubIdeal } = ctx;

  const minSalary = Math.max(80, clubIdeal.salary * 0.6);
  const maxSalary = clubIdeal.salary * 2.2;

  // --- Negotiation state ---
  const [clubOffer, setClubOffer] = useState<OfferTerms>(clubIdeal);
  const [phase, setPhase] = useState<Phase>("review");
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [dismissed, setDismissed] = useState(false);

  // What you're asking for, while in "negotiate" mode.
  const [askSalary, setAskSalary] = useState(clubIdeal.salary);
  const [askYears, setAskYears] = useState(clubIdeal.years);
  const [askBonusPct, setAskBonusPct] = useState(clubIdeal.signingBonusPct);
  const [askReleaseClause, setAskReleaseClause] = useState(clubIdeal.releaseClause);
  const [askNoClause, setAskNoClause] = useState(false);
  const [askRole, setAskRole] = useState<SquadRole>(clubIdeal.role);

  const ask: OfferTerms = {
    salary: askSalary,
    years: askYears,
    signingBonusPct: askBonusPct,
    releaseClause: askNoClause ? 0 : askReleaseClause,
    role: askRole,
  };

  const scores = useMemo(() => evaluateClubWillingness(ask, clubConfidence, clubIdeal), [
    askSalary,
    askYears,
    askBonusPct,
    askReleaseClause,
    askNoClause,
    askRole,
    clubConfidence,
    clubIdeal,
  ]);

  // Optional: flag if your ask would strain the club's wage budget, if the Team type exposes one.
  const teamAny = team as unknown as Record<string, unknown>;
  const budget =
    typeof teamAny.wageBudget === "number"
      ? (teamAny.wageBudget as number)
      : typeof teamAny.budget === "number"
      ? (teamAny.budget as number)
      : undefined;
  const askBonusAbs = Math.round((askSalary * askBonusPct) / 100);
  const askFirstYearCost = askSalary + askBonusAbs;
  const overBudget = budget !== undefined && askFirstYearCost > budget;

  function startNegotiating() {
    setAskSalary(clubOffer.salary);
    setAskYears(clubOffer.years);
    setAskBonusPct(clubOffer.signingBonusPct);
    setAskNoClause(clubOffer.releaseClause === 0);
    setAskReleaseClause(clubOffer.releaseClause || clubIdeal.releaseClause);
    setAskRole(clubOffer.role);
    setPhase("negotiate");
  }

  function acceptOffer(offer: OfferTerms) {
    onComplete(offer.salary, offer.years, {
      signingBonus: Math.round((offer.salary * offer.signingBonusPct) / 100),
      releaseClause: offer.releaseClause,
      role: offer.role,
    });
  }

  function handleSubmitCounter() {
    const s = scores;
    let outcome: Outcome;
    let clubResponse: OfferTerms | undefined;

    if (s.overall <= 15) {
      outcome = "withdrawn";
    } else if (s.overall >= 78) {
      outcome = "accepted";
    } else if (s.overall <= 32) {
      outcome = "rejected";
      clubResponse = buildClubCounter(clubOffer, ask, s.overall);
    } else {
      const roll = Math.random() * 100;
      if (roll <= s.overall) {
        outcome = "accepted";
      } else {
        outcome = "rejected";
        clubResponse = buildClubCounter(clubOffer, ask, s.overall);
      }
    }

    const message = getClubMessage(outcome, s);
    setHistory((h) => [...h, { round, ask, scores: s, outcome, message, clubResponse }]);

    if (outcome === "accepted") {
      acceptOffer(ask);
      return;
    }
    if (outcome === "withdrawn") {
      setPhase("withdrawn");
      return;
    }

    // rejected with a counter from the club
    const nextRound = round + 1;
    setClubOffer(clubResponse as OfferTerms);
    setRound(nextRound);
    setPhase(nextRound > MAX_ROUNDS ? "final" : "review");
  }

  function handleCancel() {
    if (onCancel) onCancel();
    else setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-xl w-full space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center">
          <FileSignature className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-slate-100">
            {type === "PRO"
              ? "Seu Primeiro Contrato Profissional"
              : type === "TRANSFER"
              ? `Proposta do ${team.name}`
              : "Renovação com seu Clube"}
          </h3>
          <p className="text-slate-400 mt-2">
            Seu Valor de Mercado: <strong className="text-emerald-400">{formatCurrency(marketValue)}</strong>
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge
              icon={<Building2 className="w-3.5 h-3.5" />}
              color={clubPower > 0.66 ? "emerald" : clubPower > 0.33 ? "blue" : "slate"}
              label={`Clube ${clubPower > 0.66 ? "Rico" : clubPower > 0.33 ? "Estável" : "Modesto"}`}
            />
            <Badge
              icon={<Flame className="w-3.5 h-3.5" />}
              color={interest > 0.66 ? "amber" : interest > 0.33 ? "blue" : "slate"}
              label={`${interest > 0.66 ? "Muito Interessado" : interest > 0.33 ? "Interesse Moderado" : "Cauteloso"}`}
            />
            {leverage && <Badge icon={<ArrowLeftRight className="w-3.5 h-3.5" />} color="amber" label={leverageLabel} />}
            <Badge icon={<Clock className="w-3.5 h-3.5" />} color="slate" label={`Rodada ${Math.min(round, MAX_ROUNDS)} de ${MAX_ROUNDS}`} />
          </div>
        </div>

        {/* Negotiation history */}
        {history.length > 0 && (
          <div className="space-y-2">
            {history.map((entry, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 text-sm border ${
                  entry.outcome === "accepted"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : "bg-red-500/10 border-red-500/20 text-red-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  {entry.outcome === "accepted" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="text-slate-300">
                      Sua contraproposta ({`rodada ${entry.round}`}): {formatCurrency(entry.ask.salary)}/ano •{" "}
                      {entry.ask.years} {entry.ask.years === 1 ? "temporada" : "temporadas"} •{" "}
                      {ROLE_LABEL[entry.ask.role]}
                    </p>
                    <p className="italic">{entry.message}</p>
                    {entry.clubResponse && (
                      <p className="text-slate-400 not-italic">
                        Nova proposta do clube: {formatCurrency(entry.clubResponse.salary)}/ano •{" "}
                        {entry.clubResponse.years} {entry.clubResponse.years === 1 ? "temporada" : "temporadas"} •{" "}
                        {entry.clubResponse.releaseClause === 0
                          ? "sem cláusula"
                          : formatCurrency(entry.clubResponse.releaseClause) + " de cláusula"}{" "}
                        • {ROLE_LABEL[entry.clubResponse.role]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {phase === "withdrawn" && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              O {team.name} considerou sua contraproposta abusiva e encerrou as negociações.
            </p>
          </div>
        )}

        {(phase === "review" || phase === "final") && (
          <div className="space-y-4">
            {phase === "final" && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Esta é a proposta final do clube. Não há mais espaço para contrapropostas.</p>
              </div>
            )}

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300 text-sm font-bold mb-1">
                {round === 1 && history.length === 0
                  ? `O ${team.name} apresentou a seguinte proposta:`
                  : "Proposta atualizada do clube:"}
              </p>
              <OfferRow label="Salário Anual" value={formatCurrency(clubOffer.salary)} color="text-emerald-400" />
              <OfferRow
                label="Duração"
                value={`${clubOffer.years} ${clubOffer.years === 1 ? "temporada" : "temporadas"}`}
                color="text-blue-400"
              />
              <OfferRow
                label="Luvas (Assinatura)"
                value={`${clubOffer.signingBonusPct}% • ${formatCurrency(
                  Math.round((clubOffer.salary * clubOffer.signingBonusPct) / 100)
                )}`}
                color="text-emerald-400"
              />
              <OfferRow
                label="Cláusula de Rescisão"
                value={clubOffer.releaseClause === 0 ? "Sem cláusula" : formatCurrency(clubOffer.releaseClause)}
                color="text-blue-400"
              />
              <OfferRow label="Papel no Elenco" value={ROLE_LABEL[clubOffer.role]} color="text-slate-200" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
              >
                Recusar
              </button>
              {phase === "review" && (
                <button
                  onClick={startNegotiating}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition-all"
                >
                  Negociar
                </button>
              )}
              <button
                onClick={() => acceptOffer(clubOffer)}
                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
              >
                <Handshake className="w-5 h-5" />
                Aceitar Proposta
              </button>
            </div>
          </div>
        )}

        {phase === "negotiate" && (
          <>
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3">
                  Duração Pedida:{" "}
                  <span className="text-blue-400">
                    {askYears} {askYears === 1 ? "Temporada" : "Temporadas"}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={askYears}
                  onChange={(e) => setAskYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3 flex justify-between">
                  <span>Salário Anual Pedido</span>
                  <span className="text-emerald-400">{formatCurrency(askSalary)}</span>
                </label>
                <input
                  type="range"
                  min={minSalary}
                  max={maxSalary}
                  step={Math.max(1, clubIdeal.salary * 0.01)}
                  value={askSalary}
                  onChange={(e) => setAskSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>Proposta do clube ({formatCurrency(clubOffer.salary)})</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3 flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-slate-400" /> Luvas Pedidas
                  </span>
                  <span className="text-emerald-400">
                    {askBonusPct}% • {formatCurrency(askBonusAbs)}
                  </span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={askBonusPct}
                  onChange={(e) => setAskBonusPct(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-xs text-slate-500 mt-2">Pagamento único na assinatura, além do salário anual.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-slate-300 text-sm font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400" /> Cláusula de Rescisão Pedida
                  </label>
                  <button
                    onClick={() => setAskNoClause((v) => !v)}
                    className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${
                      askNoClause
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {askNoClause ? "Sem cláusula" : "Definir valor"}
                  </button>
                </div>
                <input
                  type="range"
                  min={marketValue * 1}
                  max={marketValue * 8}
                  step={Math.max(1, marketValue * 0.1)}
                  value={askReleaseClause}
                  disabled={askNoClause}
                  onChange={(e) => setAskReleaseClause(Number(e.target.value))}
                  className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 ${
                    askNoClause ? "opacity-40 pointer-events-none" : ""
                  }`}
                />
                <p className="text-xs text-slate-500 mt-2">
                  {askNoClause
                    ? "Sem cláusula: te dá liberdade total no futuro, mas o clube resiste mais a esse pedido."
                    : "Uma cláusula mais alta agrada o clube e pode compensar um salário mais ousado, mas reduz sua liberdade futura."}
                </p>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3">Papel no Elenco Pedido</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(ROLE_LABEL) as SquadRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setAskRole(r)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                        askRole === r
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {ROLE_LABEL[r]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">Chance de Aceite</span>
                <span
                  className={`text-sm font-black ${
                    scores.overall >= 78
                      ? "text-emerald-400"
                      : scores.overall >= 55
                      ? "text-blue-400"
                      : scores.overall >= 32
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {Math.round(scores.overall)}%
                </span>
              </div>
              <MeterBar value={scores.overall} />
              <p className="text-xs text-slate-400">{getVerdictText(scores.overall)}</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                <MiniMeter label="Salário" value={scores.salaryScore} />
                <MiniMeter label="Papel" value={scores.roleScore} />
                <MiniMeter label="Cláusula" value={scores.releaseScore} />
                <MiniMeter label="Duração" value={scores.yearsScore} />
              </div>
            </div>

            {budget !== undefined && (
              <div
                className={`rounded-lg p-3 text-xs flex items-center gap-2 border ${
                  overBudget
                    ? "bg-red-500/10 border-red-500/20 text-red-300"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400"
                }`}
              >
                <Wallet className="w-4 h-4 shrink-0" />
                <span>
                  Custo no 1º ano: {formatCurrency(askFirstYearCost)} • Orçamento do clube: {formatCurrency(budget)}
                  {overBudget && " — pode estar acima do que eles conseguem pagar"}
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setPhase("review")}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitCounter}
                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
              >
                <Handshake className="w-5 h-5" />
                Enviar Contraproposta
              </button>
            </div>
          </>
        )}

        {phase === "withdrawn" && (
          <button
            onClick={handleCancel}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scoring — represents the CLUB's willingness to accept what you're asking for.
// ---------------------------------------------------------------------------

function evaluateClubWillingness(
  ask: OfferTerms,
  clubConfidence: number,
  clubIdeal: OfferTerms
): WillingnessScores {
  const salaryRatio = ask.salary / clubIdeal.salary;
  const salaryScore = salaryRatio <= 1 ? 100 : clamp(100 - (salaryRatio - 1) * 140, 0, 100);

  const bonusRatio = ask.signingBonusPct / Math.max(1, clubIdeal.signingBonusPct);
  const bonusScore = bonusRatio <= 1 ? 100 : clamp(100 - (bonusRatio - 1) * 90, 0, 100);

  const clauseRatio = ask.releaseClause / Math.max(1, clubIdeal.releaseClause);
  const releaseScore = clauseRatio >= 1 ? 100 : clamp(100 - (1 - clauseRatio) * 90, 0, 100);

  const yearsScore = clamp(100 - Math.abs(ask.years - clubIdeal.years) * 18, 0, 100);

  const roleScore =
    ask.role === "STARTER"
      ? clamp(clubConfidence * 140, 0, 100)
      : ask.role === "COMPETING"
      ? clamp(70 + clubConfidence * 30, 0, 100)
      : 100;

  const overall =
    0.36 * salaryScore + 0.18 * roleScore + 0.18 * releaseScore + 0.14 * yearsScore + 0.14 * bonusScore;

  return { salaryScore, roleScore, releaseScore, yearsScore, bonusScore, overall };
}

function buildClubCounter(clubOffer: OfferTerms, ask: OfferTerms, overall: number): OfferTerms {
  // The worse your ask scored, the less the club moves toward it.
  const w = clamp(overall / 140, 0.1, 0.65);
  const releaseClause =
    Math.round(((clubOffer.releaseClause * (1 - w) + ask.releaseClause * w) / 100)) * 100;
  return {
    salary: Math.round((clubOffer.salary * (1 - w) + ask.salary * w) / 10) * 10,
    years: clamp(Math.round(clubOffer.years * (1 - w) + ask.years * w), 1, 5),
    signingBonusPct: Math.round(clubOffer.signingBonusPct * (1 - w) + ask.signingBonusPct * w),
    releaseClause,
    role: w > 0.4 ? ask.role : clubOffer.role,
  };
}

function getVerdictText(overall: number): string {
  if (overall >= 78) return "O clube tende a aceitar esses termos.";
  if (overall >= 55) return "Uma proposta equilibrada — boas chances de avançar.";
  if (overall >= 32) return "O clube provavelmente vai resistir e contra-argumentar.";
  return "Esses termos são pouco realistas para o clube.";
}

function getClubMessage(outcome: Outcome, scores: WillingnessScores): string {
  if (outcome === "accepted") {
    if (scores.overall >= 92) return "A diretoria topou seus termos sem hesitar.";
    if (scores.overall >= 78) return "Depois de avaliar, o clube aceitou sua contraproposta.";
    return "Foi por pouco, mas a diretoria decidiu fechar com você.";
  }

  if (outcome === "withdrawn") {
    return "A diretoria classificou o pedido como fora da realidade e encerrou o contato.";
  }

  const deficits: Record<string, number> = {
    salary: (100 - scores.salaryScore) * 0.36,
    role: (100 - scores.roleScore) * 0.18,
    release: (100 - scores.releaseScore) * 0.18,
    years: (100 - scores.yearsScore) * 0.14,
    bonus: (100 - scores.bonusScore) * 0.14,
  };
  const worst = Object.entries(deficits).sort((a, b) => b[1] - a[1])[0][0];

  const messages: Record<string, string> = {
    salary: "A diretoria diz que o salário pedido está acima do que conseguem pagar agora.",
    role: "O clube não está confortável em garantir esse papel no elenco ainda.",
    release: "O clube quer uma cláusula de rescisão mais alta para se proteger.",
    years: "A duração pedida não encaixa nos planos do clube no momento.",
    bonus: "As luvas pedidas pesam demais no caixa do clube neste momento.",
  };

  return messages[worst];
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function Badge({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: "amber" | "blue" | "slate" | "emerald";
}) {
  const colors: Record<string, string> = {
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    slate: "bg-slate-800 border-slate-700 text-slate-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${colors[color]}`}>
      {icon}
      {label}
    </span>
  );
}

function OfferRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}

function MeterBar({ value }: { value: number }) {
  const color = value >= 78 ? "bg-emerald-500" : value >= 55 ? "bg-blue-500" : value >= 32 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${clamp(value, 0, 100)}%` }} />
    </div>
  );
}

function MiniMeter({ label, value }: { label: string; value: number }) {
  const color = value >= 78 ? "bg-emerald-500" : value >= 55 ? "bg-blue-500" : value >= 32 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${clamp(value, 0, 100)}%` }} />
      </div>
    </div>
  );
}
