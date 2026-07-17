import { UserPlus, X } from "lucide-react";
import { Friend } from "../types";
import { sanitizeAvatar } from "../data";

export function NewFriendModal({
  friend,
  onAccept,
  onDecline
}: {
  friend: Friend;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto overflow-hidden">
          {friend.avatarUrl ? <img src={sanitizeAvatar(friend.avatarUrl, friend.name)} alt={friend.name} className="w-full h-full object-cover" /> : <UserPlus className="w-8 h-8" />}
        </div>
        <div>
          <h3 className="text-xl font-black text-emerald-400">Novo Amigo!</h3>
          <p className="text-slate-300 mt-2">Você conheceu {friend.name} ({friend.relationTag}).</p>
          <div className="mt-3 text-sm text-slate-400">
            <p><strong>Idade:</strong> {friend.age} anos</p>
            <p><strong>Ocupação:</strong> {friend.occupation}</p>
          </div>
          <p className="text-slate-300 mt-4 font-bold">Deseja adicionar aos seus contatos?</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onAccept}
            className="w-full py-3 rounded-xl font-bold border bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400 transition-all"
          >
            Fazer Amizade
          </button>
          <button
            onClick={onDecline}
            className="w-full py-3 rounded-xl font-bold border bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 transition-all"
          >
            Ignorar
          </button>
        </div>
      </div>
    </div>
  );
}
