import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add state
state_pattern = r'const \[showRelationships, setShowRelationships\] = useState\(false\);'
state_repl = 'const [showRelationships, setShowRelationships] = useState(false);\n  const [showRetireConfirm, setShowRetireConfirm] = useState(false);'
content = content.replace(state_pattern, state_repl)

# Replace button
old_button = """              {!player.retired && (
                <button
                  onClick={() => {
                    if (window.confirm("Tem certeza que deseja se aposentar agora? Esta ação é irreversível.")) {
                      onUpdatePlayer({ ...player, retired: true });
                    }
                  }}
                  className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-red-900/50"
                >
                  <Calendar className="w-4 h-4" />
                  Aposentar-se
                </button>
              )}"""

new_button = """              {!player.retired && (
                <>
                  {!showRetireConfirm ? (
                    <button
                      onClick={() => setShowRetireConfirm(true)}
                      className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-red-900/50"
                    >
                      <Calendar className="w-4 h-4" />
                      Aposentar-se
                    </button>
                  ) : (
                    <div className="w-full p-3 bg-red-900/20 border border-red-900/50 rounded-xl flex flex-col gap-2">
                      <span className="text-xs text-red-400 font-medium text-center">Tem certeza? Irreversível.</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onUpdatePlayer({ ...player, retired: true })}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all"
                        >
                          Sim, Aposentar
                        </button>
                        <button
                          onClick={() => setShowRetireConfirm(false)}
                          className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-lg transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}"""

content = content.replace(old_button, new_button)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
