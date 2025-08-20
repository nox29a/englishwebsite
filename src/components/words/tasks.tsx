export interface Task {
  id: number;
  level: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export const tasks: Task[] = [

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
  }

]