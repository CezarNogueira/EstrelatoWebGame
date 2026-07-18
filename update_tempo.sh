#!/bin/bash
sed -i '357,377c\
                  {selectedPerson.type === "girlfriend" && (\
                    <>\
                      {player.age >= 18 && (\
                        <button onClick={() => handleTempoAction("amor")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 transition-all gap-1 border border-pink-500/30">\
                          <Heart className="w-6 h-6 text-pink-500" />\
                          <span className="text-xs text-pink-400 font-bold mt-1">Fazer amor</span>\
                        </button>\
                      )}\
                      <button onClick={() => handleTempoAction("cinema")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-all gap-1 border border-blue-500/30">\
                        <Film className="w-6 h-6 text-blue-500" />\
                        <span className="text-xs text-blue-400 font-bold mt-1 text-center leading-tight">Ir ao Cinema</span>\
                      </button>\
                      <button onClick={() => handleTempoAction("jantar")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-all gap-1 border border-orange-500/30">\
                        <Utensils className="w-6 h-6 text-orange-500" />\
                        <span className="text-xs text-orange-400 font-bold mt-1 text-center leading-tight">Jantar</span>\
                      </button>\
                      <button onClick={() => handleTempoAction("sogra")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-all gap-1 border border-emerald-500/30">\
                        <Home className="w-6 h-6 text-emerald-500" />\
                        <span className="text-xs text-emerald-400 font-bold mt-1 text-center leading-tight">Casa da Sogra</span>\
                      </button>\
                    </>\
                  )}\
                  {(selectedPerson.type === "friend" || (selectedPerson.type === "family" && (selectedPerson.role === "Pai" || selectedPerson.role === "Mãe" || selectedPerson.role === "Irmão" || selectedPerson.role === "Irmã"))) && (\
                    <>\
                      <button onClick={() => handleTempoAction("cinema")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-all gap-1 border border-blue-500/30">\
                        <Film className="w-6 h-6 text-blue-500" />\
                        <span className="text-xs text-blue-400 font-bold mt-1 text-center leading-tight">Ir ao Cinema</span>\
                      </button>\
                      {(player.assets.includes("Casa") || player.assets.includes("Mansão")) && (\
                        <button onClick={() => handleTempoAction("visitar")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-all gap-1 border border-emerald-500/30">\
                          <Home className="w-6 h-6 text-emerald-500" />\
                          <span className="text-xs text-emerald-400 font-bold mt-1 text-center leading-tight">Visitar</span>\
                        </button>\
                      )}\
                      {(selectedPerson.type === "friend" || selectedPerson.role === "Irmão" || selectedPerson.role === "Irmã") && (\
                        <button onClick={() => handleTempoAction("jogar")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition-all gap-1 border border-purple-500/30">\
                          <span className="text-2xl">🎮</span>\
                          <span className="text-xs text-purple-400 font-bold mt-1 text-center leading-tight">Jogar Online</span>\
                        </button>\
                      )}\
                      <button onClick={() => handleTempoAction("role")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-all gap-1 border border-orange-500/30">\
                        <span className="text-2xl">😎</span>\
                        <span className="text-xs text-orange-400 font-bold mt-1 text-center leading-tight">Dar Rolê</span>\
                      </button>\
                    </>\
                  )}' src/components/RelationshipsModal.tsx
