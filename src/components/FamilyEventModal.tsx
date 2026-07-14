import { Users } from "lucide-react";
import { FamilyEvent, RomanceChoiceTone } from "../types";

const TONE_STYLES: Record<RomanceChoiceTone, string> = {
  safe: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
  risky: "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400",
  neutral: "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300",
  positive: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-400",
};

export function FamilyEventModal({
  event,
  personName,
  onChoice,
}: {
  event: FamilyEvent;
  personName: string;
  onChoice: (choiceId: string, event: FamilyEvent) => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div className="min-w-0">
            <div className="text-slate-100 font-bold leading-tight truncate">{personName}</div>
            <div className="text-xs text-slate-500 font-medium">{event.role}</div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-purple-400">{event.title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
          <p className="text-slate-400 text-sm font-bold pt-2">Qual será sua reação?</p>
        </div>

        <div className="flex flex-col gap-3">
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice.id, event)}
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
