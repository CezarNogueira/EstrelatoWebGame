import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """              <button
                onClick={() => setShowCityMap(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <MapPin className="w-4 h-4" />
                Mapa da Cidade
              </button>"""

replacement = """              <button
                onClick={() => setShowCityMap(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <MapPin className="w-4 h-4" />
                Mapa da Cidade
              </button>

              {!player.retired && (
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

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/Dashboard.tsx', 'w') as f:
        f.write(content)
        print("Success")
else:
    print("Target not found")
