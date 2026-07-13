import { FileSignature } from "lucide-react";

export function ProContractModal({ onAccept, onReject }: { onAccept: () => void; onReject: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-6">
        <h3 className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-3 mb-2">
          <FileSignature className="w-8 h-8" /> 
          Contrato Profissional!
        </h3>
        <p className="text-slate-300 text-lg">
          O treinador do time principal quer te promover para o elenco profissional. Você aceita o desafio?
        </p>
        <div className="flex gap-4 pt-4">
          <button 
            onClick={onReject}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
          >
            Recusar (Ficar na Base)
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all"
          >
            Assinar Contrato
          </button>
        </div>
      </div>
    </div>
  );
}
