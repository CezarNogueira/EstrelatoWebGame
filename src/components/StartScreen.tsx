import { Trophy } from "lucide-react";
import { useState } from "react";

export function StartScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");

  const handleStart = () => {
    if (name.trim()) {
      onStart(name.trim());
    } else {
      onStart("Você");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6 select-none">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-8">
        <div className="p-4 bg-emerald-500/10 rounded-full">
          <Trophy className="w-20 h-20 text-emerald-500" />
        </div>
        
          <h1 className="text-5xl font-black tracking-tight text-slate-100 tracking-wide">ESTRELATO</h1>

        <div className="w-full">
          <input 
            type="text" 
            placeholder="Digite o seu nome..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 px-6 py-4 rounded-xl outline-none focus:border-emerald-500 transition-colors text-lg text-center"
            maxLength={20}
          />
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-slate-100 font-black text-xl rounded-2xl tracking-wide transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
        >
          JOGAR
        </button>
      </div>
    </div>
  );
}
