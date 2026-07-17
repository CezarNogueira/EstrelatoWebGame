import { RomanceEvent, Player } from "../types";
import { generatePersonName, pickRandom, randomIntBetween, getRandomAvatar } from "../data";

const OCCUPATIONS = ["Estudante", "Vendedora", "Empresária", "Música", "Advogada", "Personal Trainer", "Fisioterapeuta", "Jornalista", "Influenciadora", "Modelo", "Médica", "Arquiteta", "Fotógrafa"];

export function generateRomanceEvent(player: Player, forceFirstKiss: boolean = false): RomanceEvent {
  const age = player.age;
  const isTeen = age >= 14 && age <= 16;
  const partnerAge = Math.max(14, age + randomIntBetween(-3, 3));
  const occupation = partnerAge < 18 ? "Estudante" : pickRandom(OCCUPATIONS);
  const name = generatePersonName(player.nationality, "female");

  // Primeiro Beijo - Apenas entre 14 e 16 anos (e se o jogador não tiver namorada ainda)
  if ((forceFirstKiss || (isTeen && Math.random() < 0.5)) && !player.relationships.girlfriend) {
    return {
      id: "primeiro-beijo",
      personName: name,
      relationTag: "Colega de Escola",
      title: "Primeiro Beijo?",
      description: `Durante uma festa da escola, você e ${name} acabam ficando sozinhos conversando. O clima esquenta e parece ser o momento perfeito para o seu primeiro beijo...`,
      attraction: randomIntBetween(70, 95),
      age: partnerAge,
      occupation: occupation,
      avatarUrl: getRandomAvatar("female"),
      choices: [
        { id: "beijar-namorar", label: "Beijar e pedir em namoro", tone: "positive" },
        { id: "beijar-amizade", label: "Beijar, mas ser só amigo", tone: "safe" },
        { id: "desperdiçar", label: "Ficar com vergonha e não fazer nada", tone: "neutral" },
      ],
    };
  }

  // Novo Interesse Amoroso (Exemplo: Academia, Festa, Parque)
  const scenarios = [
    {
      title: "Encontro na Academia",
      description: `Enquanto treinava na academia, você conheceu ${name}. Vocês trocaram olhares e conversaram bastante entre as séries.`,
      relationTag: "Conhecida da Academia"
    },
    {
      title: "Tropeço no Café",
      description: `Num café perto de casa, você acabou esbarrando em ${name} e derrubando a bebida dela. Você pagou outro café e a conversa fluiu.`,
      relationTag: "Conhecida do Café"
    },
    {
      title: "Festa do Time",
      description: `Na comemoração com a equipe, você foi apresentado a ${name}. Ela demonstrou bastante interesse nas suas histórias.`,
      relationTag: "Convidada da Festa"
    }
  ];

  const scenario = pickRandom(scenarios);

  return {
    id: "novo-interesse-" + Math.random().toString(36).substr(2, 9),
    personName: name,
    relationTag: scenario.relationTag,
    title: scenario.title,
    description: scenario.description,
    attraction: randomIntBetween(60, 90),
    age: partnerAge,
    occupation: occupation,
    avatarUrl: getRandomAvatar("female"),
    choices: [
      { id: "chamar-encontro", label: "Chamar para um encontro", tone: "positive" },
      { id: "apenas-amizade", label: "Tentar ser apenas amigos", tone: "safe" },
      { id: "nao-fazer-nada", label: "Não fazer nada e seguir a vida", tone: "neutral" },
    ],
  };
}
