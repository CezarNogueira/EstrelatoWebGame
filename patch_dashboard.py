import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix header
old_header = """        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">"""
new_header = """        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 w-full md:w-auto">
            <div className="relative shrink-0 mx-auto sm:mx-0">"""
content = content.replace(old_header, new_header)

old_info = """              <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-400 font-medium">"""
new_info = """              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-slate-400 font-medium">"""
content = content.replace(old_info, new_info)

old_personal = """                <div className="flex gap-4 mt-4">"""
new_personal = """                <div className="flex justify-center sm:justify-start gap-4 mt-4">"""
content = content.replace(old_personal, new_personal)

# Fix history card
old_history = """                      <motion.div
                        key={player.age - idx} // Use age as stable key for history
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4"
                      >
                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-900 rounded-xl shrink-0 border border-slate-800">
                          <span className="text-xs text-slate-500 font-bold uppercase">Idade</span>
                          <span className="text-xl font-black text-slate-200">{stat.age}</span>
                        </div>
                        
                        <div className="flex-1">"""

new_history = """                      <motion.div
                        key={player.age - idx} // Use age as stable key for history
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4"
                      >
                        <div className="flex items-center sm:flex-col sm:justify-center w-full sm:w-16 h-auto sm:h-16 bg-slate-900 rounded-xl shrink-0 border border-slate-800 p-2 sm:p-0 gap-2 sm:gap-0">
                          <span className="text-xs text-slate-500 font-bold uppercase">Idade</span>
                          <span className="text-xl font-black text-slate-200">{stat.age}</span>
                        </div>
                        
                        <div className="flex-1 w-full min-w-0">"""

content = content.replace(old_history, new_history)

old_pts = """                        <div className="text-right shrink-0">
                          <div className="text-emerald-500 font-bold text-sm">
                            +{Object.values(stat.attributeChanges).reduce((a, b) => (a || 0) + (b || 0), 0)} pts
                          </div>
                        </div>"""

new_pts = """                        <div className="w-full sm:w-auto text-left sm:text-right shrink-0 mt-2 sm:mt-0 bg-emerald-500/10 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none flex sm:block items-center justify-between">
                          <span className="text-emerald-400 font-bold text-xs sm:hidden">PONTOS GANHOS</span>
                          <div className="text-emerald-500 font-bold text-sm">
                            +{Object.values(stat.attributeChanges).reduce((a, b) => (a || 0) + (b || 0), 0)} pts
                          </div>
                        </div>"""
content = content.replace(old_pts, new_pts)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
