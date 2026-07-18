import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

map_old = """              <button
                onClick={() => setShowCityMap(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <MapPin className="w-4 h-4" />
                Mapa da Cidade
              </button>"""

map_new = """              {player.mode !== "QUICK" && (
                <button
                  onClick={() => setShowCityMap(true)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <MapPin className="w-4 h-4" />
                  Mapa da Cidade
                </button>
              )}"""

content = content.replace(map_old, map_new)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
