import { FamilyEvent } from "../types";

export const FAMILY_EVENTS: FamilyEvent[] = [
  {
    id: "conselho_mae",
    role: "Mãe",
    title: "Conselho de Mãe",
    description: "Sua mãe te liga preocupada com a pressão que você tem sofrido na carreira e te dá um conselho para manter a calma.",
    choices: [
      { id: "ouvir", label: "Ouvir atentamente e agradecer", tone: "safe" },
      { id: "desabafar", label: "Desabafar sobre as dificuldades", tone: "positive" },
      { id: "ignorar", label: "Dizer que não tem tempo para conversar", tone: "risky" },
    ]
  },
  {
    id: "presente_pai",
    role: "Pai",
    title: "Presente do Velho",
    description: "Seu pai aparece de surpresa no seu apartamento e te dá de presente um relógio antigo que era do seu avô.",
    choices: [
      { id: "emocionar", label: "Ficar emocionado e guardar com carinho", tone: "positive" },
      { id: "usar", label: "Usar o relógio na próxima entrevista", tone: "safe" },
      { id: "vender", label: "Perguntar quanto vale", tone: "risky" },
    ]
  },
  {
    id: "viagem_irmao",
    role: "Irmão",
    title: "Viagem em Família",
    description: "Seu irmão te chama para passar o fim de semana em uma cidade litorânea para relaxar longe do futebol.",
    choices: [
      { id: "aceitar", label: "Aceitar e pagar a viagem para todos", tone: "positive" },
      { id: "aceitar_simples", label: "Aceitar o convite", tone: "safe" },
      { id: "recusar", label: "Recusar, você precisa treinar", tone: "neutral" },
      { id: "ignorar", label: "Ignorar a mensagem", tone: "risky" },
    ]
  },
  {
    id: "pedido_irma",
    role: "Irmã",
    title: "Pedido de Ajuda",
    description: "Sua irmã pede a sua ajuda para conseguir ingressos VIPs para um show muito concorrido na cidade.",
    choices: [
      { id: "conseguir", label: "Mover seus contatos e conseguir", tone: "positive" },
      { id: "tentar", label: "Dizer que vai tentar, mas sem promessas", tone: "neutral" },
      { id: "negar", label: "Dizer que não consegue misturar as coisas", tone: "safe" },
    ]
  },
  {
    id: "festa_amigo",
    role: "Amigo",
    title: "Festa de Reencontro",
    description: "Seu velho amigo te convida para uma festa de reencontro com a turma da época da escola.",
    choices: [
      { id: "ir_discreto", label: "Ir, mas ficar discreto num canto", tone: "safe" },
      { id: "bancar", label: "Ir e bancar as bebidas da galera", tone: "positive" },
      { id: "nao_ir", label: "Não ir para focar na carreira", tone: "neutral" },
      { id: "bebedeira", label: "Ir e exagerar na comemoração", tone: "risky" },
    ]
  }
];
