import { Heart, Sparkles } from "lucide-react";
import { RomanceEvent, RomanceChoiceTone } from "../types";
import { sanitizeAvatar } from "../data";

// Estilos por "tom" da escolha, para deixar claro visualmente
// qual opção é mais segura e qual é mais arriscada (pode gerar
// climão na imprensa, com a diretoria, etc).
const TONE_STYLES: Record<RomanceChoiceTone, string> = {
  safe: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
  risky: "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400",
  neutral: "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300",
  positive: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-400",
};

export function RomanceEventModal({
  event,
  onChoice,
}: {
  event: RomanceEvent;
  onChoice: (choiceId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
        {/* Cabeçalho com quem está envolvido na situação */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
            {event.avatarUrl ? <img src={sanitizeAvatar(event.avatarUrl, event.personName)} alt={event.personName} draggable="false" className="w-full h-full object-cover" /> : <Heart className="w-6 h-6 text-pink-400" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-slate-100 font-bold leading-tight truncate">{event.personName}</div>
            <div className="text-xs text-slate-500 font-medium">{event.relationTag}</div>
          </div>
          {(event.age || event.occupation) && (
            <div className="text-right text-xs text-slate-400">
              {event.age && <div>{event.age} anos</div>}
              {event.occupation && <div>{event.occupation}</div>}
            </div>
          )}
        </div>

        {/* Título e descrição do evento */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-pink-400">{event.title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
          <p className="text-slate-400 text-sm font-bold pt-2">O que você vai fazer?</p>
        </div>

        {/* Barra de "Atração", no espírito da barra "Her Looks" do exemplo */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
            <span>Atração</span>
            <span className="text-pink-400">{event.attraction}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${event.attraction}%` }}
            />
          </div>
        </div>

        {/* Opções de escolha */}
        <div className="flex flex-col gap-3">
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice.id)}
              className={`w-full py-3 rounded-xl font-bold border transition-all ${TONE_STYLES[choice.tone]}`}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Três variações de cenário prontas para usar. Basta escolher uma
// aleatoriamente (ou por contexto de carreira) e passar para o
// componente RomanceEventModal via prop `event`.
export const ROMANCE_EVENTS: RomanceEvent[] = [
  {
    id: "proposta-indecente",
    personName: "Clara",
    relationTag: "Esposa do seu Melhor Amigo",
    title: "Proposta Indecente",
    description:
      "Você está jantando na casa do seu melhor amigo quando Clara, esposa dele, aparece e pede, com um sorriso sugestivo, se pode 'pegar um pouco de açúcar emprestado' com você a sós na cozinha.",
    attraction: 78,
    choices: [
      { id: "ficar-com-ela", label: "Ficar com ela", tone: "risky" },
      { id: "contar-ao-amigo", label: "Contar tudo ao seu amigo", tone: "safe" },
      { id: "ignorar", label: "Ignorar e voltar para a mesa", tone: "neutral" },
      { id: "fingir-nao-entender", label: "Fingir que não entendeu a indireta", tone: "neutral" },
    ],
  },
  {
    id: "fa-apaixonada",
    personName: "Camila",
    relationTag: "Torcedora",
    title: "Fã de Carteirinha",
    description:
      "Depois da partida, uma torcedora te espera na saída do estádio. Ela pede uma foto, mas na hora do clique sussurra que adoraria continuar a conversa em um lugar mais tranquilo.",
    attraction: 64,
    choices: [
      { id: "aceitar-convite", label: "Aceitar o convite dela", tone: "risky" },
      { id: "so-foto", label: "Tirar a foto e seguir seu caminho", tone: "safe" },
      { id: "pedir-contato", label: "Pedir o contato dela para depois", tone: "positive" },
      { id: "pedir-selfie-time", label: "Chamar mais fãs para uma foto em grupo", tone: "neutral" },
    ],
  },
  {
    id: "balada-badalada",
    personName: "Bianca",
    relationTag: "Influenciadora",
    title: "Balada Badalada",
    description:
      "Numa balada concorrida, cheia de paparazzi na porta, uma influenciadora bem conhecida se aproxima na pista e convida você para conhecer o camarote VIP dela.",
    attraction: 71,
    choices: [
      { id: "ir-ao-camarote", label: "Aceitar e ir ao camarote com ela", tone: "risky" },
      { id: "sair-discretamente", label: "Agradecer e sair discretamente da balada", tone: "safe" },
      { id: "chamar-amigos", label: "Convidar seus amigos para o grupo todo se juntar", tone: "neutral" },
      { id: "foto-rede-social", label: "Só tirar uma foto para postar depois", tone: "positive" },
    ],
  },
];
