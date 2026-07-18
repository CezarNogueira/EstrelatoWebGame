import sys

def patch_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Update handleAction
    content = content.replace(
        'addMessage(updatedPlayer, "Passei para dizer que você é excelente no que faz!", response);',
        'addMessage(updatedPlayer, "Passei para dizer que você é excelente no que faz!", response);\n      setAppreciationModal({ message: "Gostou muito do seu elogio e sentiu-se valorizado(a).", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )
    
    content = content.replace(
        'addMessage(updatedPlayer, "E aí, como foi o seu dia? Me conta as novidades.", response);',
        'addMessage(updatedPlayer, "E aí, como foi o seu dia? Me conta as novidades.", response);\n        setAppreciationModal({ message: "Aproveitou bastante a conversa com você.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'addMessage(updatedPlayer, randomConv.me, response);',
        'addMessage(updatedPlayer, randomConv.me, response);\n          setAppreciationModal({ message: "Aproveitou a conversa.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )
    
    content = content.replace(
        'addMessage(updatedPlayer, "Como estão as coisas nos bastidores? Alguma novidade?", response);',
        'addMessage(updatedPlayer, "Como estão as coisas nos bastidores? Alguma novidade?", response);\n         setAppreciationModal({ message: "Gostou de te atualizar sobre os bastidores.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'response = `Claro, te enviei ${formatCurrency(amount)}. Mas vê se não gasta tudo de uma vez, hein!`;',
        'response = `Claro, te enviei ${formatCurrency(amount)}. Mas vê se não gasta tudo de uma vez, hein!`;\n        setAppreciationModal({ message: "Te emprestou o dinheiro, mas ficou um pouco incomodado(a) com a situação.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'response = selectedPerson.type === "staff" ? "Como profissional, eu não empresto dinheiro." : "Sério que você está me pedindo dinheiro? Não vou te dar nada.";',
        'response = selectedPerson.type === "staff" ? "Como profissional, eu não empresto dinheiro." : "Sério que você está me pedindo dinheiro? Não vou te dar nada.";\n        setAppreciationModal({ message: "Ficou ofendido(a) com o seu pedido de dinheiro.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'addMessage(updatedPlayer, "Você é um inútil e só me atrapalha! Sai da minha vida.", response);',
        'addMessage(updatedPlayer, "Você é um inútil e só me atrapalha! Sai da minha vida.", response);\n      setAppreciationModal({ message: "Ficou profundamente magoado(a) e irritado(a) com os seus insultos.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    # Note: tempo action in handleAction already sets showTempoOptions. The else part adds a message:
    content = content.replace(
        'addMessage(updatedPlayer, "Vamos fazer alguma coisa juntos hoje? Estou precisando distrair a cabeça.", response);',
        'addMessage(updatedPlayer, "Vamos fazer alguma coisa juntos hoje? Estou precisando distrair a cabeça.", response);\n      setAppreciationModal({ message: "Adorou passar um tempo com você e se sentiu mais próximo(a).", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    # 2. Update handleTempoAction
    content = content.replace(
        'response = "Nossa, foi incrível... ❤️";',
        'response = "Nossa, foi incrível... ❤️";\n      setAppreciationModal({ message: "Tivemos um momento incrível e íntimo juntos.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'response = "Adorei o filme! E a pipoca tava ótima. 🍿🎥";',
        'response = "Adorei o filme! E a pipoca tava ótima. 🍿🎥";\n      setAppreciationModal({ message: "Curtiu bastante o filme e a sua companhia.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'response = "A comida estava maravilhosa! Obrigada por hoje. 🍷🍽️";',
        'response = "A comida estava maravilhosa! Obrigada por hoje. 🍷🍽️";\n      setAppreciationModal({ message: "Amou o jantar especial que você preparou.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'response = "Sério?? Ai, minha mãe vai ficar tão feliz! Você é o melhor genro do mundo! 🥰🏡";',
        'response = "Sério?? Ai, minha mãe vai ficar tão feliz! Você é o melhor genro do mundo! 🥰🏡";\n      setAppreciationModal({ message: "Ficou extremamente feliz por você ter lembrado dos pais dela.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )
    
    content = content.replace(
        'response = "Massa! Chego aí mais tarde. 🏠";',
        'response = "Massa! Chego aí mais tarde. 🏠";\n      setAppreciationModal({ message: "Gostou muito da resenha na sua casa.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'response = "Bora! Só não vale chorar quando perder! 🎮";',
        'response = "Bora! Só não vale chorar quando perder! 🎮";\n      setAppreciationModal({ message: "Se divertiu muito jogando online com você.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    content = content.replace(
        'response = "Fechado! Vai ser top. 😎";',
        'response = "Fechado! Vai ser top. 😎";\n      setAppreciationModal({ message: "Deu muitas risadas e adorou o rolê.", affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    # 3. Update handleGiftAction
    content = content.replace(
        'addMessage(updatedPlayer, meMessage, response);',
        'addMessage(updatedPlayer, meMessage, response);\n    setAppreciationModal({ message: `Ficou surpreso(a) e muito feliz ao receber o presente!`, affinity: Math.max(0, Math.min(100, newAffinity)) });',
        1 # Only the first occurrence in handleGiftAction (actually there is only one in the whole file after the ones in handleAction? wait)
    )
    # Actually wait, addMessage(updatedPlayer, meMessage, response) is used in handleTempoAction and handleGiftAction!
    # I already replaced the responses in handleTempoAction. Let's do it safely for handleGiftAction:
    content = content.replace(
        'response = `Adorei o presente! Muito obrigado mesmo. ${gift.emoji}`;\n    }\n\n    addMessage(updatedPlayer, meMessage, response);',
        'response = `Adorei o presente! Muito obrigado mesmo. ${gift.emoji}`;\n    }\n\n    addMessage(updatedPlayer, meMessage, response);\n    setAppreciationModal({ message: `Ficou surpreso(a) e muito feliz ao receber: ${gift.name}!`, affinity: Math.max(0, Math.min(100, newAffinity)) });'
    )

    # 4. Hide "Passar Tempo" and "Pedir dinheiro" for staff
    # In the main action buttons grid
    old_buttons = '''                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleAction("elogiar")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <ThumbsUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Elogiar</span>
                  </button>
                  <button onClick={() => handleAction("conversar")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Conversar</span>
                  </button>
                  <button onClick={() => handleAction("tempo")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Passar Tempo</span>
                  </button>
                  <button onClick={() => handleAction("presentear")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <Gift className="w-5 h-5 text-pink-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Presentear</span>
                  </button>
                  <button onClick={() => handleAction("dinheiro")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Pedir Dinheiro</span>
                  </button>
                  <button onClick={() => handleAction("insultar")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <Frown className="w-5 h-5 text-red-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Insultar</span>
                  </button>
                </div>'''
    
    new_buttons = '''                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleAction("elogiar")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <ThumbsUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Elogiar</span>
                  </button>
                  <button onClick={() => handleAction("conversar")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Conversar</span>
                  </button>
                  {selectedPerson.type !== "staff" && (
                    <button onClick={() => handleAction("tempo")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span className="text-[10px] text-slate-300 font-medium">Passar Tempo</span>
                    </button>
                  )}
                  <button onClick={() => handleAction("presentear")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <Gift className="w-5 h-5 text-pink-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Presentear</span>
                  </button>
                  {selectedPerson.type !== "staff" && (
                    <button onClick={() => handleAction("dinheiro")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <span className="text-[10px] text-slate-300 font-medium">Pedir Dinheiro</span>
                    </button>
                  )}
                  <button onClick={() => handleAction("insultar")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#2a3942] hover:bg-[#32454f] transition-all gap-1">
                    <Frown className="w-5 h-5 text-red-400" />
                    <span className="text-[10px] text-slate-300 font-medium">Insultar</span>
                  </button>
                </div>'''
    
    content = content.replace(old_buttons, new_buttons)

    # 5. Append Appreciation Modal at the end
    modal_code = '''
      {appreciationModal && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#202c33] border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
            <h3 className="text-white font-bold text-lg mb-2">Reação</h3>
            <p className="text-slate-300 mb-6 text-sm">{appreciationModal.message}</p>
            
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span>Apreciação</span>
                <span className="text-emerald-400">{appreciationModal.affinity}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${appreciationModal.affinity}%` }}
                />
              </div>
            </div>

            <button 
              onClick={() => setAppreciationModal(null)}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
'''
    content = content.replace('    </div>\n  );\n}', modal_code)

    with open(filepath, 'w') as f:
        f.write(content)

patch_file('src/components/RelationshipsModal.tsx')
