import { useState } from "react";
import { motion } from "motion/react";
import { Player, PlayStyle, PlayStyleLevel } from "../types";
import { PLAY_STYLES, PLAY_STYLE_LEVEL_CHANCE, PLAY_STYLE_LEVEL_LABEL, getNextPlayStyleLevel } from "../data";
import { Crosshair, Target, MoveRight, Activity, Rocket, Shield, Sparkles, ChevronRight, ArrowUpCircle } from "lucide-react";

const ICONS: Record<PlayStyle, typeof Crosshair> = {
  chute_colocado: Crosshair,
  forca_aerea: Target,
  tiki_taka: MoveRight,
  cruzamento_preciso: Activity,
  veloz: Rocket,
  xerife: Shield,
};

const COLORS: Record<PlayStyle, { text: string; bg: string; border: string }> = {
  chute_colocado: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/40" },
  forca_aerea: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/40" },
  tiki_taka: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40" },
  cruzamento_preciso: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/40" },
  veloz: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/40" },
  xerife: { text: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/40" },
};

const LEVEL_DOT: Record<PlayStyleLevel, string> = {
  bronze: "bg-orange-400",
  prata: "bg-slate-300",
  dourado: "bg-yellow-400",
};

type Selection = { type: "new"; id: PlayStyle } | { type: "upgrade"; id: PlayStyle };

export function PlayStyleModal({
  player,
  milestone,
  onSelect,
}: {
  player: Player;
  milestone: number;
  onSelect: (choice: Selection) => void;
}) {
  const [selection, setSelection] = useState<Selection | null>(null);

  const owned = player.playStyles || [];
  const upgradable = owned.filter((ps) => ps.level !== "dourado");
  const unowned = PLAY_STYLES.filter((s) => !owned.some((ps) => ps.id === s.id));
  const isFirstUnlock = owned.length === 0;

  const isSelected = (sel: Selection) =>
    !!selection && selection.type === sel.type && selection.id === sel.id;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1f2e] border border-emerald-500/30 p-8 rounded-3xl shadow-2xl max-w-2xl w-full relative overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-600 shrink-0"></div>

        <div className="text-center mb-6 relative z-10 shrink-0">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white">
            {isFirstUnlock ? "PlayStyle Desbloqueado!" : "Evolução de PlayStyle!"}
          </h2>
          <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
            {player.name} alcançou <strong className="text-emerald-400">{milestone} de Overall</strong>.{" "}
            {isFirstUnlock
              ? "Escolha o seu primeiro PlayStyle - ele vai garantir jogadas decisivas dentro das partidas!"
              : upgradable.length > 0 && unowned.length > 0
              ? "Escolha entre evoluir o nível de um PlayStyle que já tem ou desbloquear um novo."
              : upgradable.length > 0
              ? "Escolha qual PlayStyle você quer evoluir de nível."
              : "Escolha um novo PlayStyle para desbloquear."}
          </p>
        </div>

        <div className="overflow-y-auto custom-scrollbar pr-1 space-y-6">
          {upgradable.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowUpCircle className="w-4 h-4 text-emerald-400" /> Melhorar PlayStyle
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upgradable.map((ps) => {
                  const info = PLAY_STYLES.find((s) => s.id === ps.id)!;
                  const Icon = ICONS[ps.id];
                  const color = COLORS[ps.id];
                  const nextLevel = getNextPlayStyleLevel(ps.level)!;
                  const sel: Selection = { type: "upgrade", id: ps.id };
                  const selected = isSelected(sel);
                  return (
                    <button
                      key={ps.id}
                      onClick={() => setSelection(sel)}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
                        selected
                          ? `${color.bg} ${color.border} ring-2 ring-offset-2 ring-offset-[#1a1f2e] ring-emerald-500`
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.bg} border ${color.border} shrink-0`}>
                          <Icon className={`w-5 h-5 ${color.text}`} />
                        </div>
                        <div>
                          <h4 className={`font-bold ${color.text}`}>{info.name}</h4>
                          <p className="text-slate-500 text-xs flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${LEVEL_DOT[ps.level]}`}></span>
                            {PLAY_STYLE_LEVEL_LABEL[ps.level]} ({PLAY_STYLE_LEVEL_CHANCE[ps.level]}%)
                            <ChevronRight className="w-3 h-3" />
                            <span className={`w-2 h-2 rounded-full ${LEVEL_DOT[nextLevel]}`}></span>
                            {PLAY_STYLE_LEVEL_LABEL[nextLevel]} ({PLAY_STYLE_LEVEL_CHANCE[nextLevel]}%)
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {unowned.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Novo PlayStyle (Bronze - {PLAY_STYLE_LEVEL_CHANCE.bronze}%)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unowned.map((style) => {
                  const Icon = ICONS[style.id];
                  const color = COLORS[style.id];
                  const sel: Selection = { type: "new", id: style.id };
                  const selected = isSelected(sel);
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelection(sel)}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
                        selected
                          ? `${color.bg} ${color.border} ring-2 ring-offset-2 ring-offset-[#1a1f2e]`
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.bg} border ${color.border} shrink-0`}>
                          <Icon className={`w-5 h-5 ${color.text}`} />
                        </div>
                        <div>
                          <h4 className={`font-bold ${color.text}`}>{style.name}</h4>
                          <p className="text-slate-500 text-xs">{style.shortDescription}</p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{style.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => selection && onSelect(selection)}
          disabled={!selection}
          className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
        >
          Confirmar <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
