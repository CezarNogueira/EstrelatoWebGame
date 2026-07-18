import re

with open('src/components/PhoneModal.tsx', 'r') as f:
    content = f.read()

messages_old = """              <button 
                onClick={onOpenMessages}
                className="flex flex-col items-center gap-2 relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all hover:scale-105">
                  <MessageCircle className="w-8 h-8" />
                  {hasUnread && (
                    <div className="absolute top-0 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-300">Mensagens</span>
              </button>"""

messages_new = """              {player.mode !== "QUICK" && (
                <button 
                  onClick={onOpenMessages}
                  className="flex flex-col items-center gap-2 relative"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all hover:scale-105">
                    <MessageCircle className="w-8 h-8" />
                    {hasUnread && (
                      <div className="absolute top-0 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"></div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-300">Mensagens</span>
                </button>
              )}"""

content = content.replace(messages_old, messages_new)

with open('src/components/PhoneModal.tsx', 'w') as f:
    f.write(content)
