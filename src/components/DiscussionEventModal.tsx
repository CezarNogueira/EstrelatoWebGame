import { X, MessageCircleWarning } from "lucide-react";

export type DiscussionChoice = {
  id: string;
  label: string;
  tone: "safe" | "risky" | "positive" | "neutral";
};

export function DiscussionEventModal({
  personName,
  relationType,
  onChoice
}: {
  personName: string;
  relationType: "family" | "friend" | "girlfriend";
  onChoice: (choiceId: string) => void;
}) {
  const choices: DiscussionChoice[] = [
    { id: "pedir_desculpas", label: "Pedir desculpas e tentar reatar", tone: "positive" },
    { id: "ignorar", label: "Ignorar e afastar-se definitivamente", tone: "neutral" },
    { id: "brigar", label: "Discutir mais e mandar ir embora", tone: "risky" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircleWarning className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white mb-4">Crise no Relacionamento!</h2>
        <p className="text-slate-400 mb-8">
          Sua relação com <strong className="text-white">{personName}</strong> chegou a 0%. Uma grande discussão aconteceu. Como você vai lidar com isso?
        </p>

        <div className="space-y-3">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice.id)}
              className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all ${
                choice.tone === "positive" ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20" :
                choice.tone === "risky" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" :
                choice.tone === "neutral" ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700" :
                "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
              }`}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
