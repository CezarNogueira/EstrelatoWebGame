import { Player } from "../types";
import { Users, Heart, X } from "lucide-react";

function AffinityBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function RelationshipsModal({ player, onClose, onSpendTime }: { player: Player; onClose: () => void; onSpendTime: (id: string, type: "family" | "friend" | "girlfriend") => void }) {
  const { family, friends, girlfriend } = player.relationships;

  const father = family.find((m) => m.role === "Pai");
  const mother = family.find((m) => m.role === "Mãe");
  const siblings = family.filter((m) => m.role === "Irmão" || m.role === "Irmã");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col space-y-6">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Relações Pessoais
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
          {/* Família */}
          <section>
            <h4 className="text-sm font-bold uppercase text-slate-500 mb-3 tracking-wide">Família</h4>
            {!father && !mother && siblings.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center text-slate-500 italic">
                Você é órfão(ã) e cresceu sem nenhum familiar por perto.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {father && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-100">{father.name}</div>
                      <div className="text-xs text-slate-500">Pai · {father.age} anos</div>
                      <AffinityBar value={father.affinity} />
                    </div>
                    <button onClick={() => onSpendTime(father.id, "family")} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all">
                      Passar tempo
                    </button>
                  </div>
                )}
                {mother && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-100">{mother.name}</div>
                      <div className="text-xs text-slate-500">Mãe · {mother.age} anos</div>
                      <AffinityBar value={mother.affinity} />
                    </div>
                    <button onClick={() => onSpendTime(mother.id, "family")} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all">
                      Passar tempo
                    </button>
                  </div>
                )}
                {siblings.map((s) => (
                  <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-100">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.role} · {s.age} anos</div>
                      <AffinityBar value={s.affinity} />
                    </div>
                    <button onClick={() => onSpendTime(s.id, "family")} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all">
                      Passar tempo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Relacionamento */}
          <section>
            <h4 className="text-sm font-bold uppercase text-slate-500 mb-3 tracking-wide">Relacionamento</h4>
            {girlfriend ? (
              <div className="bg-slate-950 border border-pink-500/20 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">{girlfriend.name}</div>
                      <div className="text-xs text-slate-500">Namorando desde os {girlfriend.sinceAge} anos</div>
                    </div>
                  </div>
                  <AffinityBar value={girlfriend.affinity} />
                </div>
                <button onClick={() => onSpendTime(girlfriend.id, "girlfriend")} className="mt-4 w-full py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg text-sm font-bold border border-pink-500/20 transition-all">
                  Passar tempo
                </button>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center text-slate-500 italic">
                Você está solteiro(a) no momento.
              </div>
            )}
          </section>

          {/* Amigos */}
          <section>
            <h4 className="text-sm font-bold uppercase text-slate-500 mb-3 tracking-wide">
              Amigos ({friends.length})
            </h4>
            {friends.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center text-slate-500 italic">
                Nenhum amigo próximo no momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friends.map((f) => (
                  <div key={f.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-100">{f.name}</div>
                      <div className="text-xs text-slate-500">{f.relationTag}</div>
                      <AffinityBar value={f.affinity} />
                    </div>
                    <button onClick={() => onSpendTime(f.id, "friend")} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all">
                      Passar tempo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
