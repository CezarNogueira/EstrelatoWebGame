import { Player, RomanceEvent } from "../types";
import { Users, Heart, X, Search, ChevronLeft, Send, MessageCircle, Info, ThumbsUp, Frown, Gift, CreditCard, Clock, CheckCircle2, Film, Utensils, Home } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { formatCurrency } from "../utils";
import { getCoachAvatar, sanitizeAvatar } from "../data";

const GIFTS = [
  { id: 'flores', name: 'Buquê de Flores', price: 200, affinity: 5, emoji: '💐' },
  { id: 'chocolate', name: 'Caixa de Chocolates', price: 400, affinity: 8, emoji: '🍫' },
  { id: 'perfume', name: 'Perfume Importado', price: 1500, affinity: 12, emoji: '🧴' },
  { id: 'roupa', name: 'Roupa de Grife', price: 4000, affinity: 15, emoji: '👗' },
  { id: 'tenis', name: 'Tênis Exclusivo', price: 8000, affinity: 18, emoji: '👟' },
  { id: 'joia', name: 'Joia de Ouro', price: 20000, affinity: 25, emoji: '💎' },
  { id: 'smartphone', name: 'Smartphone Pro', price: 15000, affinity: 22, emoji: '📱' },
  { id: 'relogio', name: 'Relógio de Luxo', price: 80000, affinity: 35, emoji: '⌚' },
  { id: 'viagem', name: 'Viagem Internacional', price: 150000, affinity: 45, emoji: '✈️' },
  { id: 'carro_pop', name: 'Carro Popular', price: 100000, affinity: 40, emoji: '🚗' },
  { id: 'carro_luxo', name: 'Carro Esportivo', price: 1000000, affinity: 80, emoji: '🏎️' },
  { id: 'casa', name: 'Imóvel', price: 3000000, affinity: 100, emoji: '🏠' },
];

export function RelationshipsModal({ player, onClose, onUpdatePlayer, onTriggerRomanceEvent }: { player: Player; onClose: () => void; onUpdatePlayer: (player: Player) => void; onTriggerRomanceEvent?: (event: RomanceEvent) => void }) {
  const { family, friends, girlfriend } = player.relationships;
  const father = family.find((m) => m.role === "Pai");
  const mother = family.find((m) => m.role === "Mãe");
  const siblings = family.filter((m) => m.role === "Irmão" || m.role === "Irmã");

  const checkFriendRomance = (updatedPlayer: Player, currentAffinity: number) => {
    if (selectedPerson?.type !== "friend") return;
    if (updatedPlayer.relationships.girlfriend) return; // Se já namora, evita complicação
    if (currentAffinity < 60) return; // Afinidade tem que ser razoável
    
    // Chance baseada na afinidade (ex: 60 = 6%, 100 = 10% por ação)
    if (Math.random() < (currentAffinity / 1000)) {
       const event: RomanceEvent = {
         id: `romance_${Date.now()}`,
         friendId: selectedPerson.id,
         personName: selectedPerson.name,
         relationTag: selectedPerson.role || "Amigo", 
         title: "Interesse Amoroso!",
         description: `Depois do tempo que passaram juntos, ${selectedPerson.name} demonstrou ter sentimentos por você além da amizade e sugeriu um encontro especial.`,
         attraction: Math.min(100, currentAffinity + 10),
         age: 18, 
         avatarUrl: selectedPerson.avatarUrl,
         choices: [
           { id: "chamar-encontro", label: "Aceitar o encontro", tone: "positive" },
           { id: "apenas-amizade", label: "Dizer que prefere só amizade", tone: "safe" },
           { id: "nao-fazer-nada", label: "Desconversar", tone: "neutral" },
         ]
       };
       setTimeout(() => {
         onTriggerRomanceEvent?.(event);
       }, 2000);
    }
  };

  const [selectedPerson, setSelectedPerson] = useState<{ id: string, type: "family" | "friend" | "girlfriend" | "staff", name: string, role: string, affinity: number, avatarUrl?: string } | null>(null);
  const [showTempoOptions, setShowTempoOptions] = useState(false);
  const [showGiftOptions, setShowGiftOptions] = useState(false);
  const [appreciationModal, setAppreciationModal] = useState<{message: string; affinity: number} | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentMessages = selectedPerson && player.chats && player.chats[selectedPerson.id] ? player.chats[selectedPerson.id].messages : [];

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedPerson]);

  const handleSelectPerson = (id: string, type: "family" | "friend" | "girlfriend" | "staff", name: string, role: string, affinity: number, avatarUrl?: string) => {
    setSelectedPerson({ id, type, name, role, affinity, avatarUrl });
    setShowTempoOptions(false);
    setShowGiftOptions(false);
    
    // Marcar como lido
    if (player.chats && player.chats[id] && player.chats[id].hasUnread) {
      const updatedPlayer = { ...player, chats: { ...player.chats, [id]: { ...player.chats[id], hasUnread: false } } };
      onUpdatePlayer(updatedPlayer);
    }
  };

  const addMessage = (updatedPlayer: Player, text: string, response: string) => {
    if (!selectedPerson) return;
    const personId = selectedPerson.id;
    let chats = { ...(updatedPlayer.chats || {}) };
    let chat = chats[personId] || { messages: [], hasUnread: false };
    
    chat = {
      ...chat,
      messages: [...chat.messages, { sender: "me", text: text }, { sender: "them", text: response }]
    };
    chats[personId] = chat;
    
    updatedPlayer.chats = chats;
  };

  const handleAction = (action: "elogiar" | "conversar" | "dinheiro" | "presentear" | "insultar" | "tempo") => {
    if (!selectedPerson) return;
    
    const updatedPlayer = { ...player, relationships: { ...player.relationships }, personal: { ...player.personal } };
    let newAffinity = selectedPerson.affinity;
    let response = "";

    if (action === "elogiar") {
      newAffinity += 10;
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 2);
      response = "Muito obrigado! Fico muito feliz em ouvir isso. 😊";
      addMessage(updatedPlayer, "Passei para dizer que você é excelente no que faz!", response);
      setAppreciationModal({ message: "Gostou muito do seu elogio e sentiu-se valorizado(a).", affinity: Math.max(0, Math.min(100, newAffinity)) });
    } else if (action === "conversar") {
      newAffinity += 10;
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 5);
      
      if (selectedPerson.id === "treinador") {
        if (!player.isPro) {
          const baseConversations = [
            { me: "Professor, o que eu preciso fazer para subir pro profissional logo?", them: "Calma, garoto! Foca em evoluir seus atributos nos treinos. Precisamos ganhar esse torneio da base primeiro para você ganhar visibilidade." },
            { me: "Como você tá vendo meu desempenho nos últimos treinos?", them: "Você tem muito potencial, mas a base exige consistência. Se continuarmos focados e ganharmos o campeonato sub-20, sua chance vai chegar." },
            { me: "Professor, acha que a gente tem chance de levar o título da base esse ano?", them: "Com certeza! Se o time todo se dedicar e você liderar em campo, o título do torneio de base é nosso. Isso vai abrir portas pra você no time principal." },
            { me: "Estou me sentindo cada vez melhor fisicamente, professor.", them: "Isso é ótimo! A transição pra profissional exige muito do físico. Continue focado no título da base, é a melhor vitrine que você pode ter agora." }
          ];
          const randomConv = baseConversations[Math.floor(Math.random() * baseConversations.length)];
          response = randomConv.them;
          addMessage(updatedPlayer, randomConv.me, response);
          setAppreciationModal({ message: "Aproveitou a conversa.", affinity: Math.max(0, Math.min(100, newAffinity)) });
        } else {
          const proConversations = [
            { me: "Professor, o que espera de mim para essa temporada?", them: `Espero que você seja a nossa referência em campo. Com o elenco que temos no ${player.currentTeam.name}, precisamos de você no seu melhor nível.` },
            { me: "Acha que dá pra buscar título esse ano?", them: player.currentTeam.level >= 4 ? "Nosso time é forte, a cobrança aqui é por título! Temos elenco pra bater de frente com qualquer um." : "Temos que ser realistas, nosso time está em construção. O principal é fazer uma campanha segura, mas nas copas podemos tentar surpreender." },
            { me: "E aí, professor! O que tem achado dos meus últimos treinos?", them: "Siga focado. A temporada é longa, o calendário aperta e vamos precisar de todo mundo 100% fisicamente." }
          ];
          if (player.currentTeam.division && player.currentTeam.division > 1) {
            proConversations.push({ me: "Qual o foco principal do time agora?", them: `Não tem outra conversa aqui: nosso único objetivo é o acesso! O ${player.currentTeam.name} precisa subir de divisão.` });
          } else {
            proConversations.push({ me: "Como você tá vendo o nível do campeonato?", them: "A elite exige muito, cada jogo é uma guerra. Precisamos pontuar bem no início pra não passar sufoco lá na frente." });
          }
          const randomConv = proConversations[Math.floor(Math.random() * proConversations.length)];
          response = randomConv.them;
          addMessage(updatedPlayer, randomConv.me, response);
          setAppreciationModal({ message: "Aproveitou a conversa.", affinity: Math.max(0, Math.min(100, newAffinity)) });
        }
      } else if (selectedPerson.id === "empresario") { 
         response = "Estou sempre de olho no mercado. Continue jogando bem que as propostas vão chegar!";
         addMessage(updatedPlayer, "Como estão as coisas nos bastidores? Alguma novidade?", response);
         setAppreciationModal({ message: "Gostou de te atualizar sobre os bastidores.", affinity: Math.max(0, Math.min(100, newAffinity)) });
      } else {
        response = "Foi ótimo conversar com você! Precisamos fazer isso mais vezes.";
        addMessage(updatedPlayer, "E aí, como foi o seu dia? Me conta as novidades.", response);
        setAppreciationModal({ message: "Aproveitou bastante a conversa com você.", affinity: Math.max(0, Math.min(100, newAffinity)) });
      }
    } else if (action === "dinheiro") {
      if (newAffinity > 70 && selectedPerson.type !== "staff") {
        newAffinity -= 20;
        const amount = 50000;
        updatedPlayer.money += amount;
        response = `Claro, te enviei ${formatCurrency(amount)}. Mas vê se não gasta tudo de uma vez, hein!`;
        setAppreciationModal({ message: "Te emprestou o dinheiro, mas ficou um pouco incomodado(a) com a situação.", affinity: Math.max(0, Math.min(100, newAffinity)) });
      } else {
        newAffinity -= 40;
        response = selectedPerson.type === "staff" ? "Como profissional, eu não empresto dinheiro." : "Sério que você está me pedindo dinheiro? Não vou te dar nada.";
        setAppreciationModal({ message: "Ficou ofendido(a) com o seu pedido de dinheiro.", affinity: Math.max(0, Math.min(100, newAffinity)) });
      }
      addMessage(updatedPlayer, "Estou precisando de uma grana emprestada, consegue me salvar?", response);
    } else if (action === "presentear") {
      setShowGiftOptions(true);
      return;
    } else if (action === "insultar") {
      newAffinity -= 50;
      response = "Que absurdo! Como você tem coragem de falar assim comigo? Não quero falar com você agora.";
      addMessage(updatedPlayer, "Você é um inútil e só me atrapalha! Sai da minha vida.", response);
      setAppreciationModal({ message: "Ficou profundamente magoado(a) e irritado(a) com os seus insultos.", affinity: Math.max(0, Math.min(100, newAffinity)) });
    } else if (action === "tempo") {
      setShowTempoOptions(true);
      return;
    }

    newAffinity = Math.max(0, Math.min(100, newAffinity));
    setSelectedPerson(prev => prev ? { ...prev, affinity: newAffinity } : null);

    if (selectedPerson.type === "family") {
      const idx = updatedPlayer.relationships.family.findIndex(f => f.id === selectedPerson.id);
      if (idx !== -1) updatedPlayer.relationships.family[idx] = { ...updatedPlayer.relationships.family[idx], affinity: newAffinity };
    } else if (selectedPerson.type === "friend") {
      const idx = updatedPlayer.relationships.friends.findIndex(f => f.id === selectedPerson.id);
      if (idx !== -1) updatedPlayer.relationships.friends[idx] = { ...updatedPlayer.relationships.friends[idx], affinity: newAffinity };
    } else if (selectedPerson.type === "girlfriend" && updatedPlayer.relationships.girlfriend) {
      updatedPlayer.relationships.girlfriend = { ...updatedPlayer.relationships.girlfriend, affinity: newAffinity };
    }

    onUpdatePlayer(updatedPlayer);
    if (action !== 'insultar' && action !== 'dinheiro') checkFriendRomance(updatedPlayer, newAffinity);
  };

  const handleGiftAction = (giftId: string) => {
    if (!selectedPerson) return;
    const gift = GIFTS.find(g => g.id === giftId);
    if (!gift) return;

    if (player.money < gift.price) {
      alert("Sem saldo suficiente para esse presente.");
      return;
    }

    const updatedPlayer = { ...player, relationships: { ...player.relationships }, personal: { ...player.personal } };
    updatedPlayer.money -= gift.price;
    
    let newAffinity = selectedPerson.affinity + gift.affinity;
    
    const response = `Uau, ${gift.name.toLowerCase()}! Que presente maravilhoso, eu amei de verdade! ${gift.emoji}❤️`;
    addMessage(updatedPlayer, `Comprei um presente para você. Espero que goste!`, response);
    setAppreciationModal({ message: `Ficou surpreso(a) e muito feliz ao receber o presente: ${gift.name}!`, affinity: Math.max(0, Math.min(100, newAffinity)) });

    newAffinity = Math.max(0, Math.min(100, newAffinity));
    setSelectedPerson(prev => prev ? { ...prev, affinity: newAffinity } : null);
    
    if (selectedPerson.type === "family") {
      const idx = updatedPlayer.relationships.family.findIndex(f => f.id === selectedPerson.id);
      if (idx !== -1) updatedPlayer.relationships.family[idx] = { ...updatedPlayer.relationships.family[idx], affinity: newAffinity };
    } else if (selectedPerson.type === "friend") {
      const idx = updatedPlayer.relationships.friends.findIndex(f => f.id === selectedPerson.id);
      if (idx !== -1) updatedPlayer.relationships.friends[idx] = { ...updatedPlayer.relationships.friends[idx], affinity: newAffinity };
    } else if (selectedPerson.type === "girlfriend" && updatedPlayer.relationships.girlfriend) {
      updatedPlayer.relationships.girlfriend = { ...updatedPlayer.relationships.girlfriend, affinity: newAffinity };
    }
    onUpdatePlayer(updatedPlayer);
    setShowGiftOptions(false);
    checkFriendRomance(updatedPlayer, newAffinity);
  };

  const handleTempoAction = (tipo: "amor" | "cinema" | "jantar" | "sogra" | "visitar" | "jogar" | "role") => {
    if (!selectedPerson) return;
    
    const updatedPlayer = { ...player, relationships: { ...player.relationships }, personal: { ...player.personal } };
    let newAffinity = selectedPerson.affinity;
    let response = "";
    let meMessage = "";

    if (tipo === "amor") {
      newAffinity += 30;
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 20);
      updatedPlayer.personal.health = Math.max(0, updatedPlayer.personal.health - 5);
      meMessage = "Vem aqui, vamos aproveitar esse tempo juntos... 😏";
      response = "Nossa, foi incrível... ❤️";
      setAppreciationModal({ message: "Tivemos um momento incrível e íntimo juntos.", affinity: Math.max(0, Math.min(100, newAffinity)) });
    } else if (tipo === "cinema") {
      newAffinity += 15;
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 10);
      updatedPlayer.money -= 200;
      meMessage = "Vamos pegar um cineminha hoje?";
      response = "Adorei o filme! E a pipoca tava ótima. 🍿🎥";
      setAppreciationModal({ message: "Curtiu bastante o filme e a sua companhia.", affinity: Math.max(0, Math.min(100, newAffinity)) });
    } else if (tipo === "jantar") {
      newAffinity += 20;
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 15);
      updatedPlayer.money -= 800;
      meMessage = "Reservei um lugar especial para a gente jantar hoje.";
      response = "A comida estava maravilhosa! Obrigada por hoje. 🍷🍽️";
      setAppreciationModal({ message: "Amou o jantar especial que você preparou.", affinity: Math.max(0, Math.min(100, newAffinity)) });
    } else if (tipo === "visitar") {
      newAffinity += 10;
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 5);
      meMessage = "Aparece lá em casa pra gente trocar uma ideia!";
      response = "Massa! Chego aí mais tarde. 🏠";
      setAppreciationModal({ message: "Gostou muito da resenha na sua casa.", affinity: Math.max(0, Math.min(100, newAffinity)) });
    } else if (tipo === "jogar") {
      newAffinity += 15;
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 15);
      meMessage = "Bora umas partidas online hoje?";
      response = "Bora! Só não vale chorar quando perder! 🎮";
      setAppreciationModal({ message: "Se divertiu muito jogando online com você.", affinity: Math.max(0, Math.min(100, newAffinity)) });
    } else if (tipo === "role") {
      newAffinity += 20;
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 20);
      updatedPlayer.money -= 500;
      meMessage = "Vamos dar um rolê hoje? Tô precisando sair um pouco.";
      response = "Fechado! Vai ser top. 😎";
      setAppreciationModal({ message: "Deu muitas risadas e adorou o rolê.", affinity: Math.max(0, Math.min(100, newAffinity)) });
    } else if (tipo === "sogra") {
      newAffinity += 25;
      updatedPlayer.personal.mood = Math.max(0, updatedPlayer.personal.mood - 10);
      meMessage = "Acho que já faz um tempo que não vemos seus pais, vamos lá visitar eles hoje?";
      response = "Sério?? Ai, minha mãe vai ficar tão feliz! Você é o melhor genro do mundo! 🥰🏡";
      setAppreciationModal({ message: "Ficou extremamente feliz por você ter lembrado dos pais dela.", affinity: Math.max(0, Math.min(100, newAffinity)) });
    }

    addMessage(updatedPlayer, meMessage, response);

    newAffinity = Math.max(0, Math.min(100, newAffinity));
    setSelectedPerson(prev => prev ? { ...prev, affinity: newAffinity } : null);
    
    if (updatedPlayer.relationships.girlfriend) {
      updatedPlayer.relationships.girlfriend = { ...updatedPlayer.relationships.girlfriend, affinity: newAffinity };
    }

    onUpdatePlayer(updatedPlayer);
    setShowTempoOptions(false);
    checkFriendRomance(updatedPlayer, newAffinity);
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  const ContactItem = ({ id, name, role, type, affinity, icon, bgColor, defaultMessage, avatarUrl }: any) => {
    const chat = player.chats?.[id];
    const lastMessage = chat?.messages?.[chat.messages.length - 1];
    const hasUnread = chat?.hasUnread;
    const displayText = lastMessage ? lastMessage.text : defaultMessage;

    let displayRole = role;
    if (type === "friend") displayRole = "Amigo";
    if (type === "girlfriend") displayRole = "Namorada";

    return (
      <button 
        onClick={() => handleSelectPerson(id, type, name, role, affinity, avatarUrl)}
        className="w-full flex items-center gap-4 p-4 hover:bg-[#202c33]/50 transition-colors text-left relative"
      >
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center font-bold text-white shrink-0 overflow-hidden`}>
          {avatarUrl ? <img src={sanitizeAvatar(avatarUrl, name)} alt={name} draggable="false" className="w-full h-full object-cover" /> : icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-0.5">
            <h4 className={`font-bold truncate text-base ${hasUnread ? 'text-emerald-500' : 'text-[#e9edef]'}`}>{name} {displayRole && type !== "staff" && <span className="font-normal text-sm text-[#8696a0]">({displayRole})</span>}</h4>
          </div>
          <p className={`text-sm truncate flex items-center gap-1 ${hasUnread ? 'text-[#e9edef] font-semibold' : 'text-[#8696a0]'}`}>
            {displayText}
          </p>
        </div>
        {hasUnread && (
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-[#111b21] ml-2">
            !
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl max-w-sm w-full relative h-[700px] flex flex-col overflow-hidden">
        
        {/* Notch Header for WhatsApp vibe */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 flex justify-center">
           <div className="w-24 h-6 bg-black rounded-b-2xl"></div>
        </div>

        {selectedPerson ? (
          <div className="flex flex-col h-full bg-[#0b141a]">
            {/* Chat Header */}
            <div className="bg-[#202c33] pt-10 pb-3 px-4 flex items-center gap-3 shrink-0 shadow-sm z-10">
              <button onClick={() => setSelectedPerson(null)} className="text-slate-300 hover:text-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
                {selectedPerson.avatarUrl ? <img src={sanitizeAvatar(selectedPerson.avatarUrl, selectedPerson.name)} alt={selectedPerson.name} draggable="false" className="w-full h-full object-cover" /> : getInitials(selectedPerson.name)}
              </div>
              <div className="flex-1">
                <h3 className="text-slate-100 font-medium leading-tight">{selectedPerson.name}</h3>
                <p className="text-xs text-slate-400">{selectedPerson.type === 'friend' ? 'Amigo' : selectedPerson.type === 'girlfriend' ? 'Namorada' : selectedPerson.role}</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b141a]">
              <div className="flex justify-center mb-6">
                <div className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-lg uppercase tracking-wider">
                  Hoje
                </div>
              </div>

              {currentMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm relative ${
                    msg.sender === "me" 
                      ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none" 
                      : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                  }`}>
                    {msg.text}
                    {msg.sender === "me" && (
                      <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
                        <span className="text-[10px] text-emerald-200/50">agora</span>
                        <CheckCircle2 className="w-3 h-3 text-[#53bdeb]" />
                      </div>
                    )}
                    {msg.sender === "me" && <div className="h-4 pr-10"></div>}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Actions / Input Area */}
            <div className="bg-[#202c33] p-3 pt-4 pb-6 shrink-0 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
              {showGiftOptions ? (
                <div className="relative h-64 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#32454f transparent' }}>
                  <button onClick={() => setShowGiftOptions(false)} className="sticky top-0 float-right p-1 bg-[#2a3942] rounded-full text-slate-300 hover:text-white z-10 mb-2 shadow-md">
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-sm font-bold text-slate-300 mb-3 sticky top-0 bg-[#202c33] pt-1 pb-2 z-0">Escolha o Presente:</h3>
                  <div className="grid grid-cols-2 gap-2 pb-4">
                    {GIFTS.map(gift => (
                      <button key={gift.id} onClick={() => handleGiftAction(gift.id)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 transition-all gap-1 border border-pink-500/30 group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{gift.emoji}</span>
                        <span className="text-xs text-pink-400 font-bold mt-1 text-center leading-tight">{gift.name}</span>
                        <span className="text-[10px] text-slate-400">{formatCurrency(gift.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : showTempoOptions ? (
                <div className="grid grid-cols-2 gap-2 relative">
                  {selectedPerson.type === "girlfriend" && (
                    <>
                      {player.age >= 18 && (
                        <button onClick={() => handleTempoAction("amor")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 transition-all gap-1 border border-pink-500/30">
                          <Heart className="w-6 h-6 text-pink-500" />
                          <span className="text-xs text-pink-400 font-bold mt-1">Fazer amor</span>
                        </button>
                      )}
                      <button onClick={() => handleTempoAction("cinema")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-all gap-1 border border-blue-500/30">
                        <Film className="w-6 h-6 text-blue-500" />
                        <span className="text-xs text-blue-400 font-bold mt-1 text-center leading-tight">Ir ao Cinema</span>
                      </button>
                      <button onClick={() => handleTempoAction("jantar")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-all gap-1 border border-orange-500/30">
                        <Utensils className="w-6 h-6 text-orange-500" />
                        <span className="text-xs text-orange-400 font-bold mt-1 text-center leading-tight">Jantar</span>
                      </button>
                      <button onClick={() => handleTempoAction("sogra")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-all gap-1 border border-emerald-500/30">
                        <Home className="w-6 h-6 text-emerald-500" />
                        <span className="text-xs text-emerald-400 font-bold mt-1 text-center leading-tight">Casa da Sogra</span>
                      </button>
                    </>
                  )}
                  {(selectedPerson.type === "friend" || (selectedPerson.type === "family" && (selectedPerson.role === "Pai" || selectedPerson.role === "Mãe" || selectedPerson.role === "Irmão" || selectedPerson.role === "Irmã"))) && (
                    <>
                      <button onClick={() => handleTempoAction("cinema")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-all gap-1 border border-blue-500/30">
                        <Film className="w-6 h-6 text-blue-500" />
                        <span className="text-xs text-blue-400 font-bold mt-1 text-center leading-tight">Ir ao Cinema</span>
                      </button>
                      { (selectedPerson.type === "friend" || player.assets.includes("Casa") || player.assets.includes("Mansão")) && (
                        <button onClick={() => handleTempoAction("visitar")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-all gap-1 border border-emerald-500/30">
                          <Home className="w-6 h-6 text-emerald-500" />
                          <span className="text-xs text-emerald-400 font-bold mt-1 text-center leading-tight">Visitar</span>
                        </button>
                      )}
                      {(selectedPerson.type === "friend" || selectedPerson.role === "Irmão" || selectedPerson.role === "Irmã") && (
                        <button onClick={() => handleTempoAction("jogar")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition-all gap-1 border border-purple-500/30">
                          <span className="text-2xl">🎮</span>
                          <span className="text-xs text-purple-400 font-bold mt-1 text-center leading-tight">Jogar Online</span>
                        </button>
                      )}
                      <button onClick={() => handleTempoAction("role")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-all gap-1 border border-orange-500/30">
                        <span className="text-2xl">😎</span>
                        <span className="text-xs text-orange-400 font-bold mt-1 text-center leading-tight">Dar Rolê</span>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
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
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-[#111b21]">
            <div className="pt-10 pb-4 px-5 bg-[#202c33] shrink-0 flex items-center justify-between shadow-sm">
              <h2 className="text-xl font-bold text-slate-100">Mensagens</h2>
              <div className="flex items-center gap-4 text-[#aebac1]">
                <button><Search className="w-5 h-5" /></button>
                <button onClick={onClose}><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Contacts List */}
              <div className="divide-y divide-[#202c33]">
                {/* Staff */}
                <ContactItem id="treinador" name="Treinador" role="Clube" type="staff" affinity={50} icon="TR" bgColor="bg-slate-700" defaultMessage="Precisa treinar mais finalização." avatarUrl={getCoachAvatar()} />
                <ContactItem id="empresario" name="Empresário" role="Agente" type="staff" affinity={50} icon="EM" bgColor="bg-slate-700" defaultMessage="Temos algumas sondagens para a janela." />
                
                {/* Girlfriend */}
                {girlfriend && <ContactItem id={girlfriend.id} name={girlfriend.name} role="Namorada" type="girlfriend" affinity={girlfriend.affinity} icon={<Heart className="w-5 h-5" fill="currentColor" />} bgColor="bg-pink-600" defaultMessage="" avatarUrl={girlfriend.avatarUrl} />}
                
                {/* Family */}
                {father && <ContactItem id={father.id} name={father.name} role={father.role} type="family" affinity={father.affinity} icon={getInitials(father.name)} bgColor="bg-indigo-600" defaultMessage="" avatarUrl={father.avatarUrl} />}
                {mother && <ContactItem id={mother.id} name={mother.name} role={mother.role} type="family" affinity={mother.affinity} icon={getInitials(mother.name)} bgColor="bg-indigo-500" defaultMessage="" avatarUrl={mother.avatarUrl} />}
                {siblings.map(s => <ContactItem key={s.id} id={s.id} name={s.name} role={s.role} type="family" affinity={s.affinity} icon={getInitials(s.name)} bgColor="bg-indigo-400" defaultMessage="" avatarUrl={s.avatarUrl} />)}
                
                {/* Friends */}
                {friends.map(f => <ContactItem key={f.id} id={f.id} name={f.name} role={f.relationTag} type="friend" affinity={f.affinity} icon={getInitials(f.name)} bgColor="bg-slate-600" defaultMessage="" avatarUrl={f.avatarUrl} />)}
              </div>
            </div>
          </div>
        )}
      </div>

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

