import type { LearningLanguage } from "./language_packs";

export type Question = {
  q: string
  options?: string[]   // tylko dla "choice"
  answer: string | number
  type: "choice" | "fill"
  explanation?: string // opcjonalne wyjaśnienie
}

const englishQuestions: Record<string, Question[]> = {
"A1": [
    // Sekcja: Podstawowe zwroty i reakcje
    { q: "What's your name?", type: "choice", options: ["I'm fine, thanks.", "My name is Anna.", "Yes, I am.", "It's good."], answer: 1 },
    { q: "Where are you from?", type: "choice", options: ["I'm from Spain.", "I'm 20 years old.", "Yes, I do.", "I'm at home."], answer: 0 },
    { q: "How do you say 'dziękuję' in English?", type: "choice", options: ["Sorry", "Hello", "Thank you", "Please"], answer: 2 },
    { q: "How do you say 'dobranoc' in English?", type: "choice", options: ["Good morning", "Good night", "Hello", "Goodbye"], answer: 1 },
    { q: "How do you say 'proszę' in English?", type: "choice", options: ["Please", "Sorry", "Thanks", "You're welcome"], answer: 0 },
    { q: "How do you say 'przepraszam' in English?", type: "choice", options: ["Excuse me / Sorry", "Thank you", "Please", "See you later"], answer: 0 }, // "Sorry" jest adekwatne, ale "Excuse me" też. Rozszerzyłem odpowiedź.
    { q: "How do you say 'dzień dobry' in English?", type: "choice", options: ["Good night", "Good morning / Hello", "Goodbye", "See you"], answer: 1 }, // "Good morning" jest precyzyjniejsze, ale "Hello" też działa.
    { q: "How do you say 'do widzenia' in English?", type: "choice", options: ["Hello", "Goodbye", "Please", "Thanks"], answer: 1 },
    { q: "How do you say 'tak' in English?", type: "choice", options: ["No", "Yes", "Maybe", "Later"], answer: 1 },

    // Sekcja: Gramatyka (to be, present simple, articles)
    { q: "Complete: I ___ a student.", type: "choice", options: ["is", "are", "am", "be"], answer: 2 },
    { q: "Complete: He ___ not here now.", type: "choice", options: ["is", "are", "am", "be"], answer: 0 },
    { q: "Complete: They ___ in the park.", type: "choice", options: ["is", "are", "am", "be"], answer: 1 },
    { q: "Complete: He ___ a doctor.", type: "choice", options: ["is", "are", "am", "be"], answer: 0 },
    { q: "Choose: She ___ breakfast every day.", type: "choice", options: ["eat", "eats", "is eat", "eating"], answer: 1 },
    { q: "Choose: I ___ coffee in the morning.", type: "choice", options: ["drink", "drinks", "drinking", "drank"], answer: 0 },
    { q: "Choose: I ___ in Poland.", type: "choice", options: ["live", "lives", "living", "lived"], answer: 0 },
    { q: "Choose: Where ___ you live?", type: "choice", options: ["do", "does", "are", "is"], answer: 0 },
    { q: "Choose: I ___ like bananas.", type: "choice", options: ["don't", "doesn't", "not", "no"], answer: 0 },
    { q: "Complete: We ___ to school by bus.", type: "choice", options: ["go", "goes", "went", "going"], answer: 0 },
    { q: "Complete: I can ___ a bike.", type: "choice", options: ["ride", "riding", "rode", "rides"], answer: 0 },
    { q: "Complete: I like ___ tea.", type: "choice", options: ["drink", "drinking", "to drink", "drank"], answer: 2 }, // Obie opcje 1 i 2 są poprawne, ale 2 (to drink) jest bardziej uniwersalną odpowiedzią na testach.
    { q: "Choose: This is ___ book.", type: "choice", options: ["my", "me", "I", "mine"], answer: 0 },
    { q: "Choose the correct word: ___ apple", type: "choice", options: ["a", "an", "the", "-"], answer: 1 }, // "no article" -> "-" jest czystsze
    { q: "Choose the correct word: She has ___ cat.", type: "choice", options: ["a", "an", "the", "-"], answer: 0 },

    // Sekcja: Słownictwo (rzeczowniki, przeciwieństwa, kolokwializmy)
    { q: "What's the plural of 'child'?", type: "choice", options: ["childs", "children", "childes", "childrens"], answer: 1 },
    { q: "What's the plural of 'dog'?", type: "choice", options: ["dog", "dogs", "doges", "doggies"], answer: 1 },
    { q: "What's the opposite of 'big'?", type: "choice", options: ["small", "long", "short", "tiny"], answer: 0 },
    { q: "What's the color of the sky on a clear day?", type: "choice", options: ["green", "blue", "black", "pink"], answer: 1 },
    { q: "Which word is a number?", type: "choice", options: ["red", "table", "seven", "happy"], answer: 2 },
    { q: "Which word is a day of the week?", type: "choice", options: ["orange", "Monday", "Paris", "car"], answer: 1 },
    { q: "Which word is a season?", type: "choice", options: ["spring", "Monday", "circle", "yellow"], answer: 0 },
    { q: "Which word is a job?", type: "choice", options: ["teacher", "green", "run", "quick"], answer: 0 },
    { q: "Which word is a vehicle?", type: "choice", options: ["banana", "car", "shoe", "cup"], answer: 1 },
    { q: "Which word is a fruit?", type: "choice", options: ["carrot", "apple", "potato", "bread"], answer: 1 },
    { q: "Which question asks about age?", type: "choice", options: ["Where are you from?", "How old are you?", "What is your name?", "Do you like it?"], answer: 1 },
    { q: "What's the time expression for 'at this moment'?", type: "choice", options: ["yesterday", "today", "now", "tomorrow"], answer: 2 }, // "for now" jest nieco mylące

    // Sekcja: Tłumaczenie słówek / Podstawowe rzeczowniki
    { q: "How do you say 'pies' in English?", type: "choice", options: ["dog", "cat", "bird", "fish"], answer: 0 },
    { q: "How do you say 'dom' in English?", type: "choice", options: ["home", "house", "flat", "room"], answer: 1 }, // "house" jest najlepszym tłumaczeniem dla "dom"
    { q: "How do you say 'kawa' in English?", type: "choice", options: ["tea", "coffee", "juice", "water"], answer: 1 },

    // Sekcja: Przyimki miejsca
    { q: "Complete: The cat is ___ the table.", type: "choice", options: ["on", "in", "under", "next to"], answer: 0 }, // "next" samo w sobie jest niepoprawne, poprawione na "next to"
  { 
      q: "She ___ to school yesterday.", 
      answer: "went", 
      type: "fill",
      explanation: "Past Simple od 'go' to 'went'." 
    },
    { 
      q: "Translate into English: 'pies'", 
      answer: "dog", 
      type: "fill" 
    },
    { 
      q: "Translate into English: 'książka'", 
      answer: "book", 
      type: "fill" 
    },
      { q: "I ___ a student.", answer: "am", type: "fill" },
  { q: "She ___ my friend.", answer: "is", type: "fill" },
  { q: "They ___ from Poland.", answer: "are", type: "fill" },
  { q: "This is my ___ (książka).", answer: "book", type: "fill" },
  { q: "I have a ___ (pies).", answer: "dog", type: "fill" },
  { q: "He has a ___ (kot).", answer: "cat", type: "fill" },
  { q: "We ___ football every Saturday.", answer: "play", type: "fill" },
  { q: "She ___ coffee every morning.", answer: "drinks", type: "fill" },
  { q: "I ___ in Warsaw.", answer: "live", type: "fill" },
  { q: "He ___ English very well.", answer: "speaks", type: "fill" },
  { q: "Can you ___ me, please?", answer: "help", type: "fill" },
  { q: "I ___ TV in the evening.", answer: "watch", type: "fill" },
  { q: "She ___ to music every day.", answer: "listens", type: "fill" },
  { q: "We ___ to school by bus.", answer: "go", type: "fill" },
  { q: "He ___ football yesterday.", answer: "played", type: "fill" },
  { q: "I ___ a sandwich now.", answer: "am eating", type: "fill" },
  { q: "They ___ to the cinema last night.", answer: "went", type: "fill" },
  { q: "My father ___ a car.", answer: "has", type: "fill" },
  { q: "I ___ 12 years old.", answer: "am", type: "fill" },
  { q: "She ___ happy today.", answer: "is", type: "fill" },
  { q: "We ___ hungry.", answer: "are", type: "fill" },
  { q: "Close the ___, please. (drzwi)", answer: "door", type: "fill" },
  { q: "Open the ___, please. (okno)", answer: "window", type: "fill" },
  { q: "I like ___ (jabłka).", answer: "apples", type: "fill" },
  { q: "He doesn’t ___ tea.", answer: "like", type: "fill" },
  { q: "She ___ at 7 o’clock every day.", answer: "gets up", type: "fill" },
  { q: "I ___ breakfast at 8.", answer: "have", type: "fill" },
  { q: "It is ___ today. (słonecznie)", answer: "sunny", type: "fill" },
  { q: "It is very ___ today. (zimno)", answer: "cold", type: "fill" },
  { q: "How ___ you?", answer: "are", type: "fill" }
  ],

  "A2": [
    { q: "Past simple of 'go' is:", type: "choice", options: ["goed", "went", "gone", "going"], answer: 1 },
    { q: "Complete: She ___ to the cinema yesterday.", type: "choice", options: ["go", "goes", "went", "was going"], answer: 2 },
    { q: "Translate: 'często'", type: "choice", options: ["sometimes", "always", "never", "often"], answer: 3 },
    { q: "Choose: There ___ any milk in the fridge.", type: "choice", options: ["isn't", "aren't", "wasn't", "don't"], answer: 0 },
    { q: "Which sentence is correct?", type: "choice", options: ["He can to swim", "He cans swim", "He can swim", "He swim can"], answer: 2 },
    { q: "Future with 'going to': They ___ football tomorrow.", type: "choice", options: ["play", "are playing", "are going to play", "will play"], answer: 2 },
    { q: "What is 'najlepszy' in English?", type: "choice", options: ["better", "the best", "goodest", "bestest"], answer: 1 },
    { q: "Choose the opposite: 'expensive'", type: "choice", options: ["cheap", "rich", "poor", "free"], answer: 0 },
    { q: "Complete: If it ___ tomorrow, we will stay home.", type: "choice", options: ["rain", "rains", "will rain", "raining"], answer: 1 },
    { q: "Choose: She ___ for two hours now.", type: "choice", options: ["is studying", "studies", "was studying", "has been studying"], answer: 3 },
    { q: "Choose correct comparative: faster than, ______ than", type: "choice", options: ["more fast", "fastly than", "as fast than", "faster than"], answer: 3 },
    { q: "Complete: I ___ already eaten.", type: "choice", options: ["has", "have", "had", "having"], answer: 1 },
    { q: "Translate: 'wczoraj'", type: "choice", options: ["today", "tomorrow", "yesterday", "later"], answer: 2 },
    { q: "Choose correct: I ___ breakfast at 8 yesterday.", type: "choice", options: ["have", "had", "has", "haved"], answer: 1 },
    { q: "What is the past of 'see'?", type: "choice", options: ["saw", "seen", "seed", "see"], answer: 0 },
    { q: "Choose: He ___ not like coffee.", type: "choice", options: ["do", "does", "did", "done"], answer: 1 },
    { q: "Complete: I ___ to Paris last year.", type: "choice", options: ["go", "went", "gone", "going"], answer: 1 },
    { q: "Which is correct: 'I've been to London ___ 2010.'", type: "choice", options: ["for", "since", "from", "at"], answer: 1 },
    { q: "Choose the correct modal: You ___ study for the exam.", type: "choice", options: ["must", "might", "shouldn't", "can't"], answer: 0 },
    { q: "Translate: 'zwykle'", type: "choice", options: ["rarely", "usually", "never", "seldom"], answer: 1 },
    { q: "Complete: How long ___ you lived here?", type: "choice", options: ["have", "has", "had", "do"], answer: 0 },
    { q: "Choose: I prefer tea ___ coffee.", type: "choice", options: ["than", "to", "over", "with"], answer: 1 },
    { q: "Which is correct: 'I don't have ___ money.'", type: "choice", options: ["much", "many", "a lot", "some"], answer: 0 },
    { q: "Complete: She ___ to the gym every Monday.", type: "choice", options: ["go", "goes", "going", "went"], answer: 1 },
    { q: "Past participle of 'write' is:", type: "choice", options: ["writed", "wrote", "written", "write"], answer: 2 },
    { q: "Choose the correct question: ___ you ever been to Spain?", type: "choice", options: ["Did", "Have", "Has", "Do"], answer: 1 },
    { q: "Complete: They ___ studying English for three months.", type: "choice", options: ["are", "have been", "was", "had"], answer: 1 },
    { q: "Translate: 'prawie zawsze'", type: "choice", options: ["almost never", "almost always", "sometimes", "rarely"], answer: 1 },
    { q: "Choose: I'd like ___ water, please.", type: "choice", options: ["a", "some", "any", "the"], answer: 1 },
    { q: "Which is correct: 'I am used ___ coffee in the morning.'", type: "choice", options: ["to have", "have", "having", "to having"], answer: 0 },
    { q: "Complete: We ___ dinner when the phone rang.", type: "choice", options: ["have", "were having", "had", "are having"], answer: 1 },
    { q: "Choose: She said she ___ come tomorrow.", type: "choice", options: ["will", "would", "can", "shall"], answer: 1 },
    { q: "Translate: 'mieć zamiar'", type: "choice", options: ["intend", "intention", "intend to", "intended"], answer: 0 },
    { q: "Complete: Please ___ the window.", type: "choice", options: ["close", "closes", "closing", "closed"], answer: 0 },
    { q: "Which is correct: 'There are ___ apples on the table.'", type: "choice", options: ["much", "many", "a little", "less"], answer: 1 },
    { q: "Choose: ___ you mind if I open the window?", type: "choice", options: ["Do", "Will", "Would", "Are"], answer: 2 },
    { q: "Complete: She ___ already left when I arrived.", type: "choice", options: ["has", "have", "had", "was"], answer: 2 },
    { q: "Translate: 'teraz'", type: "choice", options: ["then", "now", "soon", "later"], answer: 1 },
    { q: "Choose correct: I ___ my homework yet.", type: "choice", options: ["didn't finish", "haven't finished", "don't finish", "not finished"], answer: 1 },
    { q: "Complete: He ___ to school by bike every day.", type: "choice", options: ["go", "goes", "went", "going"], answer: 1 },

    // Sekcja: Rodzina i ludzie
    { q: "Complete: My mother's daughter is my ___.", type: "choice", options: ["aunt", "sister", "grandmother", "cousin"], answer: 1 },
    { q: "What is the opposite of 'young'?", type: "choice", options: ["old", "new", "small", "tall"], answer: 0 },
    { q: "How do you say 'brat' in English?", type: "choice", options: ["brother", "son", "child", "boy"], answer: 0 },

    // Sekcja: Liczby i kolory
    { q: "Which number comes after twelve?", type: "choice", options: ["thirteen", "eleven", "twenty", "fifteen"], answer: 0 },
    { q: "What color is a banana?", type: "choice", options: ["red", "blue", "yellow", "black"], answer: 2 },
    { q: "What is 10 + 7?", type: "choice", options: ["seventeen", "seventy", "seven", "sixteen"], answer: 0 },

    // Sekcja: Dom i otoczenie
    { q: "You sit on a ___.", type: "choice", options: ["chair", "table", "bed", "fridge"], answer: 0 },
    { q: "You sleep in a ___.", type: "choice", options: ["bath", "kitchen", "bed", "garage"], answer: 2 },
    { q: "Complete: We cook food in the ___.", type: "choice", options: ["bathroom", "garden", "kitchen", "living room"], answer: 2 },
    { q: "You can see the stars in the ___.", type: "choice", options: ["sky", "sea", "tree", "car"], answer: 0 },

    // Sekcja: Jedzenie i picie
    { q: "You can eat ___ for breakfast.", type: "choice", options: ["eggs", "pizza", "soup", "pasta"], answer: 0 },
    { q: "Which is a drink?", type: "choice", options: ["orange", "apple", "water", "bread"], answer: 2 },
    { q: "Which word does NOT fit? Apple, banana, ___, car.", type: "choice", options: ["orange", "pear", "train", "mango"], answer: 2 }, // Pytanie sprawdzające kategorię

    // Sekcja: Czas i kalendarz
    { q: "How many days are there in a week?", type: "choice", options: ["five", "seven", "twelve", "thirty"], answer: 1 },
    { q: "Which month comes after April?", type: "choice", options: ["March", "June", "May", "July"], answer: 2 },
    { q: "What day is it after Friday?", type: "choice", options: ["Thursday", "Sunday", "Saturday", "Monday"], answer: 2 },

    // Sekcja: Czynności dnia codziennego (Present Simple)
    { q: "Complete: I ___ my teeth every morning.", type: "choice", options: ["brush", "brushes", "brushing", "brushed"], answer: 0 },
    { q: "Complete: She ___ to work at 8 o'clock.", type: "choice", options: ["go", "goes", "going", "went"], answer: 1 },
    { q: "Complete: They ___ TV in the evening.", type: "choice", options: ["watch", "watches", "watching", "watched"], answer: 0 },
    { q: "Choose the correct question:", type: "choice", options: ["Where you work?", "Where do you work?", "Where does you work?", "You work where?"], answer: 1 },

    // Sekcja: Przymiotniki i opisywanie
    { q: "The weather is very ___. Take a coat.", type: "choice", options: ["hot", "cold", "sunny", "big"], answer: 1 },
    { q: "A lemon is not sweet. It is ___.", type: "choice", options: ["sour", "spicy", "salty", "bitter"], answer: 0 },
    { q: "The opposite of 'expensive' is ___.", type: "choice", options: ["cheap", "beautiful", "new", "good"], answer: 0 },

    // Sekcja: Zwierzęta
    { q: "A ___ lives in the water and can swim.", type: "choice", options: ["dog", "cat", "fish", "bird"], answer: 2 },
    { q: "Which animal gives us milk?", type: "choice", options: ["pig", "chicken", "cow", "sheep"], answer: 2 },
    { q: "A ___ can fly and has feathers.", type: "choice", options: ["bat", "butterfly", "bird", "airplane"], answer: 2 },

    // Sekcja: Pogoda
    { q: "When it rains, you need an ___.", type: "choice", options: ["ice cream", "umbrella", "book", "apple"], answer: 1 },
    { q: "What do you see in the sky on a sunny day?", type: "choice", options: ["the moon", "the sun", "stars", "clouds"], answer: 1 },

    // Sekcja: Hobby i czas wolny
    { q: "I ___ books in my free time.", type: "choice", options: ["read", "reads", "reading", "red"], answer: 0 },
    { q: "People play football in a ___.", type: "choice", options: ["pool", "court", "field", "track"], answer: 2 },
    { q: "You can listen to ___.", type: "choice", options: ["music", "book", "food", "photo"], answer: 0 },

    // Sekcja: Podstawowe czasowniki i zwroty
    { q: "Complete: Can you ___ me your pen, please?", type: "choice", options: ["give", "take", "have", "make"], answer: 0 },
    { q: "Complete: I ___ to music on the bus.", type: "choice", options: ["hear", "listen", "see", "look"], answer: 1 },
    { q: "What do you say when you meet someone for the first time?", type: "choice", options: ["Goodbye!", "Nice to meet you.", "Thank you.", "See you later."], answer: 1 },

    // Sekcja: Przyimki miejsca (rozwinięcie)
    { q: "The book is ___ the bag.", type: "choice", options: ["on", "under", "in", "next to"], answer: 2 },
    { q: "The picture is ___ the wall.", type: "choice", options: ["on", "in", "at", "under"], answer: 0 },

    // Sekcja: Krajobraz i przyroda
    { q: "You can climb a ___.", type: "choice", options: ["river", "mountain", "lake", "sea"], answer: 1 },
    { q: "Which is NOT a part of nature?", type: "choice", options: ["tree", "flower", "computer", "river"], answer: 2 },

    // Sekcja: Pytania i odpowiedzi (matching)
    { q: "Answer: 'How are you?'", type: "choice", options: ["I'm 25.", "I'm a student.", "I'm fine, thanks.", "I'm from London."], answer: 2 },
    { q: "Answer: 'What time is it?'", type: "choice", options: ["It's Monday.", "It's 9 o'clock.", "It's sunny.", "It's on the table."], answer: 1 },
        { q: "Yesterday I ___ to the park.", answer: "went", type: "fill" },
    { q: "She ___ dinner last night.", answer: "cooked", type: "fill" },
    { q: "They ___ football yesterday.", answer: "played", type: "fill" },
    { q: "I ___ a new phone last week.", answer: "bought", type: "fill" },
    { q: "He ___ TV yesterday evening.", answer: "watched", type: "fill" },
    { q: "We ___ late to school.", answer: "were", type: "fill" },
    { q: "She ___ very happy.", answer: "was", type: "fill" },
    { q: "They ___ in Spain last summer.", answer: "were", type: "fill" },
    { q: "I ___ a cake for my birthday.", answer: "made", type: "fill" },
    { q: "He ___ me a nice present.", answer: "gave", type: "fill" },
    { q: "We ___ by car to the mountains.", answer: "went", type: "fill" },
    { q: "I ___ a letter yesterday.", answer: "wrote", type: "fill" },
    { q: "She ___ to music all evening.", answer: "listened", type: "fill" },
    { q: "They ___ their grandparents on Sunday.", answer: "visited", type: "fill" },
    { q: "He ___ his homework after school.", answer: "did", type: "fill" },
    { q: "I ___ at home all day.", answer: "was", type: "fill" },
    { q: "She ___ a lot of water yesterday.", answer: "drank", type: "fill" },
    { q: "We ___ the film last night.", answer: "saw", type: "fill" },
    { q: "They ___ me at the station.", answer: "met", type: "fill" },
    { q: "I ___ in bed all morning.", answer: "stayed", type: "fill" },
  
  ],

  "B1": [
    { q: "I have lived here ___ 2010.", type: "choice", options: ["since", "for", "from", "by"], answer: 0 },
    { q: "Reported speech: 'I am tired' → He said he ___ tired.", type: "choice", options: ["is", "was", "were", "has been"], answer: 1 },
    { q: "If I ___ more time, I would travel more.", type: "choice", options: ["have", "had", "would have", "had had"], answer: 1 },
    { q: "Passive voice: 'My mother made the cake' → The cake ___ by my mother.", type: "choice", options: ["was made", "made", "is made", "makes"], answer: 0 },
    { q: "He suggested ___ to the cinema.", type: "choice", options: ["going", "to go", "that go", "go"], answer: 0 },
    { q: "I'm ___ getting up early. (przyzwyczajony do)", type: "choice", options: ["used to", "get used to", "am used to", "use to"], answer: 2 },
    { q: "She ___ dinner when I arrived.", type: "choice", options: ["cooked", "was cooking", "had cooked", "cooks"], answer: 1 },
    { q: "Choose the best synonym for 'furious':", type: "choice", options: ["angry", "happy", "calm", "pleased"], answer: 0 },
    { q: "Neither of the students ___ prepared for the test.", type: "choice", options: ["was", "were", "have been", "are"], answer: 0 },
    { q: "___ it was raining, we decided to go for a walk.", type: "choice", options: ["Although", "Because", "Therefore", "However"], answer: 0 },
    { q: "I wish I ___ play a musical instrument.", type: "choice", options: ["can", "could", "will", "would"], answer: 1 },
    { q: "By the time she arrived, we ___ already left.", type: "choice", options: ["have", "had", "has", "will have"], answer: 1 },
    { q: "He's interested ___ learning Chinese.", type: "choice", options: ["in", "on", "at", "for"], answer: 0 },
    { q: "Phrasal verb: 'find out' means:", type: "choice", options: ["discover", "invent", "search", "lose"], answer: 0 },
    { q: "I recommend that he ___ a doctor.", type: "choice", options: ["sees", "see", "saw", "seeing"], answer: 1 },
    { q: "The game was canceled ___ the bad weather. (w związku z)", type: "choice", options: ["because of", "despite", "although", "however"], answer: 0 },
    { q: "I'd rather you ___ me the truth.", type: "choice", options: ["tell", "told", "would tell", "telling"], answer: 1 },
    { q: "He insisted ___ paying for dinner.", type: "choice", options: ["on", "in", "at", "for"], answer: 0 },
    { q: "She has been working here ___ five years.", type: "choice", options: ["since", "for", "during", "from"], answer: 1 },
    { q: "We need to ___ a decision soon.", type: "choice", options: ["make", "do", "take", "have"], answer: 0 },
    { q: "He made a ___ error in the report.", type: "choice", options: ["serious", "seriously", "seriousness", "series"], answer: 0 },
    { q: "I didn't know what ___ in that situation.", type: "choice", options: ["to do", "do", "doing", "done"], answer: 0 },
    { q: "'I had already eaten when she arrived' uses the:", type: "choice", options: ["past perfect", "present perfect", "past continuous", "past simple"], answer: 0 },
    { q: "'Where do you live?' → He asked me ___.", type: "choice", options: ["where I lived", "where did I live", "where do I live", "where I live"], answer: 0 },
    { q: "She's one of those people ___ always happy.", type: "choice", options: ["who are", "which is", "who is", "that is"], answer: 0 },
    { q: "He acts ___ he owns the place.", type: "choice", options: ["as if", "like", "as", "such as"], answer: 0 },
    { q: "It was raining heavily. ___, we decided to cancel the picnic.", type: "choice", options: ["Therefore", "Although", "Despite", "However"], answer: 0 },
    { q: "I'm looking forward ___ you at the party.", type: "choice", options: ["to seeing", "to see", "seeing", "see"], answer: 0 },
    { q: "If I ___ about the problem, I would have helped.", type: "choice", options: ["had known", "would know", "knew", "know"], answer: 0 },
    { q: "She made me ___ my homework again.", type: "choice", options: ["do", "to do", "doing", "done"], answer: 0 },
    { q: "Choose the best synonym for 'minute' (adjective):", type: "choice", options: ["huge", "tiny", "important", "significant"], answer: 1 },
    { q: "She speaks English ___ than her brother.", type: "choice", options: ["more fluently", "fluentlier", "most fluently", "fluently"], answer: 0 },
    { q: "You can always rely ___ Michael in a crisis.", type: "choice", options: ["on", "in", "at", "for"], answer: 0 },
    { q: "___ I don't agree with him, I respect his opinion. (chociaż)", type: "choice", options: ["Although", "Because", "Therefore", "However"], answer: 0 },
    { q: "By this time next year, I ___ my master's degree.", type: "choice", options: ["will complete", "will have completed", "complete", "am completing"], answer: 1 },
    { q: "I ___ like classical music, but now I love it.", type: "choice", options: ["didn't use to", "used not", "didn't used to", "use not to"], answer: 0 },
    { q: "This is the first time I ___ this famous painting in person.", type: "choice", options: ["see", "am seeing", "have seen", "had seen"], answer: 2 },
    { q: "She demanded that he ___ immediately.", type: "choice", options: ["leaves", "leave", "left", "leaving"], answer: 1 },
    { q: "It's high time we ___ working on this project.", type: "choice", options: ["start", "started", "have started", "starting"], answer: 1 },
    { q: "I prefer tea ___ coffee.", type: "choice", options: ["to", "than", "over", "rather"], answer: 0 },


    // Grammar: Mixed Tenses
    { q: "By the time you arrive, I ___ for over two hours.", type: "choice", options: ["will be waiting", "will have been waiting", "have been waiting", "wait"], answer: 1 },
    { q: "If it ___ tomorrow, we'll cancel the picnic.", type: "choice", options: ["rains", "will rain", "rained", "would rain"], answer: 0 },
    { q: "I ___ to the gym three times this week.", type: "choice", options: ["have been", "went", "have gone", "go"], answer: 2 },
    { q: "She told me she ___ that movie the previous night.", type: "choice", options: ["saw", "had seen", "has seen", "sees"], answer: 1 },

    // Grammar: Conditionals & Wishes
    { q: "I wouldn't have missed the bus if I ___ earlier.", type: "choice", options: ["left", "had left", "would leave", "leave"], answer: 1 },
    { q: "If only I ___ richer!", type: "choice", options: ["am", "was", "were", "would be"], answer: 2 },
    { q: "Supposing it ___ sunny, what would we do then?", type: "choice", options: ["isn't", "wasn't", "weren't", "hadn't been"], answer: 2 },

    // Grammar: Modals & Semi-modals
    { q: "You ___ have told me you were coming! I would have baked a cake.", type: "choice", options: ["must", "should", "ought", "could"], answer: 1 },
    { q: "She ___ be at home. Her car is in the driveway.", type: "choice", options: ["must", "can't", "might", "should"], answer: 0 },
    { q: "We'd better ___ soon, or we'll be late.", type: "choice", options: ["leave", "to leave", "leaving", "left"], answer: 0 },
    { q: "You ___ to have a visa to travel to some countries.", type: "choice", options: ["must", "should", "need", "ought"], answer: 2 },

    // Grammar: Passive Voice & Causative
    { q: "The new bridge ___ next year.", type: "choice", options: ["will be built", "will build", "is building", "builds"], answer: 0 },
    { q: "I need to ___ before the interview.", type: "choice", options: ["have my suit cleaned", "have cleaned my suit", "clean my suit", "my suit clean"], answer: 0 },
    { q: "The story ___ by many people.", type: "choice", options: ["has been believed", "has believed", "believed", "is believe"], answer: 0 },

    // Grammar: Prepositions & Phrasal Verbs
    { q: "I completely agree ___ you on this matter.", type: "choice", options: ["with", "to", "on", "for"], answer: 0 },
    { q: "The company is looking ___ new ways to reduce costs.", type: "choice", options: ["into", "for", "at", "after"], answer: 1 },
    { q: "Could you turn ___ the volume? I can't hear it.", type: "choice", options: ["up", "on", "down", "off"], answer: 0 },
    { q: "He came ___ a very old photograph while cleaning the attic.", type: "choice", options: ["across", "into", "up with", "over"], answer: 0 },
    { q: "She takes ___ her mother; they have the same smile.", type: "choice", options: ["after", "over", "on", "up"], answer: 0 },

    // Vocabulary: Synonyms & Antonyms
    { q: "Choose the best synonym for 'exhausted':", type: "choice", options: ["tired", "energetic", "bored", "excited"], answer: 0 },
    { q: "Choose the best antonym for 'ancient':", type: "choice", options: ["old", "modern", "historic", "aged"], answer: 1 },
    { q: "Choose the word closest in meaning to 'relieved':", type: "choice", options: ["worried", "annoyed", "thankful", "disappointed"], answer: 2 },
    { q: "Which word does NOT mean 'intelligent'?", type: "choice", options: ["clever", "bright", "stupid", "smart"], answer: 2 },

    // Vocabulary: Collocations & Word Patterns
    { q: "It's pouring with rain. You'll get ___ if you go out without an umbrella.", type: "choice", options: ["wet", "soaked", "damp", "dry"], answer: 1 },
    { q: "Let's ___ a toast to the happy couple!", type: "choice", options: ["make", "do", "have", "propose"], answer: 2 },
    { q: "He ___ a great effort to finish on time.", type: "choice", options: ["did", "made", "had", "took"], answer: 1 },
    { q: "I need to ___ attention to the details.", type: "choice", options: ["make", "have", "pay", "put"], answer: 2 },

    // Vocabulary: Confusing Words
    { q: "The ___ of the mountain was breathtaking.", type: "choice", options: ["sight", "view", "scene", "landscape"], answer: 1 },
    { q: "Could you ___ me a favour?", type: "choice", options: ["make", "do", "give", "have"], answer: 1 },
    { q: "I'm very ___ in history. (interested/interesting)", type: "choice", options: ["interested", "interesting", "interest", "interests"], answer: 0 },
    { q: "That was a very ___ documentary. (interested/interesting)", type: "choice", options: ["interested", "interesting", "interest", "interests"], answer: 1 },

    // Functional Language & Discourse Markers
    { q: "A: 'I failed my driving test.' B: '___! You can always try again.'", type: "choice", options: ["Never mind", "I don't care", "It's your fault", "That's amazing"], answer: 0 },
    { q: "___ the high cost, the product is very popular.", type: "choice", options: ["Despite", "Because", "Therefore", "Although"], answer: 0 },
    { q: "The service was poor. ___, the food was excellent.", type: "choice", options: ["However", "Because", "Therefore", "Despite"], answer: 0 },
    { q: "A: 'Shall we go to the cinema?' B: '___ I'd rather stay in.'", type: "choice", options: ["Actually", "Definitely", "Exactly", "Fortunately"], answer: 0 },

    // Translation & Polish Interference
    { q: "Translate: 'Niezależnie od' (meaning 'regardless of')", type: "choice", options: ["Depending on", "According to", "Regardless of", "In spite of"], answer: 2 },
    { q: "Translate: 'W porównaniu do'", type: "choice", options: ["Compared to", "In comparison with", "Contrary to", "As well as"], answer: 0 }, // Both 0 and 1 are correct, but 0 is more common
    { q: "Translate the sense: 'Zrobić sobie przerwę'", type: "choice", options: ["To make a break", "To take a break", "To have a break", "To do a break"], answer: 2 },
    { q: "Which expression is correct for 'popełnić błąd'?", type: "choice", options: ["make a mistake", "do a mistake", "commit a mistake", "take a mistake"], answer: 0 },

    // Word Formation
    { q: "What is the noun from the verb 'decide'?", type: "choice", options: ["deciding", "decision", "decisive", "decidedly"], answer: 1 },
    { q: "What is the adjective from the noun 'success'?", type: "choice", options: ["succeed", "successful", "successive", "successfully"], answer: 1 },
    { q: "Choose the correct prefix: '___possible'", type: "choice", options: ["im", "un", "in", "ir"], answer: 0 }, // More than one can be correct, but 'im' is most common for 'possible'
      { q: "If it ___ tomorrow, we will stay home.", answer: "rains", type: "fill" },
    { q: "She has been ___ for two hours.", answer: "studying", type: "fill" },
    { q: "They ___ football since 2010.", answer: "have played", type: "fill" },
    { q: "I ___ my keys, I can’t find them.", answer: "have lost", type: "fill" },
    { q: "He ___ already finished his homework.", answer: "has", type: "fill" },
    { q: "We ___ to London last year.", answer: "went", type: "fill" },
    { q: "She ___ lunch when I called.", answer: "was eating", type: "fill" },
    { q: "They ___ TV when the lights went out.", answer: "were watching", type: "fill" },
    { q: "I ___ never seen that movie.", answer: "have", type: "fill" },
    { q: "If I ___ enough money, I would travel.", answer: "had", type: "fill" },
    { q: "He ___ very tired after work.", answer: "was", type: "fill" },
    { q: "She ___ English for five years.", answer: "has studied", type: "fill" },
    { q: "We ___ dinner at 7 yesterday.", answer: "had", type: "fill" },
    { q: "They ___ to the cinema on Friday.", answer: "went", type: "fill" },
    { q: "I ___ been to Italy twice.", answer: "have", type: "fill" },
    { q: "She ___ in Paris when she was young.", answer: "lived", type: "fill" },
    { q: "If I ___ you, I would be careful.", answer: "were", type: "fill" },
    { q: "He ___ not like spicy food.", answer: "does", type: "fill" },
    { q: "They ___ just finished their project.", answer: "have", type: "fill" },
    { q: "I ___ studying when you called.", answer: "was", type: "fill" },
  ],

  "B2": [
    { q: "If she ___ harder, she would have passed the exam.", type: "choice", options: ["had studied", "studied", "would study", "was studying"], answer: 0 },
    { q: "Which is the correct phrase?", type: "choice", options: ["Despite the rain", "Despite of the rain", "In spite the rain", "Although of the rain"], answer: 0 },
    { q: "Hardly ___ I arrived when the phone rang.", type: "choice", options: ["had", "did", "have", "was"], answer: 0 },
    { q: "What does the phrasal verb 'to make up for' mean?", type: "choice", options: ["to compensate for something", "to invent a story", "to apply cosmetics", "to reconcile after an argument"], answer: 0 }, // Rozszerzona definicja
    { q: "Reported speech: 'I can swim very well.' → She said she ___ swim very well.", type: "choice", options: ["could", "can", "was able to", "should"], answer: 0 },
    { q: "Choose the best synonym for 'essential':", type: "choice", options: ["crucial", "optional", "minor", "unimportant"], answer: 0 }, // Lepszy synonim
    { q: "What is the direct opposite of 'rarely'?", type: "choice", options: ["frequently", "seldom", "hardly ever", "occasionally"], answer: 0 }, // "often" -> "frequently" dla precyzji
    { q: "Which sentence is grammatically correct?", type: "choice", options: ["She denied stealing the money.", "She denied to steal the money.", "She denied having stole the money.", "She denied steal the money."], answer: 0 }, // Pełniejsze zdanie
    { q: "By the time we arrived at the cinema, the film ___ already started.", type: "choice", options: ["had", "has", "was", "have"], answer: 0 },
    { q: "What does the phrase 'on behalf of' mean?", type: "choice", options: ["as a representative of", "because of", "in case of", "apart from"], answer: 0 }, // Lepsza definicja
    { q: "He suggested that she ___ the meeting earlier.", type: "choice", options: ["leave", "left", "leaves", "would leave"], answer: 0 },
    { q: "___ it not for your help, I would have failed.", type: "choice", options: ["Were", "Had", "If", "Was"], answer: 0 }, // Poprawiona konstrukcja
    { q: "She wished she ___ the truth before making that decision.", type: "choice", options: ["had known", "knew", "would know", "has known"], answer: 0 },
    { q: "What does 'to take something for granted' mean?", type: "choice", options: ["to fail to appreciate something because it's always available", "to appreciate something deeply", "to request something formally", "to receive a gift"], answer: 0 }, // Bardziej szczegółowo
    { q: "The manager demanded that the report ___ by noon.", type: "choice", options: ["be submitted", "is submitted", "submits", "will be submitted"], answer: 0 },
    { q: "No sooner ___ I closed the door than I realized I'd forgotten my keys.", type: "choice", options: ["had", "did", "have", "was"], answer: 0 }, // Lepszy przykład
    { q: "Which word best describes 'a formal, systematic search or examination'?", type: "choice", options: ["investigation", "inquiry", "probe", "exploration"], answer: 0 }, // Lepsze dopasowanie
    { q: "She is perfectly capable ___ handling the project herself.", type: "choice", options: ["of", "to", "for", "with"], answer: 0 },
    { q: "I ___ rather you didn't mention this to anyone else.", type: "choice", options: ["would", "will", "had", "should"], answer: 0 },
    { q: "What does 'to come up with' mean in this context: 'We need to come up with a solution.'?", type: "choice", options: ["to devise or invent", "to postpone", "to cancel", "to approve of"], answer: 0 }, // Kontekst
    { q: "If he ___ the earlier train, he would have arrived on time.", type: "choice", options: ["had caught", "caught", "would catch", "has caught"], answer: 0 },
    { q: "He gave orders as if he ___ in charge, but he wasn't.", type: "choice", options: ["were", "was", "had been", "is"], answer: 0 }, // Lepszy kontekst dla 'as if'
    { q: "Translate: 'Pomimo wszystkich trudności, udało nam się.'", type: "choice", options: ["Despite all the difficulties, we succeeded.", "Because of all the difficulties, we succeeded.", "Therefore all the difficulties, we succeeded.", "However all the difficulties, we succeeded."], answer: 0 }, // Tłumaczenie zdania, a nie słowa
    { q: "She insisted that he ___ allowed to speak.", type: "choice", options: ["be", "is", "was", "would be"], answer: 0 },
    { q: "He was accused ___ sensitive company data to a competitor.", type: "choice", options: ["of selling", "to sell", "for selling", "with selling"], answer: 0 },
    { q: "The project requires a ___ investment of both time and money.", type: "choice", options: ["substantial", "minimal", "negligible", "insignificant"], answer: 0 }, // Lepszy kontekst
    { q: "Looking back, I would rather you ___ me the whole truth from the beginning.", type: "choice", options: ["had told", "told", "tell", "would tell"], answer: 0 },
    { q: "Which preposition is correct? 'The team prefers working ___ a collaborative environment.'", type: "choice", options: ["in", "at", "on", "to"], answer: 0 }, // Lepszy kontekst dla 'in'
    { q: "The new safety regulations are extremely ___.", type: "choice", options: ["stringent", "lenient", "vague", "flexible"], answer: 0 }, // Kontekst
    { q: "After consulting everyone, she made a ___ and well-considered decision.", type: "choice", options: ["reasonable", "rash", "hasty", "impulsive"], answer: 0 }, // Kontekst pasujący do dystraktorów
    { q: "She might have ___ the crucial email because her inbox was so full.", type: "choice", options: ["missed", "miss", "missing", "misses"], answer: 0 },
    { q: "I'm increasingly concerned ___ the lack of progress.", type: "choice", options: ["about", "with", "for", "to"], answer: 0 },
    { q: "The region is known ___ its excellent wines and cuisine.", type: "choice", options: ["for", "to", "with", "about"], answer: 0 },
    { q: "___ I known about the traffic, I would have taken a different route.", type: "choice", options: ["Had", "Would", "If", "Should"], answer: 0 },
    { q: "University policy requires all students ___ complete this module.", type: "choice", options: ["to", "for", "in", "on"], answer: 0 },
    { q: "His instructions were deliberately ___ to give himself room for manoeuvre.", type: "choice", options: ["ambiguous", "clear", "unambiguous", "explicit"], answer: 0 },
    { q: "She ___ her driving test if she hadn't been so nervous.", type: "choice", options: ["would have passed", "would pass", "passed", "had passed"], answer: 0 },
    { q: "What does 'to set up' mean here: 'They decided to set up their own business.'?", type: "choice", options: ["to establish", "to close down", "to invest in", "to avoid"], answer: 0 },
    { q: "There's no point ___ complaining if you're not willing to suggest a solution.", type: "choice", options: ["in", "on", "at", "for"], answer: 0 },
    { q: "She ___ to call you yesterday, but her phone battery died.", type: "choice", options: ["had intended", "intended", "was going", "meant"], answer: 0 }, // Wszystkie poprawne, ale 'had intended' jest najsilniejsze dla B2
// ... (tutaj wstawiamy poprawione pytania) ...

    // ========== ROZSZERZENIE: 40 NOWYCH PYTAŃ B2 ==========

    // Grammar: Inversion & Emphasis (Cleft Sentences)
    { q: "___ should the freedom of the press be compromised.", type: "choice", options: ["Under no circumstances", "In any circumstances", "Only by", "For no reason"], answer: 0 },
    { q: "Not only ___ late, but he also forgot the documents.", type: "choice", options: ["did he arrive", "he arrived", "arrived he", "he did arrive"], answer: 0 },
    { q: "___ that I realized my mistake.", type: "choice", options: ["Only later", "Later only", "It was only later", "Only it was later"], answer: 2 }, // Cleft sentence
    { q: "So terrifying ___ that nobody dared to move.", type: "choice", options: ["was the experience", "the experience was", "had the experience been", "the experience had been"], answer: 0 },

    // Grammar: Advanced Tenses & Aspects
    { q: "This time next week, I ___ on a beach in Crete.", type: "choice", options: ["will be lying", "will lie", "will have lain", "am lying"], answer: 0 },
    { q: "She's annoyed because she ___ for over an hour and he still hasn't arrived.", type: "choice", options: ["has been waiting", "has waited", "waits", "is waiting"], answer: 0 }, // Emphasis on duration
    { q: "It was the worst meal I ___ in my entire life.", type: "choice", options: ["have ever had", "had ever had", "ever had", "was having"], answer: 1 },
    { q: "He ___ out every night this week. He must be exhausted.", type: "choice", options: ["has been", "was", "has been being", "is"], answer: 0 }, // State verb in continuous?

    // Grammar: Mixed Conditionals & Alternatives to 'if'
    { q: "If you ___ to the advice, you wouldn't be in this mess now.", type: "choice", options: ["had listened", "listened", "would listen", "listen"], answer: 0 }, // Mixed conditional
    { q: "___ you change your mind, here's my number.", type: "choice", options: ["Should", "Would", "Provided", "Unless"], answer: 0 }, // Inversion for condition
    { q: "I'll help you ___ you promise to be careful.", type: "choice", options: ["provided that", "unless", "whether", "so that"], answer: 0 },
    { q: "___ I known, I would have acted differently.", type: "choice", options: ["Had", "Would", "Should", "If"], answer: 0 },

    // Grammar: Participle Clauses & Complex Structures
    { q: "___ by the news, she couldn't speak for a moment.", type: "choice", options: ["Shocked", "Shocking", "Having shocked", "Being shocked"], answer: 0 },
    { q: "___ the report, she handed it to her manager.", type: "choice", options: ["Having finished", "Finishing", "Finished", "Being finished"], answer: 0 },
    { q: "The person ___ the question was a journalist from the Times.", type: "choice", options: ["asking", "asked", "having asked", "to ask"], answer: 0 }, // Reduced relative clause
    { q: "His ambition is ___ his own company by the age of 30.", type: "choice", options: ["to have set up", "to set up", "setting up", "having set up"], answer: 0 }, // Perfect infinitive

    // Vocabulary: Idioms & Fixed Phrases
    { q: "After the scandal, his reputation was ___.", type: "choice", options: ["in tatters", "on the mend", "in the black", "over the moon"], answer: 0 },
    { q: "Let's ___ and discuss this calmly.", type: "choice", options: ["take a step back", "push the envelope", "beat around the bush", "hit the nail on the head"], answer: 0 },
    { q: "She's always ___. She can't keep a secret.", type: "choice", options: ["letting the cat out of the bag", "biting her tongue", "playing her cards close to her chest", "feeling under the weather"], answer: 0 },
    { q: "The negotiations have reached ___.", type: "choice", options: ["a deadlock", "a breakthrough", "a consensus", "an agreement"], answer: 0 },

    // Vocabulary: Collocations (Advanced)
    { q: "The government is facing ___ criticism over its handling of the crisis.", type: "choice", options: ["mounting", "growing", "rising", "raising"], answer: 0 }, // Mounting pressure/criticism
    { q: "They conducted a ___ analysis of the market trends.", type: "choice", options: ["thorough", "strong", "large", "wide"], answer: 0 },
    { q: "He ___ a profound influence on my career.", type: "choice", options: ["exerted", "did", "made", "gave"], answer: 0 },
    { q: "The company is trying to ___ a balance between innovation and stability.", type: "choice", options: ["strike", "do", "make", "take"], answer: 0 },

    // Vocabulary: Synonyms (Nuanced)
    { q: "Choose the best synonym for 'arduous':", type: "choice", options: ["difficult and tiring", "simple and easy", "quick and efficient", "long and boring"], answer: 0 },
    { q: "Which word is closest in meaning to 'vindicated'?", type: "choice", options: ["proven right", "proven wrong", "accused", "forgiven"], answer: 0 },
    { q: "Choose the word that is NOT a synonym for 'prudent':", type: "choice", options: ["cautious", "judicious", "reckless", "wise"], answer: 2 },
    { q: "Her response was surprisingly ___ for someone in her position.", type: "choice", options: ["terse", "verbose", "eloquent", "detailed"], answer: 0 },

    // Vocabulary: Phrasal Verbs (Multiple Meanings/Advanced)
    { q: "Can you ___ (tolerate) his constant complaining?", type: "choice", options: ["put up with", "get on with", "do away with", "come up with"], answer: 0 },
    { q: "The meeting has been ___ until next week.", type: "choice", options: ["put off", "called off", "set off", "taken off"], answer: 0 },
    { q: "We need to ___ (reduce) on unnecessary expenses.", type: "choice", options: ["cut down", "cut off", "cut in", "cut out"], answer: 0 },
    { q: "She ___ her grandmother; they have the same eyes.", type: "choice", options: ["takes after", "takes over", "takes in", "takes up"], answer: 0 },

    // Prepositions & Dependent Prepositions
    { q: "He's always been preoccupied ___ his own problems.", type: "choice", options: ["with", "by", "for", "about"], answer: 0 },
    { q: "Is this line consistent ___ the company's overall strategy?", type: "choice", options: ["with", "to", "for", "on"], answer: 0 },
    { q: "There's been a sharp increase ___ the cost of raw materials.", type: "choice", options: ["in", "of", "by", "for"], answer: 0 },
    { q: "She has a natural aptitude ___ languages.", type: "choice", options: ["for", "in", "with", "to"], answer: 0 },

    // Discourse Markers & Linkers (Advanced)
    { q: "The plan is good. ___, there are significant risks involved.", type: "choice", options: ["Nevertheless", "Therefore", "Moreover", "Consequently"], answer: 0 },
    { q: "___ the overwhelming evidence, the jury acquitted him.", type: "choice", options: ["Despite", "Because of", "Owing to", "Therefore"], answer: 0 },
    { q: "___ advancing years, he remains very active.", type: "choice", options: ["Notwithstanding", "However", "Because of", "As a result of"], answer: 0 }, // Formal linker
    { q: "The project was completed on time and ___.", type: "choice", options: ["within budget", "for budget", "by budget", "on budget"], answer: 0 }, // Fixed phrase

    // Register & Formal/Informal Language
    { q: "Which phrase is most formal? 'We would appreciate it if you could ___'.", type: "choice", options: ["expedite the process", "hurry it up", "get a move on", "speed things along"], answer: 0 },
    { q: "Which word is too informal for a business report? The results were pretty ___.", type: "choice", options: ["good", "disappointing", "satisfactory", "encouraging"], answer: 0 }, // "pretty good"
    { q: "Choose the more formal equivalent of 'get in touch with':", type: "choice", options: ["contact", "ring", "hit up", "drop a line to"], answer: 0 },

    // Word Formation (Advanced)
    { q: "What is the noun from 'reluctant'?", type: "choice", options: ["reluctance", "reluctancy", "reluctation", "reluctivity"], answer: 0 },
    { q: "What is the adjective from 'envy'?", type: "choice", options: ["envious", "enviful", "enviable", "envyous"], answer: 0 },
    { q: "Which prefix creates the opposite of 'ethical'?", type: "choice", options: ["un-", "dis-", "im-", "in-"], answer: 0 },
     // Unethical
        { q: "If he had studied, he ___ have passed the exam.", answer: "would", type: "fill" },
    { q: "She wishes she ___ taller.", answer: "were", type: "fill" },
    { q: "I would rather you ___ later.", answer: "came", type: "fill" },
    { q: "It’s high time we ___ home.", answer: "went", type: "fill" },
    { q: "He talks as if he ___ everything.", answer: "knew", type: "fill" },
    { q: "If only I ___ more time.", answer: "had", type: "fill" },
    { q: "She suggested that he ___ earlier.", answer: "should arrive", type: "fill" },
    { q: "He denied ___ the money.", answer: "taking", type: "fill" },
    { q: "I regret ___ not studied harder.", answer: "having", type: "fill" },
    { q: "She’s used to ___ up early.", answer: "getting", type: "fill" },
    { q: "If I ___ known, I would have helped.", answer: "had", type: "fill" },
    { q: "It’s worth ___ to that museum.", answer: "going", type: "fill" },
    { q: "They prevented him from ___ late.", answer: "coming", type: "fill" },
    { q: "I can’t stand ___ in queues.", answer: "waiting", type: "fill" },
    { q: "She admitted ___ a mistake.", answer: "making", type: "fill" },
    { q: "If you happen to ___ him, tell me.", answer: "see", type: "fill" },
    { q: "He’s looking forward to ___ you.", answer: "meeting", type: "fill" },
    { q: "I prefer coffee ___ tea.", answer: "to", type: "fill" },
    { q: "No sooner ___ she entered than it started raining.", answer: "had", type: "fill" },
    { q: "He insisted on ___ the bill.", answer: "paying", type: "fill" },

],
"C1": [
    { q: "Scarcely ___ he entered the room when the lights went out.", type: "choice", options: ["had", "did", "has", "was"], answer: 0 },
    { q: "Which word best describes someone who is extremely careful, precise, and pays attention to every detail?", type: "choice", options: ["meticulous", "perfunctory", "hasty", "negligent"], answer: 0 }, // Lepsze dystraktory
    { q: "Choose the best synonym for 'ubiquitous':", type: "choice", options: ["pervasive", "scarce", "unique", "localized"], answer: 0 }, // Lepszy synonim
    { q: "He insisted ___ his innocence throughout the trial.", type: "choice", options: ["on", "upon", "-", "for"], answer: 0 }, // 'on' jest najczęstsze, 'upon' bardziej formalne. Usunięto oczywiście błędne opcje.
    { q: "I'd rather you ___ mention this to anyone else; it's confidential.", type: "choice", options: ["didn't", "don't", "wouldn't", "won't"], answer: 0 },
    { q: "The plan was successful, ___ somewhat more expensive than initially projected.", type: "choice", options: ["albeit", "therefore", "because", "however"], answer: 0 }, // Zdanie kontekstowe
    { q: "If only I ___ his advice then, I wouldn't be in this situation now.", type: "choice", options: ["had taken", "took", "would take", "have taken"], answer: 0 }, // Mieszany tryb warunkowy
    { q: "The apparent contradiction at the heart of the theory presents a real ___.", type: "choice", options: ["conundrum", "celebration", "clarification", "certainty"], answer: 0 }, // Kontekst
    { q: "Her argument was ___ compelling that it swayed even the most skeptical critics.", type: "choice", options: ["so", "such", "too", "quite"], answer: 0 }, // 'such' wymagałoby rzeczownika (e.g., such a compelling argument)
    { q: "The ___ administrative duties left little time for actual research.", type: "choice", options: ["onerous", "trivial", "straightforward", "manageable"], answer: 0 },
    { q: "Which is a common collocation for the verb 'to render'?", type: "choice", options: ["to render a service", "to render a book", "to render a run", "to render a decision"], answer: 0 }, // 'render a decision' jest też poprawne, ale 'a service' jest częstsze. Pytanie wymaga przemyślenia.
    { q: "Recent archaeological finds have ___ the long-held theory about the city's origins.", type: "choice", options: ["undermined", "supported", "ignored", "constructed"], answer: 0 }, // Ciekawsze, mniej oczywiste
    { q: "The disclosure of confidential information was entirely ___.", type: "choice", options: ["inadvertent", "deliberate", "malicious", "calculated"], answer: 0 },
    { q: "She has a particular penchant ___ Baroque architecture.", type: "choice", options: ["for", "of", "towards", "in"], answer: 0 },
    { q: "___ her quick thinking, the situation would have escalated dramatically.", type: "choice", options: ["Were it not for", "If it wasn't for", "Unless for", "Without for"], answer: 0 }, // Najbardziej formalna opcja
    { q: "The storm showed no signs of ___; in fact, it intensified.", type: "choice", options: ["abating", "increasing", "growing", "evolving"], answer: 0 },
    { q: "Fashion trends are often ___, lasting only a single season.", type: "choice", options: ["ephemeral", "enduring", "perpetual", "timeless"], answer: 0 },
    { q: "The contract stipulates that the client ___ the first installment upon signing.", type: "choice", options: ["pay", "pays", "shall pay", "must pay"], answer: 0 }, // Subjunctive/formal demand
    { q: "She was reluctant ___ the offer without consulting her team.", type: "choice", options: ["to accept", "accepting", "for accepting", "on accepting"], answer: 0 },
    { q: "His explanation was remarkably ___, making a complex topic accessible to all.", type: "choice", options: ["lucid", "opaque", "obscure", "esoteric"], answer: 0 },
    { q: "The initial proposal was ___ with potential problems.", type: "choice", options: ["rife", "devoid", "empty", "scarce"], answer: 0 },
    { q: "He conducts himself in a way ___ commands respect.", type: "choice", options: ["that", "which", "who", "how"], answer: 0 }, // 'that' jest lepsze dla definiujących clause
    { q: "The test results were an ___; they contradicted all previous data.", type: "choice", options: ["anomaly", "norm", "expectation", "standard"], answer: 0 },
    { q: "The teacher felt compelled to ___ the students for their disruptive behavior.", type: "choice", options: ["admonish", "praise", "commend", "applaud"], answer: 0 },
    { q: "Despite ___ vehement objections, the committee approved the merger.", type: "choice", options: ["their", "them having", "they had", "theirs"], answer: 0 }, // Najzwięźlejsza i najpoprawniejsza
    { q: "The tragic event served to ___ the community into action.", type: "choice", options: ["galvanize", "pacify", "dissuade", "discourage"], answer: 0 },
    { q: "The journal published a ___ critique that dismantled the author's methodology.", type: "choice", options: ["devastating", "superficial", "complimentary", "vague"], answer: 0 }, // Bardziej zaawansowane słownictwo
    { q: "The resolution was ___ by acclamation.", type: "choice", options: ["adopted", "accepted", "denied", "discussed"], answer: 0 }, // Kolokacja formalna (UN/parlamentarna)
    { q: "The discussion quickly descended into ___ arguments understood only by a handful of specialists.", type: "choice", options: ["esoteric", "mainstream", "popular", "simplistic"], answer: 0 },
    { q: "She was ___ for her groundbreaking work in the field.", type: "choice", options: ["lauded", "criticized", "censured", "dismissed"], answer: 0 },
    { q: "Her theory is ___ on decades of empirical research.", type: "choice", options: ["predicated", "based", "founded", "built"], answer: 0 }, // Bardziej zaawansowane synonimy
    { q: "The ___ of smartphones has fundamentally changed social interaction.", type: "choice", options: ["ubiquity", "rarity", "absence", "novelty"], answer: 0 },
    { q: "Politicians often ___ the truth to avoid giving a direct answer.", type: "choice", options: ["obfuscate", "clarify", "elucidate", "illuminate"], answer: 0 },
    { q: "___ the central bank intervened, the currency would have collapsed.", type: "choice", options: ["Had", "If", "Should", "Would"], answer: 0 }, // Czysta struktura gramatyczna
    { q: "In a ___ gesture, he forgave the debt entirely.", type: "choice", options: ["magnanimous", "petty", "vindictive", "spiteful"], answer: 0 },
    { q: "Quantum computing is currently beyond the ___ of most commercial applications.", type: "choice", options: ["purview", "scope", "view", "idea"], answer: 0 }, // Lepsze słowo
    { q: "The data, when considered as a whole, ___ overwhelmingly against the proposed hypothesis.", type: "choice", options: ["militates", "stands", "is", "are"], answer: 0 }, // Zaawansowana kolokacja
    { q: "His ___ for exaggeration often got him into trouble.", type: "choice", options: ["proclivity", "aversion", "reluctance", "disinclination"], answer: 0 },
    { q: "The final manuscript must be submitted ___ the end of the month.", type: "choice", options: ["by", "on", "before", "until"], answer: 0 }, // Niuans przyimka
    { q: "The new safety features are designed to ___ the risks associated with the operation.", type: "choice", options: ["mitigate", "exacerbate", "heighten", "intensify"], answer: 0 },
  // ... (tutaj wstawiamy poprawione pytania) ...

    // ========== ROZSZERZENIE: 40 NOWYCH PYTAŃ C1 ==========

    // Grammar: Inversion & Cleft Sentences (Advanced)
    { q: "___ received official approval than they began construction.", type: "choice", options: ["No sooner had they", "No sooner they had", "Hardly they had", "Scarcely they"], answer: 0 },
    { q: "___ the financial implications that we need to consider most carefully.", type: "choice", options: ["It is", "There are", "What are", "Is it"], answer: 0 }, // Cleft sentence
    { q: "Under no circumstances ___ to disclose the source of the information.", type: "choice", options: ["are you permitted", "you are permitted", "permitted are you", "are permitted you"], answer: 0 },
    { q: "So intricate ___ that it took decades to decipher.", type: "choice", options: ["was the code", "the code was", "had the code been", "the code had been"], answer: 0 },

    // Grammar: Participle Clauses & Absolute Constructions
    { q: "___ , the expedition team pressed on despite the harsh conditions.", type: "choice", options: ["Their spirits buoyed by the discovery", "Buoying their spirits by the discovery", "Having buoyed their spirits", "Their spirits buoying"], answer: 0 }, // Absolute construction
    { q: "___ the final chapter, the author introduces a surprising twist.", type: "choice", options: ["Having set up the premise in", "Setting up the premise in", "Set up the premise in", "After set up the premise in"], answer: 0 },
    { q: "The deal ___, both parties expressed their satisfaction.", type: "choice", options: ["having been finalized", "finalized", "was finalized", "finalizing"], answer: 0 },

    // Grammar: Ellipsis & Substitution
    { q: "He asked her to call him back, but she didn't want to ___.", type: "choice", options: ["do so", "do it", "do", "make it"], answer: 0 },
    { q: "A: 'Will you attend the meeting?' B: 'I might ___.'", type: "choice", options: ["do", "be", "attend", "go"], answer: 0 }, // Ellipsis

    // Vocabulary: Near-Synonyms (Nuanced Differences)
    { q: "Which word implies a subtle and barely noticeable change?", type: "choice", options: ["imperceptible", "glaring", "obvious", "drastic"], answer: 0 },
    { q: "Choose the word that best describes a person who is stubbornly resistant to authority.", type: "choice", options: ["recalcitrant", "compliant", "docile", "amenable"], answer: 0 },
    { q: "Her success was ___; it was the result of years of meticulous planning.", type: "choice", options: ["fortuitous", "serendipitous", "calculated", "accidental"], answer: 2 },
    { q: "The report provided a ___ analysis of the root causes, not just the symptoms.", type: "choice", options: ["perfunctory", "cursory", "superficial", "penetrating"], answer: 3 },

    // Vocabulary: Formal & Academic Register
    { q: "The government's policies have ___ widespread social unrest.", type: "choice", options: ["precipitated", "prevented", "assuaged", "mitigated"], answer: 0 },
    { q: "The study aims to ___ the relationship between the two variables.", type: "choice", options: ["elucidate", "obfuscate", "confuse", "complicate"], answer: 0 },
    { q: "His argument, while compelling, ___ on a flawed assumption.", type: "choice", options: ["hinges", "rests", "depends", "relies"], answer: 0 }, // Wszystkie poprawne, 'hinges' jest bardzo formalne
    { q: "The theory has been largely ___ by recent empirical evidence.", type: "choice", options: ["substantiated", "refuted", "weakened", "challenged"], answer: 0 },

    // Vocabulary: Idioms & Fixed Phrases (Advanced)
    { q: "After the merger, the company was ___ (in a very strong position).", type: "choice", options: ["in an enviable position", "on its last legs", "in a tight spot", "behind the eight ball"], answer: 0 },
    { q: "His criticism ___ (was very accurate).", type: "choice", options: ["hit the nail on the head", "beat around the bush", "was off the mark", "pulled no punches"], answer: 0 },
    { q: "They decided to ___ (abandon the project) after the initial setbacks.", type: "choice", options: ["cut their losses", "throw good money after bad", "go back to the drawing board", "bite the bullet"], answer: 0 },

    // Collocations (Advanced)
    { q: "The comments were deemed to ___ a breach of protocol.", type: "choice", options: ["constitute", "make", "do", "have"], answer: 0 },
    { q: "She ___ a formidable challenge to the incumbent.", type: "choice", options: ["poses", "does", "makes", "takes"], answer: 0 },
    { q: "The agreement ___ the foundation for future cooperation.", type: "choice", options: ["lays", "sets", "makes", "does"], answer: 0 },
    { q: "He ___ a convincing case for his innocence.", type: "choice", options: ["presented", "did", "made", "had"], answer: 0 },

    // Prepositions (Advanced/Idiomatic)
    { q: "His actions were not ___ keeping with company policy.", type: "choice", options: ["in", "on", "by", "with"], answer: 0 },
    { q: "The results are ___ variance with the initial hypothesis.", type: "choice", options: ["at", "in", "on", "by"], answer: 1 },
    { q: "She has a talent ___ languages.", type: "choice", options: ["for", "in", "with", "on"], answer: 0 },
    { q: "There's no excuse ___ such behavior.", type: "choice", options: ["for", "about", "on", "in"], answer: 0 },

    // Phrasal Verbs (Formal Context)
    { q: "The investigation will ___ (discover) what went wrong.", type: "choice", options: ["ascertain", "find out", "look into", "figure out"], answer: 0 }, // Formal synonym for phrasal verb
    { q: "The committee was ___ (established) to review the procedures.", type: "choice", options: ["set up", "put up", "built up", "made up"], answer: 0 },
    { q: "They decided to ___ (postpone) the decision until more data was available.", type: "choice", options: ["defer", "put off", "call off", "hold up"], answer: 0 }, // Formal synonym

    // Discourse Markers & Linkers (Academic)
    { q: "___ the aforementioned points, it is clear that further research is needed.", type: "choice", options: ["In light of", "Because", "Even though", "Whereas"], answer: 0 },
    { q: "The sample size was small. ___, the results cannot be considered conclusive.", type: "choice", options: ["Hence", "Nevertheless", "Accordingly", "Moreover"], answer: 0 },
    { q: "___ the experiment was conducted under controlled conditions, some variables could not be eliminated.", type: "choice", options: ["Notwithstanding that", "Because", "Therefore", "So that"], answer: 0 },

    // Word Formation (Advanced)
    { q: "What is the noun from 'indefatigable'?", type: "choice", options: ["indefatigability", "indefatigableness", "indefatigation", "fatigue"], answer: 0 },
    { q: "What is the adjective from 'dichotomy'?", type: "choice", options: ["dichotomous", "dichotomic", "dichotomical", "dichotomistic"], answer: 0 },
    { q: "Which prefix is used with 'operable' to mean 'cannot be operated'?", type: "choice", options: ["in-", "un-", "non-", "dis-"], answer: 0 }, // inoperable

    // Meaning in Context (Subtle Differences)
    { q: "The speaker's ___ tone suggested she was not entirely convinced.", type: "choice", options: ["guarded", "enthusiastic", "forthright", "candid"], answer: 0 },
    { q: "The policy had the ___ effect of increasing inequality.", type: "choice", options: ["perverse", "intended", "beneficial", "direct"], answer: 0 },
    { q: "His apology seemed ___ and failed to satisfy anyone.", type: "choice", options: ["perfunctory", "heartfelt", "sincere", "genuine"], answer: 0 },
  { q: "Hardly ___ I entered when he left.", answer: "had", type: "fill" },
    { q: "Scarcely ___ we arrived than it began.", answer: "had", type: "fill" },
    { q: "Were I ___, I would accept the offer.", answer: "you", type: "fill" },
    { q: "Only after he left ___ I realize the truth.", answer: "did", type: "fill" },
    { q: "Not until later ___ I understand.", answer: "did", type: "fill" },
    { q: "No sooner ___ he said it than she cried.", answer: "had", type: "fill" },
    { q: "Rarely ___ we seen such talent.", answer: "have", type: "fill" },
    { q: "Seldom ___ she spoken so openly.", answer: "has", type: "fill" },
    { q: "Under no circumstances ___ you open it.", answer: "must", type: "fill" },
    { q: "On no account ___ they be allowed in.", answer: "should", type: "fill" },
    { q: "Little ___ he know about it.", answer: "did", type: "fill" },
    { q: "So difficult ___ the test that many failed.", answer: "was", type: "fill" },
    { q: "Should you ___ any problems, call me.", answer: "have", type: "fill" },
    { q: "Were it ___, we would go outside.", answer: "warmer", type: "fill" },
    { q: "Had I ___ earlier, I would have told you.", answer: "known", type: "fill" },
    { q: "At no time ___ she admit the truth.", answer: "did", type: "fill" },
    { q: "Nowhere ___ it more beautiful than here.", answer: "is", type: "fill" },
    { q: "In no way ___ I responsible for this.", answer: "am", type: "fill" },
    { q: "By no means ___ this easy.", answer: "is", type: "fill" },
    { q: "Not only ___ he win, but he also broke the record.", answer: "did", type: "fill" },
  ]
};


const germanQuestions: Record<string, Question[]> = {
  A1: [
    { q: "Wie sagt man 'dzień dobry' auf Deutsch?", type: "choice", options: ["Guten Morgen", "Gute Nacht", "Auf Wiedersehen", "Bitte"], answer: 0 },
    { q: "Er ___ aus Berlin.", type: "choice", options: ["ist", "bist", "sein", "seid"], answer: 0 },
    { q: "Wähle den richtigen Artikel: ___ Tisch", type: "choice", options: ["Der", "Die", "Das", "Den"], answer: 0 },
    { q: "Wie heißt 'kot' auf Deutsch?", type: "choice", options: ["Hund", "Katze", "Vogel", "Fisch"], answer: 1 },
    { q: "Setze ein: Ich ___ Anna.", type: "fill", answer: "bin" },
    { q: "Setze ein: Wir ___ müde.", type: "fill", answer: "sind" },
    { q: "Übersetze: 'dziękuję'", type: "fill", answer: "danke" },
    { q: "Übersetze: 'proszę'", type: "fill", answer: "bitte" },
    { q: "Setze ein: Du ___ aus Polen.", type: "fill", answer: "kommst" },
    { q: "Was bedeutet 'Freund'?", type: "choice", options: ["przyjaciel", "dom", "rodzina", "miasto"], answer: 0 },
  ],
  A2: [
    { q: "Welches Wort passt? Er ___ seit zwei Jahren in Wien.", type: "choice", options: ["wohnen", "wohnt", "wohnte", "gewohnt"], answer: 1 },
    { q: "Wähle die richtige Präposition: Ich warte ___ dich.", type: "choice", options: ["auf", "in", "mit", "zu"], answer: 0 },
    { q: "Wie sagt man 'czasami' auf Deutsch?", type: "choice", options: ["immer", "manchmal", "nie", "bald"], answer: 1 },
    { q: "Setze ein: Gestern ___ wir ins Kino.", type: "fill", answer: "gingen" },
    { q: "Setze ein: Kannst du mir ___?", type: "fill", answer: "helfen" },
    { q: "Übersetze: 'Ona pracuje w banku.'", type: "fill", answer: "Sie arbeitet in einer Bank." },
    { q: "Welche Antwort ist richtig? Hast du Hunger?", type: "choice", options: ["Ja, ich habe Hunger.", "Nein, ich bin Hunger.", "Ja, ich bin Hunger.", "Nein, ich habe Hungern."], answer: 0 },
    { q: "Setze ein: Wir haben gestern viel ___.", type: "fill", answer: "gelernt" },
    { q: "Was bedeutet 'spät'?", type: "choice", options: ["późno", "wcześnie", "zawsze", "często"], answer: 0 },
    { q: "Setze ein: Wenn es regnet, ___ ich zu Hause.", type: "fill", answer: "bleibe" },
  ],
  B1: [
    { q: "Wähle die richtige Form: Ich ___ mich an das neue Leben.", type: "choice", options: ["gewöhnen", "gewöhne", "gewöhnte", "gewöhnt"], answer: 1 },
    { q: "Setze ein: Er hat das Buch gestern ___.", type: "fill", answer: "gelesen" },
    { q: "Welches Modalverb passt? Du ___ mehr üben.", type: "choice", options: ["musst", "magst", "darfst", "kannst"], answer: 0 },
    { q: "Übersetze: 'Musiałem zostać w domu.'", type: "fill", answer: "Ich musste zu Hause bleiben." },
    { q: "Setze ein: Wenn ich Zeit hätte, ___ ich reisen.", type: "fill", answer: "würde" },
    { q: "Was bedeutet 'umweltfreundlich'?", type: "choice", options: ["ekologiczny", "niebezpieczny", "szybki", "głośny"], answer: 0 },
    { q: "Wähle richtig: Obwohl es kalt war, ___ wir spazieren.", type: "choice", options: ["gehen", "gingen", "gegangen", "geht"], answer: 1 },
    { q: "Setze ein: Sie hat vergessen, den Brief ___.", type: "fill", answer: "zu schicken" },
    { q: "Setze ein: Er fragte, ob ich ihm ___ könne.", type: "fill", answer: "helfen" },
    { q: "Was bedeutet 'Veranstaltung'?", type: "choice", options: ["wydarzenie", "pociąg", "rachunek", "mieszkanie"], answer: 0 },
  ],
  B2: [
    { q: "Er behauptet, er ___ das Problem lösen können.", type: "choice", options: ["werde", "würde", "hätte", "habe"], answer: 1 },
    { q: "Setze ein: Nachdem er gegessen hatte, ___ er spazieren.", type: "fill", answer: "ging" },
    { q: "Was bedeutet 'nachhaltig'?", type: "choice", options: ["zrównoważony", "tymczasowy", "łatwy", "cichy"], answer: 0 },
    { q: "Setze ein: Je mehr ich lerne, desto ___ verstehe ich.", type: "fill", answer: "mehr" },
    { q: "Wähle richtig: Trotz des Regens ___ sie das Projekt fort.", type: "choice", options: ["setzen", "setzten", "setzt", "setze"], answer: 1 },
    { q: "Übersetze: 'Zostało postanowione, że spotkanie odbędzie się jutro.'", type: "fill", answer: "Es wurde beschlossen, dass das Treffen morgen stattfindet." },
    { q: "Setze ein: Er tut so, als ___ er alles wüsste.", type: "fill", answer: "ob" },
    { q: "Was bedeutet 'Zuverlässigkeit'?", type: "choice", options: ["niezawodność", "szybkość", "leniwość", "oszczędność"], answer: 0 },
    { q: "Setze ein: Hätte ich das gewusst, ___ ich anders entschieden.", type: "fill", answer: "hätte" },
    { q: "Wähle richtig: Kaum war er angekommen, ___ das Telefon.", type: "choice", options: ["klingelte", "klingeln", "klingelt", "geklingelt"], answer: 0 },
  ],
  C1: [
    { q: "Setze ein: Obgleich er viel Erfahrung hat, ___ er bescheiden.", type: "fill", answer: "bleibt" },
    { q: "Wähle richtig: Die Ergebnisse, ___ Sie anfordern, liegen bereit.", type: "choice", options: ["die", "der", "welche", "dessen"], answer: 0 },
    { q: "Was bedeutet 'überwältigend'?", type: "choice", options: ["przytłaczający", "nudny", "mały", "skromny"], answer: 0 },
    { q: "Setze ein: Der Vortrag war so komplex, dass viele Zuhörer kaum etwas ___.", type: "fill", answer: "verstanden" },
    { q: "Wähle richtig: Wäre er informiert worden, ___ er reagiert.", type: "choice", options: ["hätte", "würde", "war", "sei"], answer: 0 },
    { q: "Setze ein: Sollte es weitere Fragen geben, ___ wir Ihnen zur Verfügung.", type: "fill", answer: "stehen" },
    { q: "Was bedeutet 'Auseinandersetzung'?", type: "choice", options: ["spór", "spotkanie", "odpowiedzialność", "sprawozdanie"], answer: 0 },
    { q: "Setze ein: Selbst wenn wir früher gegangen wären, ___ wir zu spät gekommen.", type: "fill", answer: "wären" },
    { q: "Wähle richtig: Kaum hatte er ausgesprochen, ___ sie ihm zu.", type: "choice", options: ["stimmten", "stimmen", "stimmte", "zustimmen"], answer: 0 },
    { q: "Setze ein: Alles in allem lässt sich sagen, dass das Projekt ___ war.", type: "fill", answer: "erfolgreich" },
  ],
};

const spanishQuestions: Record<string, Question[]> = {
  A1: [
    { q: "¿Cómo se dice 'dzień dobry' en español?", type: "choice", options: ["Buenos días", "Buenas noches", "Adiós", "Por favor"], answer: 0 },
    { q: "Yo ___ de Polonia.", type: "choice", options: ["soy", "eres", "es", "somos"], answer: 0 },
    { q: "Selecciona el artículo correcto: ___ casa", type: "choice", options: ["La", "El", "Los", "Un"], answer: 0 },
    { q: "¿Qué significa 'libro'?", type: "choice", options: ["książka", "stół", "miasto", "pies"], answer: 0 },
    { q: "Completa: Tú ___ mi amigo.", type: "fill", answer: "eres" },
    { q: "Completa: Nosotros ___ estudiantes.", type: "fill", answer: "somos" },
    { q: "Traduce: 'dziękuję'", type: "fill", answer: "gracias" },
    { q: "Traduce: 'proszę'", type: "fill", answer: "por favor" },
    { q: "Completa: Ellos ___ en Madrid.", type: "fill", answer: "viven" },
    { q: "¿Cómo se dice 'kot' en español?", type: "choice", options: ["perro", "gato", "pájaro", "pez"], answer: 1 },
  ],
  A2: [
    { q: "Elige la opción correcta: Ayer nosotros ____ al cine.", type: "choice", options: ["vamos", "fuimos", "íbamos", "ir"], answer: 1 },
    { q: "¿Cómo se dice 'czasami' en español?", type: "choice", options: ["siempre", "a veces", "nunca", "jamás"], answer: 1 },
    { q: "Completa: Ella ha ____ una carta.", type: "fill", answer: "escrito" },
    { q: "Completa: ¿Puedes ____ ayudarme?", type: "fill", answer: "ayudar" },
    { q: "Traduce: 'Ona mieszka w Barcelonie.'", type: "fill", answer: "Ella vive en Barcelona." },
    { q: "Elige la respuesta correcta: ¿Tienes hambre?", type: "choice", options: ["Sí, tengo hambre.", "No, soy hambre.", "Sí, soy hambre.", "No, tengo hambriento."], answer: 0 },
    { q: "Completa: Nosotros hemos ____ mucho hoy.", type: "fill", answer: "estudiado" },
    { q: "¿Qué significa 'pronto'?", type: "choice", options: ["późno", "wcześnie", "cicho", "wolno"], answer: 1 },
    { q: "Completa: Si llueve, ___ en casa.", type: "fill", answer: "me quedo" },
    { q: "Completa: Esta tarde vamos a ___ al museo.", type: "fill", answer: "ir" },
  ],
  B1: [
    { q: "Elige la forma correcta: Yo ___ acostumbrándome al trabajo nuevo.", type: "choice", options: ["me estoy", "me estoy poniendo", "me acostumbro", "me acostumbré"], answer: 0 },
    { q: "Completa: Él ha ____ el libro esta semana.", type: "fill", answer: "leído" },
    { q: "¿Qué verbo modal falta? Debes ___ más.", type: "fill", answer: "estudiar" },
    { q: "Traduce: 'Musiałem zostać w domu.'", type: "fill", answer: "Tuve que quedarme en casa." },
    { q: "Completa: Si tuviera tiempo, ___ más.", type: "fill", answer: "viajaría" },
    { q: "¿Qué significa 'medio ambiente'?", type: "choice", options: ["środowisko", "hałas", "prędkość", "pogoda"], answer: 0 },
    { q: "Elige correcto: Aunque hacía frío, nosotros ___ a pasear.", type: "choice", options: ["fuimos", "vamos", "íbamos", "ir"], answer: 0 },
    { q: "Completa: Ella ha olvidado ___ la carta.", type: "fill", answer: "enviar" },
    { q: "Completa: Me preguntó si podía ___.", type: "fill", answer: "ayudarle" },
    { q: "¿Qué significa 'evento'?", type: "choice", options: ["wydarzenie", "pociąg", "rachunek", "mieszkanie"], answer: 0 },
  ],
  B2: [
    { q: "Él afirma que ___ resolver el problema.", type: "choice", options: ["podrá", "podría", "hubiera", "ha"], answer: 1 },
    { q: "Completa: Después de que comió, ___ a pasear.", type: "fill", answer: "salió" },
    { q: "¿Qué significa 'sostenible'?", type: "choice", options: ["zrównoważony", "tymczasowy", "łatwy", "cichy"], answer: 0 },
    { q: "Completa: Cuanto más estudio, más ___ entiendo.", type: "fill", answer: "lo" },
    { q: "Elige correcto: A pesar de la lluvia, ellos ___ con el proyecto.", type: "choice", options: ["siguieron", "siguen", "seguían", "seguir"], answer: 0 },
    { q: "Traduce: 'Zdecydowano, że spotkanie odbędzie się jutro.'", type: "fill", answer: "Se decidió que la reunión será mañana." },
    { q: "Completa: Hace como si ___ todo.", type: "fill", answer: "supiera" },
    { q: "¿Qué significa 'fiable'?", type: "choice", options: ["niezawodny", "wolny", "leniwy", "oszczędny"], answer: 0 },
    { q: "Completa: Si lo hubiera sabido, ___ diferente.", type: "fill", answer: "habría decidido" },
    { q: "Elige correcto: Apenas llegó, el teléfono ___.", type: "choice", options: ["sonó", "sonar", "suena", "sonado"], answer: 0 },
  ],
  C1: [
    { q: "Completa: Aunque tiene mucha experiencia, ___ humilde.", type: "fill", answer: "sigue" },
    { q: "Elige correcto: Los resultados, ___ usted solicitó, están listos.", type: "choice", options: ["que", "cuyo", "de los que", "los cuales"], answer: 0 },
    { q: "¿Qué significa 'abrumador'?", type: "choice", options: ["przytłaczający", "nudny", "mały", "skromny"], answer: 0 },
    { q: "Completa: La conferencia fue tan compleja que muchos apenas ___ algo.", type: "fill", answer: "entendieron" },
    { q: "Elige correcto: Si hubiera sido informado, ___ reaccionado.", type: "choice", options: ["habría", "hubiera", "fue", "sea"], answer: 0 },
    { q: "Completa: Si hubiera más preguntas, ___ a su disposición.", type: "fill", answer: "estaríamos" },
    { q: "¿Qué significa 'debate'?", type: "choice", options: ["debata", "raport", "odpowiedzialność", "analiza"], answer: 0 },
    { q: "Completa: Incluso si hubiéramos salido antes, ___ tarde.", type: "fill", answer: "habríamos llegado" },
    { q: "Elige correcto: Apenas terminó de hablar, ellos lo ___.", type: "choice", options: ["aplaudieron", "aplauden", "aplaudir", "aplaudía"], answer: 0 },
    { q: "Completa: En resumen, se puede decir que el proyecto fue ___.", type: "fill", answer: "exitoso" },
  ],
};

export const QUESTION_BANKS: Record<LearningLanguage, Record<string, Question[]>> = {
  en: englishQuestions,
  de: germanQuestions,
  es: spanishQuestions,
};

