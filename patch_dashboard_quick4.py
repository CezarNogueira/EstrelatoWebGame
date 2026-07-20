import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

pattern = r'<button[^>]*onClick=\{\(\) => setShowPhone\(true\)\}.*?Celular\s*</button>\s*\{player\.mode !== "QUICK" && \(\s*<button[^>]*onClick=\{\(\) => setShowCityMap\(true\)\}.*?Mapa da Cidade\s*</button>\s*</>\s*\)\}'

def repl(m):
    return """{player.mode !== "QUICK" && (
                <>
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700 relative"
                  >
                    <div className="relative">
                      <Smartphone className="w-4 h-4" />
                      {hasUnreadMessages && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-800"></div>
                      )}
                    </div>
                    Celular
                  </button>
                  <button
                    onClick={() => setShowCityMap(true)}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <MapPin className="w-4 h-4" />
                    Mapa da Cidade
                  </button>
                </>
              )}"""

new_content = re.sub(pattern, repl, content, flags=re.DOTALL)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(new_content)
