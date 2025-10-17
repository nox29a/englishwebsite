import type { LearningLanguage } from "./language_packs";

export interface Task {
  id: number;
  level: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const englishTasks: Task[] = [

  // === Łatwy ===
  {
    id: 1,
    level: "Łatwy",
    question: "She ____ to school every day.",
    options: ["go", "goes", "went", "gone"],
    answer: "goes",
    explanation: "Używamy 'goes', ponieważ zdanie jest w Present Simple, 3. osoba liczby pojedynczej (she) wymaga końcówki -es."
  },
  {
    id: 2,
    level: "Łatwy",
    question: "They ____ playing football now.",
    options: ["are", "is", "was", "be"],
    answer: "are",
    explanation: "Używamy 'are', bo to zdanie w Present Continuous – 'now' sugeruje teraźniejszość, a 'they' wymaga 'are'."
  },
  {
    id: 3,
    level: "Łatwy",
    question: "He ____ TV every evening.",
    options: ["watch", "watches", "watched", "watching"],
    answer: "watches",
    explanation: "'Every evening' wskazuje na nawyk, więc używamy Present Simple z końcówką -es dla 3. osoby."
  },
  {
    id: 4,
    level: "Łatwy",
    question: "I ____ a sandwich right now.",
    options: ["eat", "ate", "am eating", "eating"],
    answer: "am eating",
    explanation: "'Right now' to znak czasu Present Continuous – podmiot 'I' + 'am' + czasownik z -ing."
  },
  {
    id: 5,
    level: "Łatwy",
    question: "She ____ to music at the moment.",
    options: ["listen", "listens", "is listening", "listened"],
    answer: "is listening",
    explanation: "'At the moment' sugeruje Present Continuous. 'She' → 'is'."
  },
  {
    id: 6,
    level: "Łatwy",
    question: "Tom and Jerry ____ in the park every Sunday.",
    options: ["runs", "run", "ran", "running"],
    answer: "run",
    explanation: "'Every Sunday' → Present Simple, podmiot jest w liczbie mnogiej, więc nie dodajemy -s."
  },
  {
    id: 7,
    level: "Łatwy",
    question: "I usually ____ coffee in the morning.",
    options: ["drink", "drinks", "drank", "drinking"],
    answer: "drink",
    explanation: "'Usually' wskazuje Present Simple. 'I' → bez końcówki -s."
  },
  {
    id: 8,
    level: "Łatwy",
    question: "My parents ____ at work now.",
    options: ["are", "is", "were", "be"],
    answer: "are",
    explanation: "'Now' sugeruje Present Continuous. 'My parents' → liczba mnoga → 'are'."
  },
  {
    id: 9,
    level: "Łatwy",
    question: "The baby ____ now.",
    options: ["sleep", "is sleeping", "slept", "sleeps"],
    answer: "is sleeping",
    explanation: "'Now' → Present Continuous, 'The baby' → 'is' + czasownik -ing."
  },
  {
    id: 10,
    level: "Łatwy",
    question: "I ____ my homework after school every day.",
    options: ["do", "does", "did", "doing"],
    answer: "do",
    explanation: "'Every day' → Present Simple. 'I' → 'do'."
  },

  // === Średni ===
  {
    id: 11,
    level: "Średni",
    question: "I ____ already eaten my lunch.",
    options: ["have", "had", "has", "will have"],
    answer: "have",
    explanation: "'Already' sugeruje Present Perfect. Dla 'I' używamy 'have'."
  },
  {
    id: 12,
    level: "Średni",
    question: "He ____ a book when I entered the room.",
    options: ["reads", "was reading", "is reading", "read"],
    answer: "was reading",
    explanation: "Używamy Past Continuous, bo akcja była w trakcie, gdy wydarzyło się coś innego w przeszłości."
  },
  {
    id: 13,
    level: "Średni",
    question: "We ____ in Paris since 2010.",
    options: ["lived", "have lived", "live", "are living"],
    answer: "have lived",
    explanation: "'Since 2010' → Present Perfect."
  },
  {
    id: 14,
    level: "Średni",
    question: "They ____ to the cinema when it started to rain.",
    options: ["went", "were going", "go", "had gone"],
    answer: "were going",
    explanation: "Past Continuous – akcja trwała, kiedy coś innego się wydarzyło."
  },
  {
    id: 15,
    level: "Średni",
    question: "She ____ in five movies so far.",
    options: ["acted", "has acted", "acts", "was acting"],
    answer: "has acted",
    explanation: "'So far' → Present Perfect."
  },
  {
    id: 16,
    level: "Średni",
    question: "They ____ breakfast before school yesterday.",
    options: ["have", "had", "have had", "has"],
    answer: "had",
    explanation: "Czas przeszły – wczoraj."
  },
  {
    id: 17,
    level: "Średni",
    question: "I ____ to London last year.",
    options: ["have been", "went", "go", "was going"],
    answer: "went",
    explanation: "Konkretna przeszłość → Past Simple."
  },
  {
    id: 18,
    level: "Średni",
    question: "They ____ working for three hours.",
    options: ["have been", "are", "were", "has been"],
    answer: "have been",
    explanation: "Present Perfect Continuous → czynność trwająca do teraz."
  },
  {
    id: 19,
    level: "Średni",
    question: "You ____ the movie yet?",
    options: ["saw", "see", "have seen", "has seen"],
    answer: "have seen",
    explanation: "'Yet' → Present Perfect."
  },
  {
    id: 20,
    level: "Średni",
    question: "They ____ here for a long time.",
    options: ["live", "lived", "have lived", "are living"],
    answer: "have lived",
    explanation: "'For a long time' → Present Perfect."
  },

  // === Trudny ===
  {
    id: 21,
    level: "Trudny",
    question: "If she ____ earlier, she would have caught the train.",
    options: ["left", "had left", "leaves", "has left"],
    answer: "had left",
    explanation: "To trzeci tryb warunkowy – używamy Past Perfect ('had left') dla warunku w przeszłości."
  },
  {
    id: 22,
    level: "Trudny",
    question: "By next year, they ____ in this city for a decade.",
    options: ["will live", "will be living", "will have lived", "lived"],
    answer: "will have lived",
    explanation: "To Future Perfect – coś się wydarzy do określonego momentu w przyszłości."
  },
  {
    id: 23,
    level: "Trudny",
    question: "If I ____ more time, I would finish it.",
    options: ["had", "have", "would have", "has"],
    answer: "had",
    explanation: "Drugi tryb warunkowy – warunek nierealny w teraźniejszości → Past Simple."
  },
  {
    id: 24,
    level: "Trudny",
    question: "She said she ____ the movie before.",
    options: ["saw", "had seen", "has seen", "see"],
    answer: "had seen",
    explanation: "Reported speech – czas zaprzeszły."
  },
  {
    id: 25,
    level: "Trudny",
    question: "They ____ the car fixed before the trip.",
    options: ["have", "had", "will have", "has"],
    answer: "had",
    explanation: "Past Perfect – coś zostało zrobione przed inną przeszłą czynnością."
  },
  {
    id: 26,
    level: "Trudny",
    question: "The house ____ by the workers last week.",
    options: ["was painted", "painted", "is painted", "has painted"],
    answer: "was painted",
    explanation: "Strona bierna w Past Simple – 'was' + III forma."
  },
  {
    id: 27,
    level: "Trudny",
    question: "By the time we arrive, they ____.",
    options: ["will leave", "left", "will have left", "leave"],
    answer: "will have left",
    explanation: "Future Perfect – coś się skończy przed innym momentem."
  },
  {
    id: 28,
    level: "Trudny",
    question: "If you ____ me, I would help you.",
    options: ["ask", "asked", "would ask", "asks"],
    answer: "asked",
    explanation: "Second Conditional – Past Simple po 'if'."
  },
  {
    id: 29,
    level: "Trudny",
    question: "He ____ that he had seen her before.",
    options: ["said", "says", "was said", "say"],
    answer: "said",
    explanation: "Reported speech – czas przeszły."
  },
  {
    id: 30,
    level: "Trudny",
    question: "The documents ____ by the lawyer yesterday.",
    options: ["was signed", "signed", "were signed", "has signed"],
    answer: "were signed",
    explanation: "Past Simple Passive – 'were' + III forma."
  },
  {
id: 31,
level: "Łatwy",
question: "We ____ to the gym three times a week.",
options: ["go", "goes", "went", "going"],
answer: "go",
explanation: "'Three times a week' wskazuje na nawyk, więc Present Simple. 'We' → bez końcówki -s."
},
{
id: 32,
level: "Łatwy",
question: "The dog ____ barking loudly right now.",
options: ["is", "are", "was", "be"],
answer: "is",
explanation: "'Right now' sugeruje Present Continuous. 'The dog' → 'is'."
},
{
id: 33,
level: "Łatwy",
question: "She ____ her friends every weekend.",
options: ["meet", "meets", "met", "meeting"],
answer: "meets",
explanation: "'Every weekend' → Present Simple, 3. osoba → -s."
},
{
id: 34,
level: "Łatwy",
question: "I ____ reading a book at the moment.",
options: ["am", "is", "was", "be"],
answer: "am",
explanation: "Present Continuous z 'at the moment'. 'I' → 'am'."
},
{
id: 35,
level: "Łatwy",
question: "Birds ____ south in winter.",
options: ["fly", "flies", "flew", "flying"],
answer: "fly",
explanation: "Fakt ogólny → Present Simple, liczba mnoga → bez -s."
},
{
id: 36,
level: "Łatwy",
question: "He ____ his bike now.",
options: ["ride", "rides", "is riding", "rode"],
answer: "is riding",
explanation: "'Now' → Present Continuous. 'He' → 'is'."
},
{
id: 37,
level: "Łatwy",
question: "Children ____ games after school.",
options: ["play", "plays", "played", "playing"],
answer: "play",
explanation: "Nawyk → Present Simple, liczba mnoga → bez -s."
},
{
id: 38,
level: "Łatwy",
question: "It ____ raining outside.",
options: ["is", "are", "was", "be"],
answer: "is",
explanation: "Present Continuous dla pogody. 'It' → 'is'."
},
{
id: 39,
level: "Łatwy",
question: "My sister ____ piano lessons twice a week.",
options: ["take", "takes", "took", "taking"],
answer: "takes",
explanation: "'Twice a week' → Present Simple, 3. osoba → -s."
},
{
id: 40,
level: "Łatwy",
question: "We ____ waiting for the bus now.",
options: ["am", "is", "are", "be"],
answer: "are",
explanation: "'Now' → Present Continuous. 'We' → 'are'."
},
// === Średni === (kontynuacja)
{
id: 41,
level: "Średni",
question: "She ____ just finished her work.",
options: ["has", "had", "have", "will have"],
answer: "has",
explanation: "'Just' → Present Perfect. 'She' → 'has'."
},
{
id: 42,
level: "Średni",
question: "While I ____ TV, the phone rang.",
options: ["watch", "watched", "was watching", "am watching"],
answer: "was watching",
explanation: "Past Continuous dla akcji trwającej, przerwanej przez inną."
},
{
id: 43,
level: "Średni",
question: "I ____ this city for ten years.",
options: ["lived", "have lived", "live", "am living"],
answer: "have lived",
explanation: "'For ten years' → Present Perfect."
},
{
id: 44,
level: "Średni",
question: "They ____ home when the storm started.",
options: ["walk", "were walking", "walked", "have walked"],
answer: "were walking",
explanation: "Past Continuous – akcja w trakcie."
},
{
id: 45,
level: "Średni",
question: "He ____ three books this month.",
options: ["read", "has read", "reads", "was reading"],
answer: "has read",
explanation: "'This month' → Present Perfect dla okresu do teraz."
},
{
id: 46,
level: "Średni",
question: "We ____ dinner at 7 PM yesterday.",
options: ["have", "had", "have had", "has had"],
answer: "had",
explanation: "Konkretny czas w przeszłości → Past Simple."
},
{
id: 47,
level: "Średni",
question: "She ____ to New York twice.",
options: ["went", "has gone", "goes", "was going"],
answer: "has gone",
explanation: "Doświadczenie w życiu → Present Perfect."
},
{
id: 48,
level: "Średni",
question: "I ____ studying all night.",
options: ["have been", "am", "was", "has been"],
answer: "have been",
explanation: "Present Perfect Continuous dla akcji trwającej."
},
{
id: 49,
level: "Średni",
question: "Have you ____ the news today?",
options: ["hear", "heard", "have heard", "has heard"],
answer: "heard",
explanation: "Present Perfect w pytaniu. Poprawna forma: 'Have you heard'."
},
{
id: 50,
level: "Średni",
question: "He ____ waiting for hours.",
options: ["has been", "is", "was", "have been"],
answer: "has been",
explanation: "Present Perfect Continuous. 'He' → 'has been'."
},
// === Trudny === (kontynuacja)
{
id: 51,
level: "Trudny",
question: "If he ____ studied harder, he would have passed.",
options: ["had", "has", "have", "would have"],
answer: "had",
explanation: "Third Conditional – Past Perfect po 'if'."
},
{
id: 52,
level: "Trudny",
question: "By tomorrow, I ____ the project.",
options: ["will finish", "will have finished", "finish", "finished"],
answer: "will have finished",
explanation: "Future Perfect dla akcji ukończonej przed przyszłością."
},
{
id: 53,
level: "Trudny",
question: "If it ____ rain, we will go out.",
options: ["doesn't", "didn't", "won't", "wouldn't"],
answer: "doesn't",
explanation: "First Conditional – Present Simple po 'if'."
},
{
id: 54,
level: "Trudny",
question: "He told me he ____ the book already.",
options: ["read", "had read", "has read", "reads"],
answer: "had read",
explanation: "Reported Speech – przesunięcie do Past Perfect."
},
{
id: 55,
level: "Trudny",
question: "The letter ____ sent before noon.",
options: ["was", "had been", "has been", "will be"],
answer: "had been",
explanation: "Past Perfect Passive – akcja przed inną w przeszłości."
},
{
id: 56,
level: "Trudny",
question: "The cake ____ by my mother.",
options: ["baked", "was baked", "bakes", "has baked"],
answer: "was baked",
explanation: "Past Simple Passive – 'was' + III forma."
},
{
id: 57,
level: "Trudny",
question: "By the end of the day, we ____ everything.",
options: ["will do", "will have done", "do", "did"],
answer: "will have done",
explanation: "Future Perfect."
},
{
id: 58,
level: "Trudny",
question: "If I were you, I ____ that.",
options: ["won't do", "wouldn't do", "don't do", "didn't do"],
answer: "wouldn't do",
explanation: "Second Conditional – rada hipotetyczna."
},
{
id: 59,
level: "Trudny",
question: "She said that she ____ tired.",
options: ["is", "was", "has been", "had been"],
answer: "was",
explanation: "Reported Speech – Present Simple do Past Simple."
},
  {
  id: 60,
  level: "Trudny",
  question: "The report ____ prepared by the team.",
  options: ["was", "were", "has", "have"],
  answer: "was",
  explanation: "Past Simple Passive – 'The report' (liczba pojedyncza) → 'was'."
  },
  
  // === Łatwy ===
  {
    id: 61,
    level: "Łatwy",
    question: "We ____ to the park every weekend.",
    options: ["go", "goes", "went", "going"],
    answer: "go",
    explanation: "'Every weekend' wskazuje na Present Simple. 'We' → bez końcówki -s."
  },
  {
    id: 62,
    level: "Łatwy",
    question: "He ____ a new book now.",
    options: ["read", "reads", "is reading", "reading"],
    answer: "is reading",
    explanation: "'Now' sugeruje Present Continuous. 'He' → 'is' + czasownik z -ing."
  },
  {
    id: 63,
    level: "Łatwy",
    question: "She ____ her dog every morning.",
    options: ["walk", "walks", "walked", "walking"],
    answer: "walks",
    explanation: "'Every morning' → Present Simple, 3. osoba liczby pojedynczej wymaga końcówki -s."
  },
  {
    id: 64,
    level: "Łatwy",
    question: "They ____ in the garden at the moment.",
    options: ["play", "plays", "are playing", "played"],
    answer: "are playing",
    explanation: "'At the moment' → Present Continuous, 'They' → 'are' + czasownik z -ing."
  },
  {
    id: 65,
    level: "Łatwy",
    question: "I ____ my room every Saturday.",
    options: ["clean", "cleans", "cleaned", "cleaning"],
    answer: "clean",
    explanation: "'Every Saturday' → Present Simple. 'I' → bez końcówki -s."
  },
  {
    id: 66,
    level: "Łatwy",
    question: "The children ____ now.",
    options: ["sleep", "sleeps", "are sleeping", "slept"],
    answer: "are sleeping",
    explanation: "'Now' → Present Continuous, 'The children' → 'are' + czasownik z -ing."
  },
  {
    id: 67,
    level: "Łatwy",
    question: "She always ____ tea in the evening.",
    options: ["drink", "drinks", "drank", "drinking"],
    answer: "drinks",
    explanation: "'Always' → Present Simple, 'She' → końcówka -s."
  },
  {
    id: 68,
    level: "Łatwy",
    question: "We ____ a movie right now.",
    options: ["watch", "watches", "are watching", "watched"],
    answer: "are watching",
    explanation: "'Right now' → Present Continuous, 'We' → 'are' + czasownik z -ing."
  },
  {
    id: 69,
    level: "Łatwy",
    question: "He ____ to school by bus every day.",
    options: ["go", "goes", "went", "going"],
    answer: "goes",
    explanation: "'Every day' → Present Simple, 'He' → końcówka -es."
  },
  {
    id: 70,
    level: "Łatwy",
    question: "I ____ my friends after school.",
    options: ["meet", "meets", "met", "meeting"],
    answer: "meet",
    explanation: "'After school' w kontekście regularności → Present Simple, 'I' → bez końcówki -s."
  },

  // === Średni ===
  {
    id: 71,
    level: "Średni",
    question: "She ____ her homework before dinner yesterday.",
    options: ["did", "has done", "does", "had done"],
    answer: "had done",
    explanation: "Past Perfect – czynność zakończona przed inną w przeszłości."
  },
  {
    id: 72,
    level: "Średni",
    question: "They ____ in this house since 2015.",
    options: ["live", "lived", "have lived", "are living"],
    answer: "have lived",
    explanation: "'Since 2015' → Present Perfect."
  },
  {
    id: 73,
    level: "Średni",
    question: "I ____ TV when she called.",
    options: ["watch", "was watching", "watched", "am watching"],
    answer: "was watching",
    explanation: "Past Continuous – akcja trwała w momencie innej czynności w przeszłości."
  },
  {
    id: 74,
    level: "Średni",
    question: "He ____ three books this month.",
    options: ["read", "reads", "has read", "is reading"],
    answer: "has read",
    explanation: "'This month' → Present Perfect dla akcji zakończonych w niedawnym okresie."
  },
  {
    id: 75,
    level: "Średni",
    question: "We ____ to the zoo last weekend.",
    options: ["go", "went", "have gone", "are going"],
    answer: "went",
    explanation: "Konkretny czas w przeszłości ('last weekend') → Past Simple."
  },
  {
    id: 76,
    level: "Średni",
    question: "They ____ for two hours when I arrived.",
    options: ["wait", "were waiting", "have waited", "had been waiting"],
    answer: "had been waiting",
    explanation: "Past Perfect Continuous – akcja trwała do określonego momentu w przeszłości."
  },
  {
    id: 77,
    level: "Średni",
    question: "Have you ____ the new museum yet?",
    options: ["visit", "visited", "have visited", "visiting"],
    answer: "visited",
    explanation: "'Yet' → Present Perfect, ale w pytaniu z 'have' poprawna forma to 'visited'."
  },
  {
    id: 78,
    level: "Średni",
    question: "She ____ in London for six months last year.",
    options: ["lives", "lived", "has lived", "is living"],
    answer: "lived",
    explanation: "Określony czas w przeszłości ('last year') → Past Simple."
  },
  {
    id: 79,
    level: "Średni",
    question: "He ____ studying when the phone rang.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Continuous – akcja trwała w momencie innej czynności."
  },
  {
    id: 80,
    level: "Średni",
    question: "I ____ never been to Japan.",
    options: ["was", "am", "have", "had"],
    answer: "have",
    explanation: "'Never' → Present Perfect, dla 'I' używamy 'have'."
  },

  // === Trudny ===
  {
    id: 81,
    level: "Trudny",
    question: "If he ____ harder, he would have passed the exam.",
    options: ["studied", "had studied", "studies", "has studied"],
    answer: "had studied",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 82,
    level: "Trudny",
    question: "By the time we get there, they ____ for us.",
    options: ["wait", "will wait", "will have waited", "waited"],
    answer: "will have waited",
    explanation: "Future Perfect – akcja zakończy się przed określonym momentem w przyszłości."
  },
  {
    id: 83,
    level: "Trudny",
    question: "The book ____ by millions of people by next year.",
    options: ["will read", "will be read", "will have been read", "is read"],
    answer: "will have been read",
    explanation: "Future Perfect Passive – czynność zakończona w przyszłości, strona bierna."
  },
  {
    id: 84,
    level: "Trudny",
    question: "If I ____ you, I would apologize.",
    options: ["am", "was", "were", "be"],
    answer: "were",
    explanation: "Drugi tryb warunkowy – nierealny warunek w teraźniejszości, używamy 'were' dla wszystkich osób."
  },
  {
    id: 85,
    level: "Trudny",
    question: "She said she ____ the letter before.",
    options: ["wrote", "had written", "writes", "has written"],
    answer: "had written",
    explanation: "Reported speech – Past Perfect dla wcześniejszej akcji."
  },
  {
    id: 86,
    level: "Trudny",
    question: "The project ____ by the team last month.",
    options: ["was completed", "completed", "is completed", "has completed"],
    answer: "was completed",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu w przeszłości."
  },
  {
    id: 87,
    level: "Trudny",
    question: "If they ____ earlier, they wouldn’t have missed the bus.",
    options: ["leave", "had left", "left", "have left"],
    answer: "had left",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 88,
    level: "Trudny",
    question: "By next month, I ____ this book for a year.",
    options: ["read", "will read", "will have been reading", "am reading"],
    answer: "will have been reading",
    explanation: "Future Perfect Continuous – akcja trwająca do określonego momentu w przyszłości."
  },
  {
    id: 89,
    level: "Trudny",
    question: "The room ____ cleaned before the guests arrived.",
    options: ["has been", "was", "had been", "is"],
    answer: "had been",
    explanation: "Past Perfect Passive – czynność zakończona przed inną w przeszłości."
  },
  {
    id: 90,
    level: "Trudny",
    question: "If you ____ me earlier, I could have helped.",
    options: ["told", "had told", "tell", "have told"],
    answer: "had told",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 91,
    level: "Trudny",
    question: "The movie ____ by the time we arrived.",
    options: ["started", "has started", "had started", "will start"],
    answer: "had started",
    explanation: "Past Perfect – akcja zakończona przed inną w przeszłości."
  },
  {
    id: 92,
    level: "Trudny",
    question: "If I ____ rich, I would travel the world.",
    options: ["am", "was", "were", "be"],
    answer: "were",
    explanation: "Drugi tryb warunkowy – nierealny warunek w teraźniejszości, 'were' dla wszystkich osób."
  },
  {
    id: 93,
    level: "Trudny",
    question: "The car ____ repaired by the mechanic yesterday.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 94,
    level: "Trudny",
    question: "By 2030, they ____ in this company for 20 years.",
    options: ["work", "will work", "will have worked", "worked"],
    answer: "will have worked",
    explanation: "Future Perfect – akcja zakończona do określonego momentu w przyszłości."
  },
  {
    id: 95,
    level: "Trudny",
    question: "She wishes she ____ harder for the test.",
    options: ["studies", "studied", "had studied", "has studied"],
    answer: "had studied",
    explanation: "Wish + Past Perfect dla żalu dotyczącego przeszłości."
  },
  {
    id: 96,
    level: "Trudny",
    question: "The house ____ built in 1900.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – konkretny czas w przeszłości."
  },
  {
    id: 97,
    level: "Trudny",
    question: "If we ____ the map, we wouldn’t have gotten lost.",
    options: ["check", "checked", "had checked", "have checked"],
    answer: "had checked",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 98,
    level: "Trudny",
    question: "The report ____ by the team before the deadline.",
    options: ["finished", "was finished", "has finished", "had finished"],
    answer: "was finished",
    explanation: "Past Simple Passive – akcja zakończona w określonym czasie."
  },
  {
    id: 99,
    level: "Trudny",
    question: "By the time you read this, I ____ the letter.",
    options: ["write", "wrote", "will have written", "had written"],
    answer: "will have written",
    explanation: "Future Perfect – akcja zakończona przed momentem w przyszłości."
  },
  {
    id: 100,
    level: "Trudny",
    question: "If he ____ more carefully, he wouldn’t have crashed.",
    options: ["drives", "drove", "had driven", "has driven"],
    answer: "had driven",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  // === Łatwy ===
  {
    id: 101,
    level: "Łatwy",
    question: "She ____ to the gym every evening.",
    options: ["go", "goes", "went", "going"],
    answer: "goes",
    explanation: "'Every evening' wskazuje na Present Simple. 'She' → końcówka -es."
  },
  {
    id: 102,
    level: "Łatwy",
    question: "They ____ in the pool now.",
    options: ["swim", "swims", "are swimming", "swam"],
    answer: "are swimming",
    explanation: "'Now' sugeruje Present Continuous. 'They' → 'are' + czasownik z -ing."
  },
  {
    id: 103,
    level: "Łatwy",
    question: "He ____ his bike every weekend.",
    options: ["ride", "rides", "rode", "riding"],
    answer: "rides",
    explanation: "'Every weekend' → Present Simple, 'He' → końcówka -s."
  },
  {
    id: 104,
    level: "Łatwy",
    question: "I ____ a letter at the moment.",
    options: ["write", "writes", "am writing", "wrote"],
    answer: "am writing",
    explanation: "'At the moment' → Present Continuous, 'I' → 'am' + czasownik z -ing."
  },
  {
    id: 105,
    level: "Łatwy",
    question: "We ____ breakfast every morning.",
    options: ["eat", "eats", "ate", "eating"],
    answer: "eat",
    explanation: "'Every morning' → Present Simple, 'We' → bez końcówki -s."
  },
  {
    id: 106,
    level: "Łatwy",
    question: "The dog ____ in the garden now.",
    options: ["run", "runs", "is running", "ran"],
    answer: "is running",
    explanation: "'Now' → Present Continuous, 'The dog' → 'is' + czasownik z -ing."
  },
  {
    id: 107,
    level: "Łatwy",
    question: "She ____ to music every evening.",
    options: ["listen", "listens", "listened", "listening"],
    answer: "listens",
    explanation: "'Every evening' → Present Simple, 'She' → końcówka -s."
  },
  {
    id: 108,
    level: "Łatwy",
    question: "They ____ at the party right now.",
    options: ["dance", "dances", "are dancing", "danced"],
    answer: "are dancing",
    explanation: "'Right now' → Present Continuous, 'They' → 'are' + czasownik z -ing."
  },
  {
    id: 109,
    level: "Łatwy",
    question: "I ____ to school by car every day.",
    options: ["go", "goes", "went", "going"],
    answer: "go",
    explanation: "'Every day' → Present Simple, 'I' → bez końcówki -s."
  },
  {
    id: 110,
    level: "Łatwy",
    question: "He ____ his homework after dinner.",
    options: ["do", "does", "did", "doing"],
    answer: "does",
    explanation: "'After dinner' w kontekście regularności → Present Simple, 'He' → końcówka -es."
  },

  // === Średni ===
  {
    id: 111,
    level: "Średni",
    question: "I ____ just finished my homework.",
    options: ["have", "had", "has", "will have"],
    answer: "have",
    explanation: "'Just' sugeruje Present Perfect. Dla 'I' używamy 'have'."
  },
  {
    id: 112,
    level: "Średni",
    question: "She ____ a song when I walked in.",
    options: ["sang", "was singing", "is singing", "sings"],
    answer: "was singing",
    explanation: "Past Continuous – akcja trwała w momencie innej czynności w przeszłości."
  },
  {
    id: 113,
    level: "Średni",
    question: "They ____ in New York since 2018.",
    options: ["lived", "have lived", "live", "are living"],
    answer: "have lived",
    explanation: "'Since 2018' → Present Perfect."
  },
  {
    id: 114,
    level: "Średni",
    question: "He ____ to the shop when it started raining.",
    options: ["went", "was going", "goes", "had gone"],
    answer: "was going",
    explanation: "Past Continuous – akcja trwała, gdy wydarzyło się coś innego."
  },
  {
    id: 115,
    level: "Średni",
    question: "She ____ in two plays this year.",
    options: ["acted", "has acted", "acts", "was acting"],
    answer: "has acted",
    explanation: "'This year' → Present Perfect dla akcji zakończonych w niedawnym okresie."
  },
  {
    id: 116,
    level: "Średni",
    question: "We ____ dinner before the movie started.",
    options: ["have", "had", "have had", "has"],
    answer: "had",
    explanation: "Past Perfect – czynność zakończona przed inną w przeszłości."
  },
  {
    id: 117,
    level: "Średni",
    question: "I ____ to Paris last summer.",
    options: ["have been", "went", "go", "was going"],
    answer: "went",
    explanation: "Konkretny czas w przeszłości ('last summer') → Past Simple."
  },
  {
    id: 118,
    level: "Średni",
    question: "They ____ working on the project for a month.",
    options: ["have been", "are", "were", "has been"],
    answer: "have been",
    explanation: "Present Perfect Continuous – czynność trwająca do teraz."
  },
  {
    id: 119,
    level: "Średni",
    question: "Have you ____ the new restaurant yet?",
    options: ["visit", "visited", "have visited", "visiting"],
    answer: "visited",
    explanation: "'Yet' → Present Perfect, w pytaniu z 'have' poprawna forma to 'visited'."
  },
  {
    id: 120,
    level: "Średni",
    question: "He ____ here for three years.",
    options: ["lives", "lived", "has lived", "is living"],
    answer: "has lived",
    explanation: "'For three years' → Present Perfect."
  },

  // === Trudny ===
  {
    id: 121,
    level: "Trudny",
    question: "If she ____ on time, she wouldn’t have missed the meeting.",
    options: ["arrived", "had arrived", "arrives", "has arrived"],
    answer: "had arrived",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 122,
    level: "Trudny",
    question: "By next summer, we ____ in this house for five years.",
    options: ["will live", "will be living", "will have lived", "lived"],
    answer: "will have lived",
    explanation: "Future Perfect – akcja zakończona do określonego momentu w przyszłości."
  },
  {
    id: 123,
    level: "Trudny",
    question: "If I ____ more money, I would buy a car.",
    options: ["had", "have", "would have", "has"],
    answer: "had",
    explanation: "Drugi tryb warunkowy – nierealny warunek w teraźniejszości, Past Simple."
  },
  {
    id: 124,
    level: "Trudny",
    question: "He said he ____ the book before.",
    options: ["read", "had read", "has read", "reads"],
    answer: "had read",
    explanation: "Reported speech – Past Perfect dla wcześniejszej akcji."
  },
  {
    id: 125,
    level: "Trudny",
    question: "The windows ____ cleaned before the party.",
    options: ["were", "had been", "have been", "are"],
    answer: "had been",
    explanation: "Past Perfect Passive – czynność zakończona przed inną w przeszłości."
  },
  {
    id: 126,
    level: "Trudny",
    question: "The building ____ by the workers last year.",
    options: ["was constructed", "constructed", "is constructed", "has constructed"],
    answer: "was constructed",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 127,
    level: "Trudny",
    question: "By the time they arrive, we ____ dinner.",
    options: ["will finish", "finished", "will have finished", "finish"],
    answer: "will have finished",
    explanation: "Future Perfect – akcja zakończona przed momentem w przyszłości."
  },
  {
    id: 128,
    level: "Trudny",
    question: "If you ____ harder, you would succeed.",
    options: ["try", "tried", "would try", "tries"],
    answer: "tried",
    explanation: "Drugi tryb warunkowy – Past Simple po 'if' dla nierealnego warunku."
  },
  {
    id: 129,
    level: "Trudny",
    question: "She ____ that she had lost her keys.",
    options: ["said", "says", "was said", "say"],
    answer: "said",
    explanation: "Reported speech – czas przeszły."
  },
  {
    id: 130,
    level: "Trudny",
    question: "The contract ____ by the manager yesterday.",
    options: ["was signed", "signed", "is signed", "has signed"],
    answer: "was signed",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 131,
    level: "Trudny",
    question: "If we ____ the instructions, we wouldn’t have failed.",
    options: ["followed", "had followed", "follow", "have followed"],
    answer: "had followed",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 132,
    level: "Trudny",
    question: "By 2026, she ____ teaching for a decade.",
    options: ["will teach", "will have taught", "teaches", "taught"],
    answer: "will have taught",
    explanation: "Future Perfect – akcja zakończona do określonego momentu w przyszłości."
  },
  {
    id: 133,
    level: "Trudny",
    question: "The painting ____ restored by the experts last month.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 134,
    level: "Trudny",
    question: "If I ____ you, I would take the job.",
    options: ["am", "was", "were", "be"],
    answer: "were",
    explanation: "Drugi tryb warunkowy – nierealny warunek w teraźniejszości, 'were' dla wszystkich osób."
  },
  {
    id: 135,
    level: "Trudny",
    question: "He wishes he ____ the opportunity earlier.",
    options: ["took", "had taken", "takes", "has taken"],
    answer: "had taken",
    explanation: "Wish + Past Perfect dla żalu dotyczącego przeszłości."
  },
  {
    id: 136,
    level: "Trudny",
    question: "The bridge ____ built in the 19th century.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – konkretny czas w przeszłości."
  },
  {
    id: 137,
    level: "Trudny",
    question: "By the time you arrive, I ____ the work.",
    options: ["finish", "will finish", "will have finished", "finished"],
    answer: "will have finished",
    explanation: "Future Perfect – akcja zakończona przed momentem w przyszłości."
  },
  {
    id: 138,
    level: "Trudny",
    question: "If they ____ earlier, they would have seen the show.",
    options: ["arrived", "had arrived", "arrive", "have arrived"],
    answer: "had arrived",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 139,
    level: "Trudny",
    question: "The book ____ translated into ten languages by 2024.",
    options: ["will be", "was", "will have been", "is"],
    answer: "will have been",
    explanation: "Future Perfect Passive – czynność zakończona w przyszłości, strona bierna."
  },
  {
    id: 140,
    level: "Trudny",
    question: "She said she ____ the email before the meeting.",
    options: ["sent", "had sent", "sends", "has sent"],
    answer: "had sent",
    explanation: "Reported speech – Past Perfect dla wcześniejszej akcji."
  },
  {
    id: 141,
    level: "Trudny",
    question: "If I ____ more time, I would learn Spanish.",
    options: ["had", "have", "would have", "has"],
    answer: "had",
    explanation: "Drugi tryb warunkowy – nierealny warunek w teraźniejszości, Past Simple."
  },
  {
    id: 142,
    level: "Trudny",
    question: "The room ____ decorated before the event.",
    options: ["has been", "was", "had been", "is"],
    answer: "had been",
    explanation: "Past Perfect Passive – czynność zakończona przed inną w przeszłości."
  },
  {
    id: 143,
    level: "Trudny",
    question: "By next year, they ____ the project for two years.",
    options: ["will work", "will have been working", "work", "worked"],
    answer: "will have been working",
    explanation: "Future Perfect Continuous – akcja trwająca do określonego momentu w przyszłości."
  },
  {
    id: 144,
    level: "Trudny",
    question: "If he ____ the rules, he wouldn’t have been disqualified.",
    options: ["followed", "had followed", "follows", "has followed"],
    answer: "had followed",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 145,
    level: "Trudny",
    question: "The letter ____ written by the secretary yesterday.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 146,
    level: "Trudny",
    question: "By 2027, she ____ in this city for ten years.",
    options: ["will live", "will have lived", "lives", "lived"],
    answer: "will have lived",
    explanation: "Future Perfect – akcja zakończona do określonego momentu w przyszłości."
  },
  {
    id: 147,
    level: "Trudny",
    question: "If we ____ the train, we would have been on time.",
    options: ["caught", "had caught", "catch", "have caught"],
    answer: "had caught",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 148,
    level: "Trudny",
    question: "The house ____ renovated by the workers last summer.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 149,
    level: "Trudny",
    question: "He wishes he ____ the chance to study abroad.",
    options: ["took", "had taken", "takes", "has taken"],
    answer: "had taken",
    explanation: "Wish + Past Perfect dla żalu dotyczącego przeszłości."
  },
  {
    id: 150,
    level: "Trudny",
    question: "By the time we arrive, the concert ____.",
    options: ["will start", "started", "will have started", "starts"],
    answer: "will have started",
    explanation: "Future Perfect – akcja zakończona przed momentem w przyszłości."
  },

  // === Łatwy ===
  {
    id: 151,
    level: "Łatwy",
    question: "I ____ to the library every Tuesday.",
    options: ["go", "goes", "went", "going"],
    answer: "go",
    explanation: "'Every Tuesday' wskazuje na Present Simple. 'I' → bez końcówki -s."
  },
  {
    id: 152,
    level: "Łatwy",
    question: "She ____ a book right now.",
    options: ["read", "reads", "is reading", "reading"],
    answer: "is reading",
    explanation: "'Right now' sugeruje Present Continuous. 'She' → 'is' + czasownik z -ing."
  },
  {
    id: 153,
    level: "Łatwy",
    question: "They ____ soccer every weekend.",
    options: ["play", "plays", "played", "playing"],
    answer: "play",
    explanation: "'Every weekend' → Present Simple, 'They' → bez końcówki -s."
  },
  {
    id: 154,
    level: "Łatwy",
    question: "He ____ his car at the moment.",
    options: ["wash", "washes", "is washing", "washed"],
    answer: "is washing",
    explanation: "'At the moment' → Present Continuous, 'He' → 'is' + czasownik z -ing."
  },
  {
    id: 155,
    level: "Łatwy",
    question: "We ____ to music every evening.",
    options: ["listen", "listens", "listened", "listening"],
    answer: "listen",
    explanation: "'Every evening' → Present Simple, 'We' → bez końcówki -s."
  },
  {
    id: 156,
    level: "Łatwy",
    question: "The cat ____ on the sofa now.",
    options: ["sleep", "sleeps", "is sleeping", "slept"],
    answer: "is sleeping",
    explanation: "'Now' → Present Continuous, 'The cat' → 'is' + czasownik z -ing."
  },
  {
    id: 157,
    level: "Łatwy",
    question: "I ____ coffee every morning.",
    options: ["drink", "drinks", "drank", "drinking"],
    answer: "drink",
    explanation: "'Every morning' → Present Simple, 'I' → bez końcówki -s."
  },
  {
    id: 158,
    level: "Łatwy",
    question: "They ____ in the park at the moment.",
    options: ["run", "runs", "are running", "ran"],
    answer: "are running",
    explanation: "'At the moment' → Present Continuous, 'They' → 'are' + czasownik z -ing."
  },
  {
    id: 159,
    level: "Łatwy",
    question: "She ____ to school by bike every day.",
    options: ["go", "goes", "went", "going"],
    answer: "goes",
    explanation: "'Every day' → Present Simple, 'She' → końcówka -es."
  },
  {
    id: 160,
    level: "Łatwy",
    question: "He ____ his room every Saturday.",
    options: ["clean", "cleans", "cleaned", "cleaning"],
    answer: "cleans",
    explanation: "'Every Saturday' → Present Simple, 'He' → końcówka -s."
  },

  // === Średni ===
  {
    id: 161,
    level: "Średni",
    question: "I ____ just finished writing a letter.",
    options: ["have", "had", "has", "will have"],
    answer: "have",
    explanation: "'Just' sugeruje Present Perfect. Dla 'I' używamy 'have'."
  },
  {
    id: 162,
    level: "Średni",
    question: "He ____ a movie when I called him.",
    options: ["watched", "was watching", "is watching", "watches"],
    answer: "was watching",
    explanation: "Past Continuous – akcja trwała w momencie innej czynności w przeszłości."
  },
  {
    id: 163,
    level: "Średni",
    question: "They ____ in London since 2020.",
    options: ["lived", "have lived", "live", "are living"],
    answer: "have lived",
    explanation: "'Since 2020' → Present Perfect."
  },
  {
    id: 164,
    level: "Średni",
    question: "She ____ to the park when it started snowing.",
    options: ["went", "was going", "goes", "had gone"],
    answer: "was going",
    explanation: "Past Continuous – akcja trwała, gdy wydarzyło się coś innego."
  },
  {
    id: 165,
    level: "Średni",
    question: "He ____ four emails today.",
    options: ["wrote", "writes", "has written", "is writing"],
    answer: "has written",
    explanation: "'Today' → Present Perfect dla akcji zakończonych w niedawnym okresie."
  },
  {
    id: 166,
    level: "Średni",
    question: "We ____ lunch before the meeting started.",
    options: ["have", "had", "have had", "has"],
    answer: "had",
    explanation: "Past Perfect – czynność zakończona przed inną w przeszłości."
  },
  {
    id: 167,
    level: "Średni",
    question: "I ____ to Rome last year.",
    options: ["have been", "went", "go", "was going"],
    answer: "went",
    explanation: "Konkretny czas w przeszłości ('last year') → Past Simple."
  },
  {
    id: 168,
    level: "Średni",
    question: "They ____ studying for two hours.",
    options: ["have been", "are", "were", "has been"],
    answer: "have been",
    explanation: "Present Perfect Continuous – czynność trwająca do teraz."
  },
  {
    id: 169,
    level: "Średni",
    question: "Have you ____ the new book yet?",
    options: ["read", "readed", "have read", "reading"],
    answer: "read",
    explanation: "'Yet' → Present Perfect, w pytaniu z 'have' poprawna forma to 'read'."
  },
  {
    id: 170,
    level: "Średni",
    question: "She ____ in Berlin for a year last year.",
    options: ["lives", "lived", "has lived", "is living"],
    answer: "lived",
    explanation: "Określony czas w przeszłości ('last year') → Past Simple."
  },

  // === Trudny ===
  {
    id: 171,
    level: "Trudny",
    question: "If he ____ earlier, he wouldn’t have missed the flight.",
    options: ["left", "had left", "leaves", "has left"],
    answer: "had left",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 172,
    level: "Trudny",
    question: "By next winter, they ____ in this village for three years.",
    options: ["will live", "will be living", "will have lived", "lived"],
    answer: "will have lived",
    explanation: "Future Perfect – akcja zakończona do określonego momentu w przyszłości."
  },
  {
    id: 173,
    level: "Trudny",
    question: "If I ____ more experience, I would get the job.",
    options: ["had", "have", "would have", "has"],
    answer: "had",
    explanation: "Drugi tryb warunkowy – nierealny warunek w teraźniejszości, Past Simple."
  },
  {
    id: 174,
    level: "Trudny",
    question: "She said she ____ the report before the deadline.",
    options: ["finished", "had finished", "finishes", "has finished"],
    answer: "had finished",
    explanation: "Reported speech – Past Perfect dla wcześniejszej akcji."
  },
  {
    id: 175,
    level: "Trudny",
    question: "The car ____ repaired before the race.",
    options: ["was", "had been", "has been", "is"],
    answer: "had been",
    explanation: "Past Perfect Passive – czynność zakończona przed inną w przeszłości."
  },
  {
    id: 176,
    level: "Trudny",
    question: "The mural ____ painted by the artist last year.",
    options: ["was", "painted", "is painted", "has painted"],
    answer: "was",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 177,
    level: "Trudny",
    question: "By the time we get there, they ____ the game.",
    options: ["will finish", "finished", "will have finished", "finish"],
    answer: "will have finished",
    explanation: "Future Perfect – akcja zakończona przed momentem w przyszłości."
  },
  {
    id: 178,
    level: "Trudny",
    question: "If you ____ me, I would join you.",
    options: ["ask", "asked", "would ask", "asks"],
    answer: "asked",
    explanation: "Drugi tryb warunkowy – Past Simple po 'if' dla nierealnego warunku."
  },
  {
    id: 179,
    level: "Trudny",
    question: "He ____ that he had forgotten his lines.",
    options: ["said", "says", "was said", "say"],
    answer: "said",
    explanation: "Reported speech – czas przeszły."
  },
  {
    id: 180,
    level: "Trudny",
    question: "The documents ____ signed by the director yesterday.",
    options: ["was signed", "signed", "were signed", "has signed"],
    answer: "were signed",
    explanation: "Past Simple Passive – 'were' + III forma dla liczby mnogiej w określonym czasie."
  },
  {
    id: 181,
    level: "Trudny",
    question: "If we ____ the plan, we wouldn’t have failed.",
    options: ["followed", "had followed", "follow", "have followed"],
    answer: "had followed",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 182,
    level: "Trudny",
    question: "By 2028, he ____ in this company for 15 years.",
    options: ["will work", "will have worked", "works", "worked"],
    answer: "will have worked",
    explanation: "Future Perfect – akcja zakończona do określonego momentu w przyszłości."
  },
  {
    id: 183,
    level: "Trudny",
    question: "The statue ____ restored by the team last month.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 184,
    level: "Trudny",
    question: "If I ____ you, I would take a break.",
    options: ["am", "was", "were", "be"],
    answer: "were",
    explanation: "Drugi tryb warunkowy – nierealny warunek w teraźniejszości, 'were' dla wszystkich osób."
  },
  {
    id: 185,
    level: "Trudny",
    question: "She wishes she ____ the chance to travel.",
    options: ["took", "had taken", "takes", "has taken"],
    answer: "had taken",
    explanation: "Wish + Past Perfect dla żalu dotyczącego przeszłości."
  },
  {
    id: 186,
    level: "Trudny",
    question: "The castle ____ built in the 18th century.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – konkretny czas w przeszłości."
  },
  {
    id: 187,
    level: "Trudny",
    question: "By the time you arrive, I ____ the presentation.",
    options: ["finish", "will finish", "will have finished", "finished"],
    answer: "will have finished",
    explanation: "Future Perfect – akcja zakończona przed momentem w przyszłości."
  },
  {
    id: 188,
    level: "Trudny",
    question: "If they ____ earlier, they would have seen the sunrise.",
    options: ["woke", "had woken", "wake", "have woken"],
    answer: "had woken",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 189,
    level: "Trudny",
    question: "The book ____ translated into five languages by 2025.",
    options: ["will be", "was", "will have been", "is"],
    answer: "will have been",
    explanation: "Future Perfect Passive – czynność zakończona w przyszłości, strona bierna."
  },
  {
    id: 190,
    level: "Trudny",
    question: "He said he ____ the project before the deadline.",
    options: ["completed", "had completed", "completes", "has completed"],
    answer: "had completed",
    explanation: "Reported speech – Past Perfect dla wcześniejszej akcji."
  },
  {
    id: 191,
    level: "Trudny",
    question: "If I ____ more time, I would write a book.",
    options: ["had", "have", "would have", "has"],
    answer: "had",
    explanation: "Drugi tryb warunkowy – nierealny warunek w teraźniejszości, Past Simple."
  },
  {
    id: 192,
    level: "Trudny",
    question: "The hall ____ decorated before the ceremony.",
    options: ["has been", "was", "had been", "is"],
    answer: "had been",
    explanation: "Past Perfect Passive – czynność zakończona przed inną w przeszłości."
  },
  {
    id: 193,
    level: "Trudny",
    question: "By next month, they ____ the project for a year.",
    options: ["will work", "will have been working", "work", "worked"],
    answer: "will have been working",
    explanation: "Future Perfect Continuous – akcja trwająca do określonego momentu w przyszłości."
  },
  {
    id: 194,
    level: "Trudny",
    question: "If he ____ the instructions, he wouldn’t have made a mistake.",
    options: ["followed", "had followed", "follows", "has followed"],
    answer: "had followed",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 195,
    level: "Trudny",
    question: "The report ____ prepared by the team yesterday.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 196,
    level: "Trudny",
    question: "By 2029, she ____ in this school for 20 years.",
    options: ["will teach", "will have taught", "teaches", "taught"],
    answer: "will have taught",
    explanation: "Future Perfect – akcja zakończona do określonego momentu w przyszłości."
  },
  {
    id: 197,
    level: "Trudny",
    question: "If we ____ the warning, we wouldn’t have been late.",
    options: ["heeded", "had heeded", "heed", "have heeded"],
    answer: "had heeded",
    explanation: "Trzeci tryb warunkowy – Past Perfect dla warunku w przeszłości."
  },
  {
    id: 198,
    level: "Trudny",
    question: "The building ____ renovated by the workers last year.",
    options: ["is", "was", "has been", "had been"],
    answer: "was",
    explanation: "Past Simple Passive – 'was' + III forma dla określonego czasu."
  },
  {
    id: 199,
    level: "Trudny",
    question: "He wishes he ____ the offer earlier.",
    options: ["accepted", "had accepted", "accepts", "has accepted"],
    answer: "had accepted",
    explanation: "Wish + Past Perfect dla żalu dotyczącego przeszłości."
  },
  {
    id: 200,
    level: "Trudny",
    question: "By the time we arrive, the meeting ____.",
    options: ["will start", "started", "will have started", "starts"],
    answer: "will have started",
    explanation: "Future Perfect – akcja zakończona przed momentem w przyszłości."
  },
  
  {
    id: 201,
    level: "Łatwy",
    question: "My brother ____ basketball on Saturdays.",
    options: ["play", "plays", "played", "playing"],
    answer: "plays",
    explanation: "Present Simple dla nawyku ('on Saturdays') w 3. os. lp. (my brother) wymaga końcówki -s."
  },
  {
    id: 202,
    level: "Łatwy",
    question: "Be quiet! The baby ____.",
    options: ["sleeps", "slept", "is sleeping", "sleep"],
    answer: "is sleeping",
    explanation: "Okrzyk 'Be quiet!' wskazuje na teraźniejszość. Present Continuous (is sleeping) opisuje czynność w tej chwili."
  },
  {
    id: 203,
    level: "Łatwy",
    question: "I ____ a student.",
    options: ["am", "is", "are", "be"],
    answer: "am",
    explanation: "Czasownik 'be' w Present Simple dla pierwszej osoby liczby pojedynczej (I) to 'am'."
  },
  {
    id: 204,
    level: "Łatwy",
    question: "They ____ their grandparents every weekend.",
    options: ["visit", "visits", "visited", "visiting"],
    answer: "visit",
    explanation: "'Every weekend' wskazuje na Present Simple. Podmiot w liczbie mnogiej (They) - czasownik bez końcówki."
  },
  {
    id: 205,
    level: "Łatwy",
    question: "She ____ a book right now.",
    options: ["read", "reads", "is reading", "readed"],
    answer: "is reading",
    explanation: "'Right now' to wyrażenie czasu dla Present Continuous. She + is + czasownik z -ing."
  },
  {
    id: 206,
    level: "Średni",
    question: "I ____ my keys. I can't find them anywhere.",
    options: ["lose", "lost", "have lost", "am losing"],
    answer: "have lost",
    explanation: "Skutek w teraźniejszości (I can't find them) wynika z czynności w przeszłości - Present Perfect."
  },
  {
    id: 207,
    level: "Średni",
    question: "While I ____ dinner, the phone rang.",
    options: ["cooked", "was cooking", "cook", "had cooked"],
    answer: "was cooking",
    explanation: "Past Continuous (was cooking) opisuje dłuższą czynność przerwaną przez krótszą (the phone rang) w Past Simple."
  },
  {
    id: 208,
    level: "Średni",
    question: "She ____ in this company for five years.",
    options: ["works", "worked", "has worked", "is working"],
    answer: "has worked",
    explanation: "'For five years' wskazuje na okres ciągły aż do teraz - Present Perfect."
  },
  {
    id: 209,
    level: "Średni",
    question: "By the time we arrived, the film ____.",
    options: ["already started", "had already started", "has already started", "was already starting"],
    answer: "had already started",
    explanation: "Past Perfect (had started) opisuje czynność wcześniejszą niż inna przeszła (we arrived)."
  },
  {
    id: 210,
    level: "Średni",
    question: "This is the best pizza I ____.",
    options: ["ever ate", "have ever eaten", "ever eat", "had ever eaten"],
    answer: "have ever eaten",
    explanation: "Present Perfect (have eaten) z 'ever' jest używane przy superlatywach dla podkreślenia doświadczenia życiowego."
  },
  {
    id: 211,
    level: "Średni",
    question: "They ____ to Japan twice.",
    options: ["were", "have been", "had been", "are"],
    answer: "have been",
    explanation: "Określenie liczby razy ('twice') związane z czyimś doświadczeniem życiowym wymaga Present Perfect."
  },
  {
    id: 212,
    level: "Średni",
    question: "I ____ to the new restaurant last night.",
    options: ["have gone", "went", "was going", "had gone"],
    answer: "went",
    explanation: "Określony czas w przeszłości ('last night') wymaga Past Simple."
  },
  {
    id: 213,
    level: "Średni",
    question: "He was tired because he ____ all day.",
    options: ["has worked", "worked", "had been working", "was working"],
    answer: "had been working",
    explanation: "Past Perfect Continuous podkreśla długotrwałość czynności, która miała wpływ na stan w przeszłości (was tired)."
  },
  {
    id: 214,
    level: "Średni",
    question: "How long ____ waiting?",
    options: ["have you been", "are you", "were you", "had you been"],
    answer: "have you been",
    explanation: "Pytanie o długość trwającej do teraz czynności wymaga Present Perfect Continuous."
  },
  {
    id: 215,
    level: "Średni",
    question: "The train ____ at 8 PM tomorrow.",
    options: ["leaves", "is leaving", "will leave", "will be leaving"],
    answer: "leaves",
    explanation: "Present Simple jest używany dla rozkładów jazdy i harmonogramów, nawet mówiąc o przyszłości."
  },
  {
    id: 216,
    level: "Trudny",
    question: "If I ____ about the traffic, I would have left earlier.",
    options: ["knew", "had known", "have known", "would know"],
    answer: "had known",
    explanation: "Trzeci tryb warunkowy (Third Conditional) dla nierealnej przeszłości: if + Past Perfect, would have + past participle."
  },
  {
    id: 217,
    level: "Trudny",
    question: "By next month, she ____ here for a decade.",
    options: ["will work", "will have worked", "will be working", "works"],
    answer: "will have worked",
    explanation: "Future Perfect opisuje czynność, która zakończy się przed określonym momentem w przyszłości ('by next month')."
  },
  {
    id: 218,
    level: "Trudny",
    question: "I wish I ____ more time for my hobbies.",
    options: ["have", "had", "would have", "had had"],
    answer: "had",
    explanation: "Wyrażanie życzenia odnoszącego się do teraźniejszości za pomocą 'wish' wymaga Past Simple."
  },
  {
    id: 219,
    level: "Trudny",
    question: "The report ____ by the end of the day.",
    options: ["will have been completed", "will be completed", "is completed", "will complete"],
    answer: "will have been completed",
    explanation: "Future Perfect Passive - czynność *zostanie zakończona* (strona bierna) do określonego przyszłego momentu."
  },
  {
    id: 220,
    level: "Trudny",
    question: "He insisted that she ____ the truth.",
    options: ["tells", "told", "tell", "had told"],
    answer: "tell",
    explanation: "Po czasownikach takich jak 'insist', 'demand', 'suggest' używamy bezokolicznika (base form) w mowie zależnej."
  },
  {
    id: 221,
    level: "Trudny",
    question: "No sooner ____ home than it started to rain.",
    options: ["I had left", "had I left", "I left", "did I leave"],
    answer: "had I left",
    explanation: "Konstrukcja 'No sooner... than' wymaga inwersji (had I left) i czasu Past Perfect dla pierwszej czynności."
  },
  {
    id: 222,
    level: "Trudny",
    question: "If only I ____ his advice back then.",
    options: ["took", "had taken", "would take", "take"],
    answer: "had taken",
    explanation: "'If only' wyraża silne żal lub pragnienie dotyczące przeszłości i wymaga Past Perfect."
  },
  {
    id: 223,
    level: "Trudny",
    question: "Not until later ____ the full extent of the damage.",
    options: ["she realized", "did she realize", "had she realized", "she had realized"],
    answer: "did she realize",
    explanation: "Inwersja (did she realize) jest wymagana, gdy zdanie zaczyna się od wyrażenia przeczącego jak 'Not until'."
  },
  {
    id: 224,
    level: "Trudny",
    question: "The proposal ____ by the committee right now.",
    options: ["is considered", "is being considered", "has been considered", "was considered"],
    answer: "is being considered",
    explanation: "Present Continuous Passive opisuje czynność będącą w trakcie wykonywania (right now) w stronie biernej."
  },
  {
    id: 225,
    level: "Trudny",
    question: "Had I known, I ____ differently.",
    options: ["would act", "would have acted", "acted", "had acted"],
    answer: "would have acted",
    explanation: "Inwersyjna forma trzeciego trybu warunkowego bez 'if': Had + podmiot + past participle, podmiot + would have + past participle."
  },
  {
    id: 226,
    level: "Łatwy",
    question: "Water ____ at 100 degrees Celsius.",
    options: ["boils", "is boiling", "boil", "boiled"],
    answer: "boils",
    explanation: "Present Simple jest używany do wyrażania faktów naukowych i ogólnych prawd."
  },
  {
    id: 227,
    level: "Łatwy",
    question: "We ____ to the cinema last Friday.",
    options: ["go", "went", "have gone", "are going"],
    answer: "went",
    explanation: "Określony czas w przeszłości ('last Friday') wymaga Past Simple."
  },
  {
    id: 228,
    level: "Łatwy",
    question: "Look at those clouds! It ____.",
    options: ["will rain", "is going to rain", "rains", "rained"],
    answer: "is going to rain",
    explanation: "Forma 'be going to' jest używana do przewidywania przyszłości opartego na obecnych, widocznych oznakach (chmury)."
  },
  {
    id: 229,
    level: "Łatwy",
    question: "My father ____ in a hospital.",
    options: ["work", "works", "is working", "worked"],
    answer: "works",
    explanation: "Present Simple do opisu stałej sytuacji lub pracy."
  },
  {
    id: 230,
    level: "Łatwy",
    question: "I can't talk now, I ____ my homework.",
    options: ["do", "am doing", "did", "have done"],
    answer: "am doing",
    explanation: "Czynność odbywająca się w momencie mówienia (I can't talk now) wymaga Present Continuous."
  },
  {
    id: 231,
    level: "Średni",
    question: "By 2030, scientists ____ a cure for many diseases.",
    options: ["will find", "will have found", "are finding", "find"],
    answer: "will have found",
    explanation: "Future Perfect - czynność zostanie ukończona przed określonym momentem w przyszłości ('By 2030')."
  },
  {
    id: 232,
    level: "Średni",
    question: "I ____ to Italy before last year's trip.",
    options: ["have never been", "had never been", "never was", "was never"],
    answer: "had never been",
    explanation: "Past Perfect opisuje doświadczenie lub stan przed innym momentem w przeszłości ('last year's trip')."
  },
  {
    id: 233,
    level: "Średni",
    question: "This time next week, we ____ on a beach.",
    options: ["will lie", "will be lying", "will have lain", "are lying"],
    answer: "will be lying",
    explanation: "Future Continuous opisuje czynność, która będzie trwała w określonym przyszłym momencie ('This time next week')."
  },
  {
    id: 234,
    level: "Średni",
    question: "The room ____ when I entered.",
    options: ["was cleaned", "had been cleaned", "has been cleaned", "cleaned"],
    answer: "had been cleaned",
    explanation: "Past Perfect Passive - czynność *została wykonana* (strona bierna) przed inną przeszłą czynnością (I entered)."
  },
  {
    id: 235,
    level: "Średni",
    question: "She promised she ____ me as soon as she could.",
    options: ["will call", "would call", "called", "calls"],
    answer: "would call",
    explanation: "Mowa zależna (reported speech) - obietnica o przyszłości w przeszłości wymaga użycia 'would'."
  },
  {
    id: 236,
    level: "Średni",
    question: "I ____ my phone. Can I use yours?",
    options: ["lose", "lost", "have lost", "am losing"],
    answer: "have lost",
    explanation: "Present Perfect wyraża czynność w przeszłości, która ma bezpośredni skutek w teraźniejszości (Can I use yours?)."
  },
  {
    id: 237,
    level: "Średni",
    question: "He ____ for three hours before he finally finished.",
    options: ["has been working", "had been working", "was working", "worked"],
    answer: "had been working",
    explanation: "Past Perfect Continuous podkreśla długość trwania czynności, która miała miejsce przed inną przeszłą czynnością."
  },
  {
    id: 238,
    level: "Średni",
    question: "The conference ____ place in Berlin next year.",
    options: ["takes", "is taking", "will take", "will be taking"],
    answer: "will take",
    explanation: "Future Simple dla oficjalnych ogłoszeń i zaplanowanych przyszłych wydarzeń."
  },
  {
    id: 239,
    level: "Średni",
    question: "I ____ to the doctor if I were you.",
    options: ["will go", "would go", "go", "went"],
    answer: "would go",
    explanation: "Drugi tryb warunkowy (Second Conditional) do udzielania rad - If I were you, I would..."
  },
  {
    id: 240,
    level: "Średni",
    question: "The bridge ____ built next year.",
    options: ["is", "will", "will be", "is being"],
    answer: "will be",
    explanation: "Future Simple Passive do opisu przyszłych planów w stronie biernej."
  },
  {
    id: 241,
    level: "Trudny",
    question: "____ he more careful, the accident wouldn't have happened.",
    options: ["Had", "Would", "If had", "Were"],
    answer: "Had",
    explanation: "Inwersyjna forma trzeciego trybu warunkowego: Had + podmiot + past participle... (zamiast If he had been...)"
  },
  {
    id: 242,
    level: "Trudny",
    question: "It's high time you ____ a decision.",
    options: ["make", "made", "have made", "will make"],
    answer: "made",
    explanation: "Konstrukcja 'It's (high) time + podmiot + Past Simple' wyraża, że coś powinno się już stać."
  },
  {
    id: 243,
    level: "Trudny",
    question: "The minister is believed ____ tomorrow.",
    options: ["to resign", "to be resigning", "to have resigned", "resigning"],
    answer: "to resign",
    explanation: "Strona bierna z bezokolicznikiem (passive with infinitive) dla przyszłych wydarzeń: is believed + to + infinitive."
  },
  {
    id: 244,
    level: "Trudny",
    question: "Not a single word ____ since the argument.",
    options: ["has been spoken", "was spoken", "spoke", "had spoken"],
    answer: "has been spoken",
    explanation: "Present Perfect Passive podkreśla stan obecny będący wynikiem przeszłej czynności (od kłótni panuje milczenie)."
  },
  {
    id: 245,
    level: "Trudny",
    question: "I'd rather you ____ me the truth.",
    options: ["tell", "told", "had told", "would tell"],
    answer: "told",
    explanation: "Po 'I'd rather' (wolałbym) odnoszącym się do teraźniejszości lub przyszłości używamy Past Simple."
  },
  {
    id: 246,
    level: "Trudny",
    question: "The painting ____ to be worth millions.",
    options: ["is thought", "thought", "thinks", "has thought"],
    answer: "is thought",
    explanation: "Strona bierna (is thought) jest używana do wyrażania ogólnych opinii lub przekonań."
  },
  {
    id: 247,
    level: "Trudny",
    question: "So successful ____ that they expanded the business.",
    options: ["the venture was", "was the venture", "had the venture been", "the venture had been"],
    answer: "was the venture",
    explanation: "Inwersja (was the venture) jest wymagana, gdy zdanie zaczyna się od 'So + adjective/adverb'."
  },
  {
    id: 248,
    level: "Trudny",
    question: "Under no circumstances ____ access to this file.",
    options: ["should you grant", "you should grant", "grant you should", "you grant should"],
    answer: "should you grant",
    explanation: "Inwersja (should you grant) jest wymagana, gdy zdanie zaczyna się od wyrażenia przeczącego 'Under no circumstances'."
  },
  {
    id: 249,
    level: "Trudny",
    question: "He acts as if he ____ everything.",
    options: ["knows", "knew", "had known", "has known"],
    answer: "knew",
    explanation: "Po 'as if' do opisania nierealnej lub mało prawdopodobnej sytuacji w teraźniejszości używamy Past Simple."
  },
  {
    id: 250,
    level: "Trudny",
    question: "The manuscript is known ____ in the 15th century.",
    options: ["to be written", "to have been written", "to write", "to have written"],
    answer: "to have been written",
    explanation: "Strona bierna z bezokolicznikiem perfect (passive with perfect infinitive) dla czynności przeszłych: is known + to have been + past participle."
  },
  {
    id: 251,
    level: "Łatwy",
    question: "Birds ____ south for the winter.",
    options: ["fly", "flies", "flew", "are flying"],
    answer: "fly",
    explanation: "Present Simple do opisania corocznych migracji i powtarzających się zjawisk przyrody."
  },
  {
    id: 252,
    level: "Łatwy",
    question: "She ____ her teeth twice a day.",
    options: ["brush", "brushes", "brushed", "is brushing"],
    answer: "brushes",
    explanation: "Present Simple dla rutyny i nawyków ('twice a day') z końcówką -es dla 3.os.l.poj."
  },
  {
    id: 253,
    level: "Łatwy",
    question: "The sun ____ in the east.",
    options: ["rise", "rises", "rose", "is rising"],
    answer: "rises",
    explanation: "Present Simple dla niezmiennych faktów i praw przyrody."
  },
  {
    id: 254,
    level: "Łatwy",
    question: "I ____ a letter to my friend yesterday.",
    options: ["write", "wrote", "have written", "am writing"],
    answer: "wrote",
    explanation: "Określony czas w przeszłości ('yesterday') wymaga Past Simple."
  },
  {
    id: 255,
    level: "Łatwy",
    question: "They ____ TV when I called.",
    options: ["watch", "watched", "were watching", "are watching"],
    answer: "were watching",
    explanation: "Past Continuous opisuje czynność trwającą w tle, gdy nastąpiła inna, krótsza czynność (I called)."
  },
  {
    id: 256,
    level: "Średni",
    question: "I ____ already ____ that movie three times.",
    options: ["have / seen", "had / seen", "was / seeing", "did / see"],
    answer: "have / seen",
    explanation: "Present Perfect z 'already' i określeniem liczby razy ('three times') dla podkreślenia doświadczenia."
  },
  {
    id: 257,
    level: "Średni",
    question: "She ____ for the company since she graduated.",
    options: ["works", "worked", "has been working", "is working"],
    answer: "has been working",
    explanation: "Present Perfect Continuous podkreśla ciągłość czynności rozpoczętej w przeszłości i trwającej do teraz ('since she graduated')."
  },
  {
    id: 258,
    level: "Średni",
    question: "The meeting ____ by the time we got there.",
    options: ["had already ended", "already ended", "has already ended", "was already ending"],
    answer: "had already ended",
    explanation: "Past Perfect opisuje czynność, która zakończyła się przed innym momentem w przeszłości (we got there)."
  },
  {
    id: 259,
    level: "Średni",
    question: "If it ____ tomorrow, we will cancel the picnic.",
    options: ["rains", "will rain", "rained", "is raining"],
    answer: "rains",
    explanation: "Pierwszy tryb warunkowy (First Conditional) dla realnej przyszłości: If + Present Simple, will + infinitive."
  },
  {
    id: 260,
    level: "Średni",
    question: "The new park ____ next month.",
    options: ["opens", "is opened", "will open", "will be opened"],
    answer: "opens",
    explanation: "Present Simple jest używany dla oficjalnych, zaplanowanych przyszłych wydarzeń, takich jak otwarcia."
  },
  {
    id: 261,
    level: "Łatwy",
    question: "Cats ____ milk.",
    options: ["love", "loves", "loved", "loving"],
    answer: "love",
    explanation: "Present Simple dla ogólnych prawd i charakterystycznych zachowań. Podmiot w liczbie mnogiej - czasownik bez końcówki."
  },
  {
    id: 262,
    level: "Łatwy",
    question: "I ____ to music every evening.",
    options: ["listen", "listens", "listened", "am listening"],
    answer: "listen",
    explanation: "'Every evening' wskazuje na nawyk - Present Simple. 'I' → czasownik w podstawowej formie."
  },
  {
    id: 263,
    level: "Łatwy",
    question: "The children ____ in the park right now.",
    options: ["play", "plays", "are playing", "played"],
    answer: "are playing",
    explanation: "'Right now' wskazuje na czynność w trakcie wykonywania - Present Continuous. 'Children' → liczba mnoga → 'are playing'."
  },
  {
    id: 264,
    level: "Łatwy",
    question: "She ____ breakfast at 8 AM every day.",
    options: ["have", "has", "had", "having"],
    answer: "has",
    explanation: "Present Simple dla rutyny ('every day'). 3. osoba liczby pojedynczej (she) wymaga końcówki -s."
  },
  {
    id: 265,
    level: "Łatwy",
    question: "We ____ to the zoo last Sunday.",
    options: ["go", "went", "have gone", "are going"],
    answer: "went",
    explanation: "Określony czas w przeszłości ('last Sunday') wymaga Past Simple."
  },
  {
    id: 266,
    level: "Średni",
    question: "By this time next year, I ____ university.",
    options: ["will finish", "will have finished", "finish", "am finishing"],
    answer: "will have finished",
    explanation: "Future Perfect - czynność zostanie ukończona przed określonym przyszłym momentem ('by this time next year')."
  },
  {
    id: 267,
    level: "Średni",
    question: "He ____ for two hours before she arrived.",
    options: ["has waited", "had been waiting", "was waiting", "waited"],
    answer: "had been waiting",
    explanation: "Past Perfect Continuous podkreśla długość trwania czynności, która miała miejsce przed innym momentem w przeszłości."
  },
  {
    id: 268,
    level: "Średni",
    question: "If I ____ you, I would accept the offer.",
    options: ["am", "was", "were", "have been"],
    answer: "were",
    explanation: "Drugi tryb warunkowy - dla nierealnych sytuacji w teraźniejszości używamy 'were' dla wszystkich osób."
  },
  {
    id: 269,
    level: "Średni",
    question: "The book ____ by millions of people worldwide.",
    options: ["reads", "is read", "has read", "read"],
    answer: "is read",
    explanation: "Present Simple Passive - opisuje ogólny, powtarzający się fakt w stronie biernej."
  },
  {
    id: 270,
    level: "Średni",
    question: "They ____ each other since childhood.",
    options: ["know", "have known", "knew", "had known"],
    answer: "have known",
    explanation: "'Since childhood' wskazuje na okres ciągły aż do teraz - Present Perfect."
  },
  {
    id: 271,
    level: "Średni",
    question: "The cake ____ by the time we arrived at the party.",
    options: ["was already eaten", "had already been eaten", "has already been eaten", "already ate"],
    answer: "had already been eaten",
    explanation: "Past Perfect Passive - czynność została zakończona (strona bierna) przed innym momentem w przeszłości."
  },
  {
    id: 272,
    level: "Średni",
    question: "I ____ to Paris three times so far.",
    options: ["was", "have been", "had been", "am"],
    answer: "have been",
    explanation: "'So far' i określenie liczby razy ('three times') wymaga Present Perfect."
  },
  {
    id: 273,
    level: "Średni",
    question: "She ____ when the doorbell rang.",
    options: ["slept", "was sleeping", "had slept", "is sleeping"],
    answer: "was sleeping",
    explanation: "Past Continuous opisuje czynność trwającą w tle, gdy nastąpiła nagła, krótsza czynność."
  },
  {
    id: 274,
    level: "Średni",
    question: "The decision ____ by the committee tomorrow.",
    options: ["is made", "will be made", "makes", "has been made"],
    answer: "will be made",
    explanation: "Future Simple Passive - opisuje przyszłą czynność w stronie biernej."
  },
  {
    id: 275,
    level: "Średni",
    question: "If it ____ sunny tomorrow, we'll go to the beach.",
    options: ["is", "will be", "was", "would be"],
    answer: "is",
    explanation: "Pierwszy tryb warunkowy - warunek w Present Simple, wynik w Future Simple."
  },
  {
    id: 276,
    level: "Trudny",
    question: "____ I known about the problem, I would have helped.",
    options: ["Have", "Had", "Would", "Did"],
    answer: "Had",
    explanation: "Inwersyjna forma trzeciego trybu warunkowego: Had + podmiot + past participle... (zamiast If I had known...)"
  },
  {
    id: 277,
    level: "Trudny",
    question: "Not only ____ late, but he also forgot the documents.",
    options: ["did he arrive", "he arrived", "arrived he", "had he arrived"],
    answer: "did he arrive",
    explanation: "Inwersja (did he arrive) jest wymagana, gdy zdanie zaczyna się od 'Not only'."
  },
  {
    id: 278,
    level: "Trudny",
    question: "The project ____ by the end of this week.",
    options: ["will have been completed", "will complete", "is completing", "completes"],
    answer: "will have been completed",
    explanation: "Future Perfect Passive - czynność zostanie zakończona (strona bierna) do określonego przyszłego momentu."
  },
  {
    id: 279,
    level: "Trudny",
    question: "I'd sooner you ____ me the truth now.",
    options: ["tell", "told", "had told", "would tell"],
    answer: "told",
    explanation: "Po 'I'd sooner' (wolałbym) odnoszącym się do teraźniejszości lub przyszłości używamy Past Simple."
  },
  {
    id: 280,
    level: "Trudny",
    question: "Such ____ the weather that we stayed indoors.",
    options: ["was", "is", "had been", "would be"],
    answer: "was",
    explanation: "Inwersja (Such was the weather...) jest używana dla podkreślenia i dramatyzmu w opisie sytuacji."
  },
  {
    id: 281,
    level: "Trudny",
    question: "The suspect is alleged ____ the crime.",
    options: ["to commit", "to have committed", "committing", "committed"],
    answer: "to have committed",
    explanation: "Strona bierna z bezokolicznikiem perfect - dla czynności przeszłych: is alleged + to have + past participle."
  },
  {
    id: 282,
    level: "Trudny",
    question: "Were I in your position, I ____ differently.",
    options: ["will act", "would act", "acted", "had acted"],
    answer: "would act",
    explanation: "Inwersyjna forma drugiego trybu warunkowego: Were + podmiot..., podmiot + would + infinitive."
  },
  {
    id: 283,
    level: "Trudny",
    question: "Little ____ how important that decision would be.",
    options: ["did he know", "he knew", "had he known", "he knows"],
    answer: "did he know",
    explanation: "Inwersja (did he know) jest wymagana, gdy zdanie zaczyna się od przeczących określeń jak 'Little'."
  },
  {
    id: 284,
    level: "Trudny",
    question: "The documents ____ by the time the audit begins.",
    options: ["will have been prepared", "will prepare", "are prepared", "prepare"],
    answer: "will have been prepared",
    explanation: "Future Perfect Passive - przygotowanie dokumentów zostanie zakończone przed rozpoczęciem audytu."
  },
  {
    id: 285,
    level: "Trudny",
    question: "So ridiculous ____ that nobody believed it.",
    options: ["the story was", "was the story", "had the story been", "the story had been"],
    answer: "was the story",
    explanation: "Inwersja (was the story) jest wymagana, gdy zdanie zaczyna się od 'So + adjective'."
  },
  {
    id: 286,
    level: "Łatwy",
    question: "My sister ____ medicine at university.",
    options: ["study", "studies", "studied", "is studying"],
    answer: "studies",
    explanation: "Present Simple dla opisu stałej sytuacji (kierunek studiów). 3. osoba liczby pojedynczej + końcówka -es."
  },
  {
    id: 287,
    level: "Łatwy",
    question: "They ____ to school by bus.",
    options: ["go", "goes", "went", "are going"],
    answer: "go",
    explanation: "Present Simple dla stałego sposobu przemieszczania się. Podmiot mnogi → czasownik bez końcówki."
  },
  {
    id: 288,
    level: "Łatwy",
    question: "I ____ a wonderful dream last night.",
    options: ["have", "had", "has", "am having"],
    answer: "had",
    explanation: "Określony czas w przeszłości ('last night') wymaga Past Simple."
  },
  {
    id: 289,
    level: "Łatwy",
    question: "The teacher ____ the lesson at the moment.",
    options: ["explain", "explains", "is explaining", "explained"],
    answer: "is explaining",
    explanation: "'At the moment' wskazuje na Present Continuous. 'The teacher' → 3.os.l.poj. → 'is explaining'."
  },
  {
    id: 290,
    level: "Łatwy",
    question: "We ____ our grandparents every Christmas.",
    options: ["visit", "visits", "visited", "are visiting"],
    answer: "visit",
    explanation: "Present Simple dla corocznych tradycji i rytuałów. Podmiot mnogi → czasownik bez końcówki."
  },
  {
    id: 291,
    level: "Średni",
    question: "By the time he arrived, we ____ waiting for over an hour.",
    options: ["have been", "had been", "were", "are"],
    answer: "had been",
    explanation: "Past Perfect Continuous - podkreśla długość oczekiwania, które trwało przed jego przybyciem."
  },
  {
    id: 292,
    level: "Średni",
    question: "The new law ____ effect next month.",
    options: ["takes", "will take", "is taking", "has taken"],
    answer: "takes",
    explanation: "Present Simple dla oficjalnych, zaplanowanych przyszłych wydarzeń (wejście w życie ustawy)."
  },
  {
    id: 293,
    level: "Średni",
    question: "I wish I ____ play the piano.",
    options: ["can", "could", "have been able to", "will be able to"],
    answer: "could",
    explanation: "Wyrażanie życzenia odnoszącego się do teraźniejszości za pomocą 'wish' wymaga Past Simple."
  },
  {
    id: 294,
    level: "Średni",
    question: "The bridge ____ for over 50 years.",
    options: ["stands", "has stood", "stood", "is standing"],
    answer: "has stood",
    explanation: "Present Perfect dla stanu, który trwa od przeszłości do teraz ('for over 50 years')."
  },
  {
    id: 295,
    level: "Średni",
    question: "If you heat ice, it ____.",
    options: ["melts", "melt", "will melt", "is melting"],
    answer: "melts",
    explanation: "Present Simple dla opisu niezmiennych praw fizycznych i przyrodniczych."
  },
  {
    id: 296,
    level: "Średni",
    question: "She ____ the company since its foundation.",
    options: ["manages", "managed", "has managed", "is managing"],
    answer: "has managed",
    explanation: "'Since its foundation' wskazuje na okres od konkretnego momentu w przeszłości do teraz - Present Perfect."
  },
  {
    id: 297,
    level: "Średni",
    question: "The letter ____ yesterday.",
    options: ["is delivered", "was delivered", "delivered", "has been delivered"],
    answer: "was delivered",
    explanation: "Past Simple Passive - czynność została wykonana w określonej przeszłości ('yesterday')."
  },
  {
    id: 298,
    level: "Średni",
    question: "They ____ married for 25 years next month.",
    options: ["are", "have been", "will have been", "were"],
    answer: "will have been",
    explanation: "Future Perfect - stan, który będzie trwał określoną ilość czasu do konkretnego momentu w przyszłości."
  },
  {
    id: 299,
    level: "Średni",
    question: "I ____ to the dentist twice this year.",
    options: ["went", "have been", "had been", "am going"],
    answer: "have been",
    explanation: "'This year' (które jeszcze się nie skończyło) wymaga Present Perfect."
  },
  {
    id: 300,
    level: "Średni",
    question: "The train ____ at 9:45 every morning.",
    options: ["leaves", "is leaving", "will leave", "left"],
    answer: "leaves",
    explanation: "Present Simple dla rozkładów jazdy i stałych harmonogramów."
  },
  {
    id: 301,
    level: "Trudny",
    question: "____ we to miss the flight, there would be another one tomorrow.",
    options: ["Were", "Should", "Had", "Would"],
    answer: "Were",
    explanation: "Inwersyjna forma drugiego trybu warunkowego: Were + podmiot + to + infinitive..."
  },
  {
    id: 302,
    level: "Trudny",
    question: "Nowhere ____ such beautiful beaches as in the Caribbean.",
    options: ["you can find", "can you find", "you found", "found you"],
    answer: "can you find",
    explanation: "Inwersja (can you find) jest wymagana, gdy zdanie zaczyna się od przeczących określeń miejsca ('Nowhere')."
  },
  {
    id: 303,
    level: "Trudny",
    question: "The manuscript is thought ____ in the 12th century.",
    options: ["to be written", "to have been written", "writing", "written"],
    answer: "to have been written",
    explanation: "Strona bierna z bezokolicznikiem perfect - dla czynności przeszłych: is thought + to have been + past participle."
  },
  {
    id: 304,
    level: "Trudny",
    question: "Had she studied harder, she ____ the exam.",
    options: ["would pass", "would have passed", "passed", "had passed"],
    answer: "would have passed",
    explanation: "Inwersyjna forma trzeciego trybu warunkowego: Had + podmiot + past participle, podmiot + would have + past participle."
  },
  {
    id: 305,
    level: "Trudny",
    question: "So intense ____ that we had to stop the match.",
    options: ["was the rain", "the rain was", "had the rain been", "the rain had been"],
    answer: "was the rain",
    explanation: "Inwersja (was the rain) jest wymagana, gdy zdanie zaczyna się od 'So + adjective'."
  },
  {
    id: 306,
    level: "Trudny",
    question: "The president is expected ____ a statement later today.",
    options: ["to make", "making", "make", "to have made"],
    answer: "to make",
    explanation: "Strona bierna z bezokolicznikiem (passive with infinitive) dla przyszłych wydarzeń: is expected + to + infinitive."
  },
  {
    id: 307,
    level: "Trudny",
    question: "Never before ____ such a spectacular performance.",
    options: ["I have seen", "have I seen", "I saw", "did I see"],
    answer: "have I seen",
    explanation: "Inwersja (have I seen) jest wymagana, gdy zdanie zaczyna się od 'Never'."
  },
  {
    id: 308,
    level: "Trudny",
    question: "The contract ____ by both parties by next Friday.",
    options: ["will have been signed", "will be signed", "is signed", "signs"],
    answer: "will have been signed",
    explanation: "Future Perfect Passive - podpisanie kontraktu zostanie zakończone do określonego przyszłego terminu."
  },
  {
    id: 309,
    level: "Trudny",
    question: "Not until he apologized ____ him again.",
    options: ["I spoke to", "did I speak to", "I had spoken to", "had I spoken to"],
    answer: "did I speak to",
    explanation: "Inwersja (did I speak) jest wymagana, gdy zdanie zaczyna się od 'Not until'."
  },
  {
    id: 310,
    level: "Trudny",
    question: "The phenomenon ____ fully understood.",
    options: ["is not yet", "has not yet been", "not yet is", "yet has not been"],
    answer: "has not yet been",
    explanation: "Present Perfect Passive z 'yet' - opisuje czynność, która nie została jeszcze zakończona do teraz."
  },
  {
    id: 311,
    level: "Łatwy",
    question: "Fish ____ in water.",
    options: ["live", "lives", "lived", "are living"],
    answer: "live",
    explanation: "Present Simple dla podstawowych faktów biologicznych. Podmiot mnogi → czasownik bez końcówki."
  },
  {
    id: 312,
    level: "Łatwy",
    question: "He ____ to work by car.",
    options: ["go", "goes", "went", "is going"],
    answer: "goes",
    explanation: "Present Simple dla stałego sposobu przemieszczania się. 3. osoba liczby pojedynczej + końcówka -es."
  },
  {
    id: 313,
    level: "Łatwy",
    question: "We ____ a great time at the party yesterday.",
    options: ["have", "had", "has", "are having"],
    answer: "had",
    explanation: "Określony czas w przeszłości ('yesterday') wymaga Past Simple."
  },
  {
    id: 314,
    level: "Łatwy",
    question: "The students ____ for their exam right now.",
    options: ["study", "studies", "are studying", "studied"],
    answer: "are studying",
    explanation: "'Right now' wskazuje na Present Continuous. 'The students' → liczba mnoga → 'are studying'."
  },
  {
    id: 315,
    level: "Łatwy",
    question: "She ____ English very well.",
    options: ["speak", "speaks", "spoke", "is speaking"],
    answer: "speaks",
    explanation: "Present Simple dla opisu stałych umiejętności. 3. osoba liczby pojedynczej + końcówka -s."
  },
  {
    id: 316,
    level: "Średni",
    question: "By 2050, most cars ____ electric.",
    options: ["will be", "are", "have been", "were"],
    answer: "will be",
    explanation: "Future Simple dla przewidywań i prognoz na przyszłość."
  },
  {
    id: 317,
    level: "Średni",
    question: "I ____ here since I was a child.",
    options: ["live", "lived", "have lived", "am living"],
    answer: "have lived",
    explanation: "'Since I was a child' wskazuje na okres od przeszłości do teraz - Present Perfect."
  },
  {
    id: 318,
    level: "Średni",
    question: "The movie ____ when we entered the cinema.",
    options: ["started", "had already started", "has started", "starts"],
    answer: "had already started",
    explanation: "Past Perfect - czynność rozpoczęła się przed naszym wejściem do kina."
  },
  {
    id: 319,
    level: "Średni",
    question: "If I ____ enough money, I would buy a new car.",
    options: ["have", "had", "would have", "has"],
    answer: "had",
    explanation: "Drugi tryb warunkowy - nierealna sytuacja w teraźniejszości wymaga Past Simple po 'if'."
  },
  {
    id: 320,
    level: "Średni",
    question: "The problem ____ by our best engineers at the moment.",
    options: ["is being solved", "is solved", "solves", "has been solved"],
    answer: "is being solved",
    explanation: "Present Continuous Passive - problem jest aktualnie rozwiązywany (czynność w toku)."
  }
];

const germanTasks: Task[] = [
  {
    id: 1,
    level: "Łatwy",
    question: "Er ____ in Berlin.",
    options: ["wohnen", "wohnt", "wohnte", "gewohnt"],
    answer: "wohnt",
    explanation: "Trzecia osoba liczby pojedynczej w Präsens przyjmuje końcówkę -t.",
  },
  {
    id: 2,
    level: "Łatwy",
    question: "Wir ____ heute ins Kino.",
    options: ["gehen", "geht", "ging", "gegangen"],
    answer: "gehen",
    explanation: "Formy czasownika 'gehen' w Präsens dla 1. os. liczby mnogiej to 'gehen'.",
  },
  {
    id: 3,
    level: "Łatwy",
    question: "Sie ____ eine Tasse Kaffee.",
    options: ["trinkt", "trinken", "trank", "getrunken"],
    answer: "trinkt",
    explanation: "'Sie' w znaczeniu 'ona' wymaga końcówki -t.",
  },
  {
    id: 4,
    level: "Łatwy",
    question: "Wie sagt man 'dziękuję' auf Deutsch?",
    options: ["Bitte", "Danke", "Hallo", "Tschüss"],
    answer: "Danke",
    explanation: "'Danke' oznacza 'dziękuję'.",
  },
  {
    id: 5,
    level: "Łatwy",
    question: "Der Plural von 'Kind' ist ____.",
    options: ["Kinds", "Kinder", "Kinde", "Kinden"],
    answer: "Kinder",
    explanation: "Liczba mnoga rzeczownika 'Kind' to 'Kinder'.",
  },
  {
    id: 6,
    level: "Łatwy",
    question: "Ich ____ jeden Morgen Tee.",
    options: ["trinke", "trinkst", "trank", "getrunken"],
    answer: "trinke",
    explanation: "Pierwsza osoba liczby pojedynczej przyjmuje końcówkę -e.",
  },
  {
    id: 7,
    level: "Łatwy",
    question: "Setze den Artikel: ____ Haus ist groß.",
    options: ["Der", "Die", "Das", "Den"],
    answer: "Das",
    explanation: "'Haus' to rodzaj nijaki → 'das'.",
  },
  {
    id: 8,
    level: "Łatwy",
    question: "Wähle das Gegenteil von 'klein'.",
    options: ["lang", "groß", "kurz", "nah"],
    answer: "groß",
    explanation: "Przeciwieństwem 'klein' jest 'groß'.",
  },
  {
    id: 9,
    level: "Łatwy",
    question: "Was bedeutet 'Freund'?",
    options: ["przyjaciel", "wróg", "dziecko", "nauczyciel"],
    answer: "przyjaciel",
    explanation: "'Freund' oznacza 'przyjaciel'.",
  },
  {
    id: 10,
    level: "Łatwy",
    question: "Er ____ gestern zu Hause.",
    options: ["ist", "war", "ist gewesen", "sein"],
    answer: "war",
    explanation: "Czas przeszły Präteritum czasownika 'sein' to 'war'.",
  },
  {
    id: 11,
    level: "Średni",
    question: "Wir ____ seit zwei Jahren Deutsch.",
    options: ["lernen", "lernten", "haben gelernt", "lernen werden"],
    answer: "lernen",
    explanation: "Konstrukcja z 'seit' łączy się z Präsens → 'lernen'.",
  },
  {
    id: 12,
    level: "Średni",
    question: "Er hat das Buch gestern ____.",
    options: ["gekauft", "kauft", "kaufe", "kaufen"],
    answer: "gekauft",
    explanation: "Perfekt czasownika 'kaufen' tworzymy z 'gekauft'.",
  },
  {
    id: 13,
    level: "Średni",
    question: "Setze richtig ein: Wenn es regnet, ____ ich zu Hause.",
    options: ["bleibe", "bleibst", "bleibt", "blieb"],
    answer: "bleibe",
    explanation: "Pierwsza osoba liczby pojedynczej → 'bleibe'.",
  },
  {
    id: 14,
    level: "Średni",
    question: "Übersetze: 'Ona lubi czytać książki'.",
    options: ["Sie liest gern Bücher.", "Sie lese gern Bücher.", "Sie liest Bücher gern.", "Sie liest Bücher mögen."],
    answer: "Sie liest gern Bücher.",
    explanation: "Poprawny szyk: czasownik na drugim miejscu, 'gern' po czasowniku.",
  },
  {
    id: 15,
    level: "Średni",
    question: "Wybierz poprawne zdanie w Perfekcie.",
    options: ["Ich habe gegessen.", "Ich hat gegessen.", "Ich bin essen.", "Ich habe esse."],
    answer: "Ich habe gegessen.",
    explanation: "Czas Perfekt tworzymy z 'haben' + Partizip II.",
  },
  {
    id: 16,
    level: "Średni",
    question: "Welche Präposition passt? Ich warte ____ dich.",
    options: ["auf", "an", "mit", "zu"],
    answer: "auf",
    explanation: "Czasownik 'warten' łączy się z przyimkiem 'auf'.",
  },
  {
    id: 17,
    level: "Średni",
    question: "Er sagte, er ____ später kommen.",
    options: ["würde", "wird", "sei", "hat"],
    answer: "würde",
    explanation: "Mowa zależna w czasie przeszłym → używamy 'würde'.",
  },
  {
    id: 18,
    level: "Średni",
    question: "Setze das richtige Modalverb: Du ____ mehr lernen.",
    options: ["musst", "musstet", "müsste", "musste"],
    answer: "musst",
    explanation: "Wskazówka: powinność w teraźniejszości → 'musst'.",
  },
  {
    id: 19,
    level: "Średni",
    question: "Welche Form ist richtig? 'Ich habe keine ____ Geld.'",
    options: ["viel", "viele", "wenig", "mehr"],
    answer: "viel",
    explanation: "'Geld' jest niepoliczalne → używamy 'viel'.",
  },
  {
    id: 20,
    level: "Średni",
    question: "Konjunktiv II: Wenn ich Zeit ____, würde ich reisen.",
    options: ["habe", "hätte", "hatte", "haben"],
    answer: "hätte",
    explanation: "Tryb przypuszczający wymaga formy 'hätte'.",
  },
];

const spanishTasks: Task[] = [
  {
    id: 1,
    level: "Łatwy",
    question: "Yo ____ café por la mañana.",
    options: ["bebo", "bebes", "bebí", "bebido"],
    answer: "bebo",
    explanation: "Pierwsza osoba liczby pojedynczej w Presente → 'bebo'.",
  },
  {
    id: 2,
    level: "Łatwy",
    question: "¿Cómo se dice 'dziękuję' en español?",
    options: ["Hola", "Adiós", "Gracias", "Perdón"],
    answer: "Gracias",
    explanation: "'Gracias' oznacza 'dziękuję'.",
  },
  {
    id: 3,
    level: "Łatwy",
    question: "El plural de 'libro' es ____.",
    options: ["libros", "libres", "libras", "libra"],
    answer: "libros",
    explanation: "Dodajemy końcówkę -s → 'libros'.",
  },
  {
    id: 4,
    level: "Łatwy",
    question: "Nosotros ____ en Madrid.",
    options: ["vivimos", "vive", "vivís", "vivieron"],
    answer: "vivimos",
    explanation: "Pierwsza osoba liczby mnogiej w Presente → 'vivimos'.",
  },
  {
    id: 5,
    level: "Łatwy",
    question: "Completa: Ella ____ una carta.",
    options: ["escribe", "escribo", "escriben", "escrito"],
    answer: "escribe",
    explanation: "Trzecia osoba liczby pojedynczej → 'escribe'.",
  },
  {
    id: 6,
    level: "Łatwy",
    question: "Selecciona el artículo correcto: ____ casa es grande.",
    options: ["La", "El", "Los", "Un"],
    answer: "La",
    explanation: "'Casa' jest rodzaju żeńskiego → 'la'.",
  },
  {
    id: 7,
    level: "Łatwy",
    question: "El contrario de 'frío' es ____.",
    options: ["caliente", "corto", "grande", "viejo"],
    answer: "caliente",
    explanation: "Przeciwieństwo 'frío' to 'caliente'.",
  },
  {
    id: 8,
    level: "Łatwy",
    question: "¿Qué significa 'amigo'?",
    options: ["wróg", "przyjaciel", "dom", "dziecko"],
    answer: "przyjaciel",
    explanation: "'Amigo' oznacza 'przyjaciel'.",
  },
  {
    id: 9,
    level: "Łatwy",
    question: "Ayer nosotros ____ al cine.",
    options: ["vamos", "fuimos", "íbamos", "ir"],
    answer: "fuimos",
    explanation: "Czas Pretérito Indefinido od 'ir' → 'fuimos'.",
  },
  {
    id: 10,
    level: "Łatwy",
    question: "¿Cómo se dice 'kot' en español?",
    options: ["perro", "gato", "pájaro", "pez"],
    answer: "gato",
    explanation: "'Gato' oznacza 'kot'.",
  },
  {
    id: 11,
    level: "Średni",
    question: "Yo ____ estudiando desde hace dos horas.",
    options: ["estoy", "soy", "fui", "estaba"],
    answer: "estoy",
    explanation: "Konstrukcja 'estar + gerundio' wymaga czasownika 'estar' w Presente.",
  },
  {
    id: 12,
    level: "Średni",
    question: "Ella ha ____ una carta.",
    options: ["escrito", "escribido", "escribió", "escriba"],
    answer: "escrito",
    explanation: "Participio nieprawidłowe czasownika 'escribir' to 'escrito'.",
  },
  {
    id: 13,
    level: "Średni",
    question: "Si tengo tiempo, ____ al gimnasio.",
    options: ["voy", "fui", "iba", "iré"],
    answer: "voy",
    explanation: "Pierwszy tryb warunkowy używa Presente w zdaniu warunkowym.",
  },
  {
    id: 14,
    level: "Średni",
    question: "Traduce: 'Oni mieszkają w Barcelonie'.",
    options: ["Ellos viven en Barcelona.", "Ellos viven a Barcelona.", "Ellos vivan en Barcelona.", "Ellos vivieron en Barcelona."],
    answer: "Ellos viven en Barcelona.",
    explanation: "Czas teraźniejszy Presente de Indicativo: 'viven'.",
  },
  {
    id: 15,
    level: "Średni",
    question: "Elige la forma correcta: Nosotros ____ terminado.",
    options: ["hemos", "han", "habéis", "hayan"],
    answer: "hemos",
    explanation: "'Nosotros' w Perfekcie używa 'hemos'.",
  },
  {
    id: 16,
    level: "Średni",
    question: "¿Qué preposición falta? Estoy esperando ____ ti.",
    options: ["por", "a", "de", "con"],
    answer: "a",
    explanation: "'Esperar a alguien' – używamy przyimka 'a'.",
  },
  {
    id: 17,
    level: "Średni",
    question: "Elige el tiempo correcto: Mañana ____ a estudiar.",
    options: ["voy", "fui", "iba", "he ido"],
    answer: "voy",
    explanation: "Wyrażenie 'ir a + infinitivo' w przyszłości wymaga formy 'voy'.",
  },
  {
    id: 18,
    level: "Średni",
    question: "Completa: Deberías ____ más.",
    options: ["estudiar", "estudia", "estudiando", "estudiado"],
    answer: "estudiar",
    explanation: "Po 'deberías' używamy bezokolicznika.",
  },
  {
    id: 19,
    level: "Średni",
    question: "Selecciona la opción correcta: No tengo ____ dinero.",
    options: ["mucho", "muchos", "muchas", "muy"],
    answer: "mucho",
    explanation: "'Dinero' jest niepoliczalne → 'mucho'.",
  },
  {
    id: 20,
    level: "Średni",
    question: "Condicional: Si yo ____ tiempo, viajaría más.",
    options: ["tengo", "tuviera", "tuve", "tendré"],
    answer: "tuviera",
    explanation: "Drugi tryb warunkowy wymaga Imperfecto de Subjuntivo: 'tuviera'.",
  },
];

export const TASK_BANKS: Record<LearningLanguage, Task[]> = {
  en: englishTasks,
  de: germanTasks,
  es: spanishTasks,
};

