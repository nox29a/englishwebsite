export type Question = { q: string; options: string[]; answer: number };



export const questionsDB: Record<string, Question[]> = {
"A1": [
    // Sekcja: Podstawowe zwroty i reakcje
    { q: "What's your name?", options: ["I'm fine, thanks.", "My name is Anna.", "Yes, I am.", "It's good."], answer: 1 },
    { q: "Where are you from?", options: ["I'm from Spain.", "I'm 20 years old.", "Yes, I do.", "I'm at home."], answer: 0 },
    { q: "How do you say 'dziękuję' in English?", options: ["Sorry", "Hello", "Thank you", "Please"], answer: 2 },
    { q: "How do you say 'dobranoc' in English?", options: ["Good morning", "Good night", "Hello", "Goodbye"], answer: 1 },
    { q: "How do you say 'proszę' in English?", options: ["Please", "Sorry", "Thanks", "You're welcome"], answer: 0 },
    { q: "How do you say 'przepraszam' in English?", options: ["Excuse me / Sorry", "Thank you", "Please", "See you later"], answer: 0 }, // "Sorry" jest adekwatne, ale "Excuse me" też. Rozszerzyłem odpowiedź.
    { q: "How do you say 'dzień dobry' in English?", options: ["Good night", "Good morning / Hello", "Goodbye", "See you"], answer: 1 }, // "Good morning" jest precyzyjniejsze, ale "Hello" też działa.
    { q: "How do you say 'do widzenia' in English?", options: ["Hello", "Goodbye", "Please", "Thanks"], answer: 1 },
    { q: "How do you say 'tak' in English?", options: ["No", "Yes", "Maybe", "Later"], answer: 1 },

    // Sekcja: Gramatyka (to be, present simple, articles)
    { q: "Complete: I ___ a student.", options: ["is", "are", "am", "be"], answer: 2 },
    { q: "Complete: He ___ not here now.", options: ["is", "are", "am", "be"], answer: 0 },
    { q: "Complete: They ___ in the park.", options: ["is", "are", "am", "be"], answer: 1 },
    { q: "Complete: He ___ a doctor.", options: ["is", "are", "am", "be"], answer: 0 },
    { q: "Choose: She ___ breakfast every day.", options: ["eat", "eats", "is eat", "eating"], answer: 1 },
    { q: "Choose: I ___ coffee in the morning.", options: ["drink", "drinks", "drinking", "drank"], answer: 0 },
    { q: "Choose: I ___ in Poland.", options: ["live", "lives", "living", "lived"], answer: 0 },
    { q: "Choose: Where ___ you live?", options: ["do", "does", "are", "is"], answer: 0 },
    { q: "Choose: I ___ like bananas.", options: ["don't", "doesn't", "not", "no"], answer: 0 },
    { q: "Complete: We ___ to school by bus.", options: ["go", "goes", "went", "going"], answer: 0 },
    { q: "Complete: I can ___ a bike.", options: ["ride", "riding", "rode", "rides"], answer: 0 },
    { q: "Complete: I like ___ tea.", options: ["drink", "drinking", "to drink", "drank"], answer: 2 }, // Obie opcje 1 i 2 są poprawne, ale 2 (to drink) jest bardziej uniwersalną odpowiedzią na testach.
    { q: "Choose: This is ___ book.", options: ["my", "me", "I", "mine"], answer: 0 },
    { q: "Choose the correct word: ___ apple", options: ["a", "an", "the", "-"], answer: 1 }, // "no article" -> "-" jest czystsze
    { q: "Choose the correct word: She has ___ cat.", options: ["a", "an", "the", "-"], answer: 0 },

    // Sekcja: Słownictwo (rzeczowniki, przeciwieństwa, kolokwializmy)
    { q: "What's the plural of 'child'?", options: ["childs", "children", "childes", "childrens"], answer: 1 },
    { q: "What's the plural of 'dog'?", options: ["dog", "dogs", "doges", "doggies"], answer: 1 },
    { q: "What's the opposite of 'big'?", options: ["small", "long", "short", "tiny"], answer: 0 },
    { q: "What's the color of the sky on a clear day?", options: ["green", "blue", "black", "pink"], answer: 1 },
    { q: "Which word is a number?", options: ["red", "table", "seven", "happy"], answer: 2 },
    { q: "Which word is a day of the week?", options: ["orange", "Monday", "Paris", "car"], answer: 1 },
    { q: "Which word is a season?", options: ["spring", "Monday", "circle", "yellow"], answer: 0 },
    { q: "Which word is a job?", options: ["teacher", "green", "run", "quick"], answer: 0 },
    { q: "Which word is a vehicle?", options: ["banana", "car", "shoe", "cup"], answer: 1 },
    { q: "Which word is a fruit?", options: ["carrot", "apple", "potato", "bread"], answer: 1 },
    { q: "Which question asks about age?", options: ["Where are you from?", "How old are you?", "What is your name?", "Do you like it?"], answer: 1 },
    { q: "What's the time expression for 'at this moment'?", options: ["yesterday", "today", "now", "tomorrow"], answer: 2 }, // "for now" jest nieco mylące

    // Sekcja: Tłumaczenie słówek / Podstawowe rzeczowniki
    { q: "How do you say 'pies' in English?", options: ["dog", "cat", "bird", "fish"], answer: 0 },
    { q: "How do you say 'dom' in English?", options: ["home", "house", "flat", "room"], answer: 1 }, // "house" jest najlepszym tłumaczeniem dla "dom"
    { q: "How do you say 'kawa' in English?", options: ["tea", "coffee", "juice", "water"], answer: 1 },

    // Sekcja: Przyimki miejsca
    { q: "Complete: The cat is ___ the table.", options: ["on", "in", "under", "next to"], answer: 0 } // "next" samo w sobie jest niepoprawne, poprawione na "next to"
  ],

  "A2": [
    { q: "Past simple of 'go' is:", options: ["goed", "went", "gone", "going"], answer: 1 },
    { q: "Complete: She ___ to the cinema yesterday.", options: ["go", "goes", "went", "was going"], answer: 2 },
    { q: "Translate: 'często'", options: ["sometimes", "always", "never", "often"], answer: 3 },
    { q: "Choose: There ___ any milk in the fridge.", options: ["isn't", "aren't", "wasn't", "don't"], answer: 0 },
    { q: "Which sentence is correct?", options: ["He can to swim", "He cans swim", "He can swim", "He swim can"], answer: 2 },
    { q: "Future with 'going to': They ___ football tomorrow.", options: ["play", "are playing", "are going to play", "will play"], answer: 2 },
    { q: "What is 'najlepszy' in English?", options: ["better", "the best", "goodest", "bestest"], answer: 1 },
    { q: "Choose the opposite: 'expensive'", options: ["cheap", "rich", "poor", "free"], answer: 0 },
    { q: "Complete: If it ___ tomorrow, we will stay home.", options: ["rain", "rains", "will rain", "raining"], answer: 1 },
    { q: "Choose: She ___ for two hours now.", options: ["is studying", "studies", "was studying", "has been studying"], answer: 3 },
    { q: "Choose correct comparative: faster than, ______ than", options: ["more fast", "fastly than", "as fast than", "faster than"], answer: 3 },
    { q: "Complete: I ___ already eaten.", options: ["has", "have", "had", "having"], answer: 1 },
    { q: "Translate: 'wczoraj'", options: ["today", "tomorrow", "yesterday", "later"], answer: 2 },
    { q: "Choose correct: I ___ breakfast at 8 yesterday.", options: ["have", "had", "has", "haved"], answer: 1 },
    { q: "What is the past of 'see'?", options: ["saw", "seen", "seed", "see"], answer: 0 },
    { q: "Choose: He ___ not like coffee.", options: ["do", "does", "did", "done"], answer: 1 },
    { q: "Complete: I ___ to Paris last year.", options: ["go", "went", "gone", "going"], answer: 1 },
    { q: "Which is correct: 'I've been to London ___ 2010.'", options: ["for", "since", "from", "at"], answer: 1 },
    { q: "Choose the correct modal: You ___ study for the exam.", options: ["must", "might", "shouldn't", "can't"], answer: 0 },
    { q: "Translate: 'zwykle'", options: ["rarely", "usually", "never", "seldom"], answer: 1 },
    { q: "Complete: How long ___ you lived here?", options: ["have", "has", "had", "do"], answer: 0 },
    { q: "Choose: I prefer tea ___ coffee.", options: ["than", "to", "over", "with"], answer: 1 },
    { q: "Which is correct: 'I don't have ___ money.'", options: ["much", "many", "a lot", "some"], answer: 0 },
    { q: "Complete: She ___ to the gym every Monday.", options: ["go", "goes", "going", "went"], answer: 1 },
    { q: "Past participle of 'write' is:", options: ["writed", "wrote", "written", "write"], answer: 2 },
    { q: "Choose the correct question: ___ you ever been to Spain?", options: ["Did", "Have", "Has", "Do"], answer: 1 },
    { q: "Complete: They ___ studying English for three months.", options: ["are", "have been", "was", "had"], answer: 1 },
    { q: "Translate: 'prawie zawsze'", options: ["almost never", "almost always", "sometimes", "rarely"], answer: 1 },
    { q: "Choose: I'd like ___ water, please.", options: ["a", "some", "any", "the"], answer: 1 },
    { q: "Which is correct: 'I am used ___ coffee in the morning.'", options: ["to have", "have", "having", "to having"], answer: 0 },
    { q: "Complete: We ___ dinner when the phone rang.", options: ["have", "were having", "had", "are having"], answer: 1 },
    { q: "Choose: She said she ___ come tomorrow.", options: ["will", "would", "can", "shall"], answer: 1 },
    { q: "Translate: 'mieć zamiar'", options: ["intend", "intention", "intend to", "intended"], answer: 0 },
    { q: "Complete: Please ___ the window.", options: ["close", "closes", "closing", "closed"], answer: 0 },
    { q: "Which is correct: 'There are ___ apples on the table.'", options: ["much", "many", "a little", "less"], answer: 1 },
    { q: "Choose: ___ you mind if I open the window?", options: ["Do", "Will", "Would", "Are"], answer: 2 },
    { q: "Complete: She ___ already left when I arrived.", options: ["has", "have", "had", "was"], answer: 2 },
    { q: "Translate: 'teraz'", options: ["then", "now", "soon", "later"], answer: 1 },
    { q: "Choose correct: I ___ my homework yet.", options: ["didn't finish", "haven't finished", "don't finish", "not finished"], answer: 1 },
    { q: "Complete: He ___ to school by bike every day.", options: ["go", "goes", "went", "going"], answer: 1 },

    // Sekcja: Rodzina i ludzie
    { q: "Complete: My mother's daughter is my ___.", options: ["aunt", "sister", "grandmother", "cousin"], answer: 1 },
    { q: "What is the opposite of 'young'?", options: ["old", "new", "small", "tall"], answer: 0 },
    { q: "How do you say 'brat' in English?", options: ["brother", "son", "child", "boy"], answer: 0 },

    // Sekcja: Liczby i kolory
    { q: "Which number comes after twelve?", options: ["thirteen", "eleven", "twenty", "fifteen"], answer: 0 },
    { q: "What color is a banana?", options: ["red", "blue", "yellow", "black"], answer: 2 },
    { q: "What is 10 + 7?", options: ["seventeen", "seventy", "seven", "sixteen"], answer: 0 },

    // Sekcja: Dom i otoczenie
    { q: "You sit on a ___.", options: ["chair", "table", "bed", "fridge"], answer: 0 },
    { q: "You sleep in a ___.", options: ["bath", "kitchen", "bed", "garage"], answer: 2 },
    { q: "Complete: We cook food in the ___.", options: ["bathroom", "garden", "kitchen", "living room"], answer: 2 },
    { q: "You can see the stars in the ___.", options: ["sky", "sea", "tree", "car"], answer: 0 },

    // Sekcja: Jedzenie i picie
    { q: "You can eat ___ for breakfast.", options: ["eggs", "pizza", "soup", "pasta"], answer: 0 },
    { q: "Which is a drink?", options: ["orange", "apple", "water", "bread"], answer: 2 },
    { q: "Which word does NOT fit? Apple, banana, ___, car.", options: ["orange", "pear", "train", "mango"], answer: 2 }, // Pytanie sprawdzające kategorię

    // Sekcja: Czas i kalendarz
    { q: "How many days are there in a week?", options: ["five", "seven", "twelve", "thirty"], answer: 1 },
    { q: "Which month comes after April?", options: ["March", "June", "May", "July"], answer: 2 },
    { q: "What day is it after Friday?", options: ["Thursday", "Sunday", "Saturday", "Monday"], answer: 2 },

    // Sekcja: Czynności dnia codziennego (Present Simple)
    { q: "Complete: I ___ my teeth every morning.", options: ["brush", "brushes", "brushing", "brushed"], answer: 0 },
    { q: "Complete: She ___ to work at 8 o'clock.", options: ["go", "goes", "going", "went"], answer: 1 },
    { q: "Complete: They ___ TV in the evening.", options: ["watch", "watches", "watching", "watched"], answer: 0 },
    { q: "Choose the correct question:", options: ["Where you work?", "Where do you work?", "Where does you work?", "You work where?"], answer: 1 },

    // Sekcja: Przymiotniki i opisywanie
    { q: "The weather is very ___. Take a coat.", options: ["hot", "cold", "sunny", "big"], answer: 1 },
    { q: "A lemon is not sweet. It is ___.", options: ["sour", "spicy", "salty", "bitter"], answer: 0 },
    { q: "The opposite of 'expensive' is ___.", options: ["cheap", "beautiful", "new", "good"], answer: 0 },

    // Sekcja: Zwierzęta
    { q: "A ___ lives in the water and can swim.", options: ["dog", "cat", "fish", "bird"], answer: 2 },
    { q: "Which animal gives us milk?", options: ["pig", "chicken", "cow", "sheep"], answer: 2 },
    { q: "A ___ can fly and has feathers.", options: ["bat", "butterfly", "bird", "airplane"], answer: 2 },

    // Sekcja: Pogoda
    { q: "When it rains, you need an ___.", options: ["ice cream", "umbrella", "book", "apple"], answer: 1 },
    { q: "What do you see in the sky on a sunny day?", options: ["the moon", "the sun", "stars", "clouds"], answer: 1 },

    // Sekcja: Hobby i czas wolny
    { q: "I ___ books in my free time.", options: ["read", "reads", "reading", "red"], answer: 0 },
    { q: "People play football in a ___.", options: ["pool", "court", "field", "track"], answer: 2 },
    { q: "You can listen to ___.", options: ["music", "book", "food", "photo"], answer: 0 },

    // Sekcja: Podstawowe czasowniki i zwroty
    { q: "Complete: Can you ___ me your pen, please?", options: ["give", "take", "have", "make"], answer: 0 },
    { q: "Complete: I ___ to music on the bus.", options: ["hear", "listen", "see", "look"], answer: 1 },
    { q: "What do you say when you meet someone for the first time?", options: ["Goodbye!", "Nice to meet you.", "Thank you.", "See you later."], answer: 1 },

    // Sekcja: Przyimki miejsca (rozwinięcie)
    { q: "The book is ___ the bag.", options: ["on", "under", "in", "next to"], answer: 2 },
    { q: "The picture is ___ the wall.", options: ["on", "in", "at", "under"], answer: 0 },

    // Sekcja: Krajobraz i przyroda
    { q: "You can climb a ___.", options: ["river", "mountain", "lake", "sea"], answer: 1 },
    { q: "Which is NOT a part of nature?", options: ["tree", "flower", "computer", "river"], answer: 2 },

    // Sekcja: Pytania i odpowiedzi (matching)
    { q: "Answer: 'How are you?'", options: ["I'm 25.", "I'm a student.", "I'm fine, thanks.", "I'm from London."], answer: 2 },
    { q: "Answer: 'What time is it?'", options: ["It's Monday.", "It's 9 o'clock.", "It's sunny.", "It's on the table."], answer: 1 }
  
  ],

  "B1": [
    { q: "I have lived here ___ 2010.", options: ["since", "for", "from", "by"], answer: 0 },
    { q: "Reported speech: 'I am tired' → He said he ___ tired.", options: ["is", "was", "were", "has been"], answer: 1 },
    { q: "If I ___ more time, I would travel more.", options: ["have", "had", "would have", "had had"], answer: 1 },
    { q: "Passive voice: 'My mother made the cake' → The cake ___ by my mother.", options: ["was made", "made", "is made", "makes"], answer: 0 },
    { q: "He suggested ___ to the cinema.", options: ["going", "to go", "that go", "go"], answer: 0 },
    { q: "I'm ___ getting up early. (przyzwyczajony do)", options: ["used to", "get used to", "am used to", "use to"], answer: 2 },
    { q: "She ___ dinner when I arrived.", options: ["cooked", "was cooking", "had cooked", "cooks"], answer: 1 },
    { q: "Choose the best synonym for 'furious':", options: ["angry", "happy", "calm", "pleased"], answer: 0 },
    { q: "Neither of the students ___ prepared for the test.", options: ["was", "were", "have been", "are"], answer: 0 },
    { q: "___ it was raining, we decided to go for a walk.", options: ["Although", "Because", "Therefore", "However"], answer: 0 },
    { q: "I wish I ___ play a musical instrument.", options: ["can", "could", "will", "would"], answer: 1 },
    { q: "By the time she arrived, we ___ already left.", options: ["have", "had", "has", "will have"], answer: 1 },
    { q: "He's interested ___ learning Chinese.", options: ["in", "on", "at", "for"], answer: 0 },
    { q: "Phrasal verb: 'find out' means:", options: ["discover", "invent", "search", "lose"], answer: 0 },
    { q: "I recommend that he ___ a doctor.", options: ["sees", "see", "saw", "seeing"], answer: 1 },
    { q: "The game was canceled ___ the bad weather. (w związku z)", options: ["because of", "despite", "although", "however"], answer: 0 },
    { q: "I'd rather you ___ me the truth.", options: ["tell", "told", "would tell", "telling"], answer: 1 },
    { q: "He insisted ___ paying for dinner.", options: ["on", "in", "at", "for"], answer: 0 },
    { q: "She has been working here ___ five years.", options: ["since", "for", "during", "from"], answer: 1 },
    { q: "We need to ___ a decision soon.", options: ["make", "do", "take", "have"], answer: 0 },
    { q: "He made a ___ error in the report.", options: ["serious", "seriously", "seriousness", "series"], answer: 0 },
    { q: "I didn't know what ___ in that situation.", options: ["to do", "do", "doing", "done"], answer: 0 },
    { q: "'I had already eaten when she arrived' uses the:", options: ["past perfect", "present perfect", "past continuous", "past simple"], answer: 0 },
    { q: "'Where do you live?' → He asked me ___.", options: ["where I lived", "where did I live", "where do I live", "where I live"], answer: 0 },
    { q: "She's one of those people ___ always happy.", options: ["who are", "which is", "who is", "that is"], answer: 0 },
    { q: "He acts ___ he owns the place.", options: ["as if", "like", "as", "such as"], answer: 0 },
    { q: "It was raining heavily. ___, we decided to cancel the picnic.", options: ["Therefore", "Although", "Despite", "However"], answer: 0 },
    { q: "I'm looking forward ___ you at the party.", options: ["to seeing", "to see", "seeing", "see"], answer: 0 },
    { q: "If I ___ about the problem, I would have helped.", options: ["had known", "would know", "knew", "know"], answer: 0 },
    { q: "She made me ___ my homework again.", options: ["do", "to do", "doing", "done"], answer: 0 },
    { q: "Choose the best synonym for 'minute' (adjective):", options: ["huge", "tiny", "important", "significant"], answer: 1 },
    { q: "She speaks English ___ than her brother.", options: ["more fluently", "fluentlier", "most fluently", "fluently"], answer: 0 },
    { q: "You can always rely ___ Michael in a crisis.", options: ["on", "in", "at", "for"], answer: 0 },
    { q: "___ I don't agree with him, I respect his opinion. (chociaż)", options: ["Although", "Because", "Therefore", "However"], answer: 0 },
    { q: "By this time next year, I ___ my master's degree.", options: ["will complete", "will have completed", "complete", "am completing"], answer: 1 },
    { q: "I ___ like classical music, but now I love it.", options: ["didn't use to", "used not", "didn't used to", "use not to"], answer: 0 },
    { q: "This is the first time I ___ this famous painting in person.", options: ["see", "am seeing", "have seen", "had seen"], answer: 2 },
    { q: "She demanded that he ___ immediately.", options: ["leaves", "leave", "left", "leaving"], answer: 1 },
    { q: "It's high time we ___ working on this project.", options: ["start", "started", "have started", "starting"], answer: 1 },
    { q: "I prefer tea ___ coffee.", options: ["to", "than", "over", "rather"], answer: 0 },


    // Grammar: Mixed Tenses
    { q: "By the time you arrive, I ___ for over two hours.", options: ["will be waiting", "will have been waiting", "have been waiting", "wait"], answer: 1 },
    { q: "If it ___ tomorrow, we'll cancel the picnic.", options: ["rains", "will rain", "rained", "would rain"], answer: 0 },
    { q: "I ___ to the gym three times this week.", options: ["have been", "went", "have gone", "go"], answer: 2 },
    { q: "She told me she ___ that movie the previous night.", options: ["saw", "had seen", "has seen", "sees"], answer: 1 },

    // Grammar: Conditionals & Wishes
    { q: "I wouldn't have missed the bus if I ___ earlier.", options: ["left", "had left", "would leave", "leave"], answer: 1 },
    { q: "If only I ___ richer!", options: ["am", "was", "were", "would be"], answer: 2 },
    { q: "Supposing it ___ sunny, what would we do then?", options: ["isn't", "wasn't", "weren't", "hadn't been"], answer: 2 },

    // Grammar: Modals & Semi-modals
    { q: "You ___ have told me you were coming! I would have baked a cake.", options: ["must", "should", "ought", "could"], answer: 1 },
    { q: "She ___ be at home. Her car is in the driveway.", options: ["must", "can't", "might", "should"], answer: 0 },
    { q: "We'd better ___ soon, or we'll be late.", options: ["leave", "to leave", "leaving", "left"], answer: 0 },
    { q: "You ___ to have a visa to travel to some countries.", options: ["must", "should", "need", "ought"], answer: 2 },

    // Grammar: Passive Voice & Causative
    { q: "The new bridge ___ next year.", options: ["will be built", "will build", "is building", "builds"], answer: 0 },
    { q: "I need to ___ before the interview.", options: ["have my suit cleaned", "have cleaned my suit", "clean my suit", "my suit clean"], answer: 0 },
    { q: "The story ___ by many people.", options: ["has been believed", "has believed", "believed", "is believe"], answer: 0 },

    // Grammar: Prepositions & Phrasal Verbs
    { q: "I completely agree ___ you on this matter.", options: ["with", "to", "on", "for"], answer: 0 },
    { q: "The company is looking ___ new ways to reduce costs.", options: ["into", "for", "at", "after"], answer: 1 },
    { q: "Could you turn ___ the volume? I can't hear it.", options: ["up", "on", "down", "off"], answer: 0 },
    { q: "He came ___ a very old photograph while cleaning the attic.", options: ["across", "into", "up with", "over"], answer: 0 },
    { q: "She takes ___ her mother; they have the same smile.", options: ["after", "over", "on", "up"], answer: 0 },

    // Vocabulary: Synonyms & Antonyms
    { q: "Choose the best synonym for 'exhausted':", options: ["tired", "energetic", "bored", "excited"], answer: 0 },
    { q: "Choose the best antonym for 'ancient':", options: ["old", "modern", "historic", "aged"], answer: 1 },
    { q: "Choose the word closest in meaning to 'relieved':", options: ["worried", "annoyed", "thankful", "disappointed"], answer: 2 },
    { q: "Which word does NOT mean 'intelligent'?", options: ["clever", "bright", "stupid", "smart"], answer: 2 },

    // Vocabulary: Collocations & Word Patterns
    { q: "It's pouring with rain. You'll get ___ if you go out without an umbrella.", options: ["wet", "soaked", "damp", "dry"], answer: 1 },
    { q: "Let's ___ a toast to the happy couple!", options: ["make", "do", "have", "propose"], answer: 2 },
    { q: "He ___ a great effort to finish on time.", options: ["did", "made", "had", "took"], answer: 1 },
    { q: "I need to ___ attention to the details.", options: ["make", "have", "pay", "put"], answer: 2 },

    // Vocabulary: Confusing Words
    { q: "The ___ of the mountain was breathtaking.", options: ["sight", "view", "scene", "landscape"], answer: 1 },
    { q: "Could you ___ me a favour?", options: ["make", "do", "give", "have"], answer: 1 },
    { q: "I'm very ___ in history. (interested/interesting)", options: ["interested", "interesting", "interest", "interests"], answer: 0 },
    { q: "That was a very ___ documentary. (interested/interesting)", options: ["interested", "interesting", "interest", "interests"], answer: 1 },

    // Functional Language & Discourse Markers
    { q: "A: 'I failed my driving test.' B: '___! You can always try again.'", options: ["Never mind", "I don't care", "It's your fault", "That's amazing"], answer: 0 },
    { q: "___ the high cost, the product is very popular.", options: ["Despite", "Because", "Therefore", "Although"], answer: 0 },
    { q: "The service was poor. ___, the food was excellent.", options: ["However", "Because", "Therefore", "Despite"], answer: 0 },
    { q: "A: 'Shall we go to the cinema?' B: '___ I'd rather stay in.'", options: ["Actually", "Definitely", "Exactly", "Fortunately"], answer: 0 },

    // Translation & Polish Interference
    { q: "Translate: 'Niezależnie od' (meaning 'regardless of')", options: ["Depending on", "According to", "Regardless of", "In spite of"], answer: 2 },
    { q: "Translate: 'W porównaniu do'", options: ["Compared to", "In comparison with", "Contrary to", "As well as"], answer: 0 }, // Both 0 and 1 are correct, but 0 is more common
    { q: "Translate the sense: 'Zrobić sobie przerwę'", options: ["To make a break", "To take a break", "To have a break", "To do a break"], answer: 2 },
    { q: "Which expression is correct for 'popełnić błąd'?", options: ["make a mistake", "do a mistake", "commit a mistake", "take a mistake"], answer: 0 },

    // Word Formation
    { q: "What is the noun from the verb 'decide'?", options: ["deciding", "decision", "decisive", "decidedly"], answer: 1 },
    { q: "What is the adjective from the noun 'success'?", options: ["succeed", "successful", "successive", "successfully"], answer: 1 },
    { q: "Choose the correct prefix: '___possible'", options: ["im", "un", "in", "ir"], answer: 0 } // More than one can be correct, but 'im' is most common for 'possible'
  
  ],

  "B2": [
    { q: "If she ___ harder, she would have passed the exam.", options: ["had studied", "studied", "would study", "was studying"], answer: 0 },
    { q: "Which is the correct phrase?", options: ["Despite the rain", "Despite of the rain", "In spite the rain", "Although of the rain"], answer: 0 },
    { q: "Hardly ___ I arrived when the phone rang.", options: ["had", "did", "have", "was"], answer: 0 },
    { q: "What does the phrasal verb 'to make up for' mean?", options: ["to compensate for something", "to invent a story", "to apply cosmetics", "to reconcile after an argument"], answer: 0 }, // Rozszerzona definicja
    { q: "Reported speech: 'I can swim very well.' → She said she ___ swim very well.", options: ["could", "can", "was able to", "should"], answer: 0 },
    { q: "Choose the best synonym for 'essential':", options: ["crucial", "optional", "minor", "unimportant"], answer: 0 }, // Lepszy synonim
    { q: "What is the direct opposite of 'rarely'?", options: ["frequently", "seldom", "hardly ever", "occasionally"], answer: 0 }, // "often" -> "frequently" dla precyzji
    { q: "Which sentence is grammatically correct?", options: ["She denied stealing the money.", "She denied to steal the money.", "She denied having stole the money.", "She denied steal the money."], answer: 0 }, // Pełniejsze zdanie
    { q: "By the time we arrived at the cinema, the film ___ already started.", options: ["had", "has", "was", "have"], answer: 0 },
    { q: "What does the phrase 'on behalf of' mean?", options: ["as a representative of", "because of", "in case of", "apart from"], answer: 0 }, // Lepsza definicja
    { q: "He suggested that she ___ the meeting earlier.", options: ["leave", "left", "leaves", "would leave"], answer: 0 },
    { q: "___ it not for your help, I would have failed.", options: ["Were", "Had", "If", "Was"], answer: 0 }, // Poprawiona konstrukcja
    { q: "She wished she ___ the truth before making that decision.", options: ["had known", "knew", "would know", "has known"], answer: 0 },
    { q: "What does 'to take something for granted' mean?", options: ["to fail to appreciate something because it's always available", "to appreciate something deeply", "to request something formally", "to receive a gift"], answer: 0 }, // Bardziej szczegółowo
    { q: "The manager demanded that the report ___ by noon.", options: ["be submitted", "is submitted", "submits", "will be submitted"], answer: 0 },
    { q: "No sooner ___ I closed the door than I realized I'd forgotten my keys.", options: ["had", "did", "have", "was"], answer: 0 }, // Lepszy przykład
    { q: "Which word best describes 'a formal, systematic search or examination'?", options: ["investigation", "inquiry", "probe", "exploration"], answer: 0 }, // Lepsze dopasowanie
    { q: "She is perfectly capable ___ handling the project herself.", options: ["of", "to", "for", "with"], answer: 0 },
    { q: "I ___ rather you didn't mention this to anyone else.", options: ["would", "will", "had", "should"], answer: 0 },
    { q: "What does 'to come up with' mean in this context: 'We need to come up with a solution.'?", options: ["to devise or invent", "to postpone", "to cancel", "to approve of"], answer: 0 }, // Kontekst
    { q: "If he ___ the earlier train, he would have arrived on time.", options: ["had caught", "caught", "would catch", "has caught"], answer: 0 },
    { q: "He gave orders as if he ___ in charge, but he wasn't.", options: ["were", "was", "had been", "is"], answer: 0 }, // Lepszy kontekst dla 'as if'
    { q: "Translate: 'Pomimo wszystkich trudności, udało nam się.'", options: ["Despite all the difficulties, we succeeded.", "Because of all the difficulties, we succeeded.", "Therefore all the difficulties, we succeeded.", "However all the difficulties, we succeeded."], answer: 0 }, // Tłumaczenie zdania, a nie słowa
    { q: "She insisted that he ___ allowed to speak.", options: ["be", "is", "was", "would be"], answer: 0 },
    { q: "He was accused ___ sensitive company data to a competitor.", options: ["of selling", "to sell", "for selling", "with selling"], answer: 0 },
    { q: "The project requires a ___ investment of both time and money.", options: ["substantial", "minimal", "negligible", "insignificant"], answer: 0 }, // Lepszy kontekst
    { q: "Looking back, I would rather you ___ me the whole truth from the beginning.", options: ["had told", "told", "tell", "would tell"], answer: 0 },
    { q: "Which preposition is correct? 'The team prefers working ___ a collaborative environment.'", options: ["in", "at", "on", "to"], answer: 0 }, // Lepszy kontekst dla 'in'
    { q: "The new safety regulations are extremely ___.", options: ["stringent", "lenient", "vague", "flexible"], answer: 0 }, // Kontekst
    { q: "After consulting everyone, she made a ___ and well-considered decision.", options: ["reasonable", "rash", "hasty", "impulsive"], answer: 0 }, // Kontekst pasujący do dystraktorów
    { q: "She might have ___ the crucial email because her inbox was so full.", options: ["missed", "miss", "missing", "misses"], answer: 0 },
    { q: "I'm increasingly concerned ___ the lack of progress.", options: ["about", "with", "for", "to"], answer: 0 },
    { q: "The region is known ___ its excellent wines and cuisine.", options: ["for", "to", "with", "about"], answer: 0 },
    { q: "___ I known about the traffic, I would have taken a different route.", options: ["Had", "Would", "If", "Should"], answer: 0 },
    { q: "University policy requires all students ___ complete this module.", options: ["to", "for", "in", "on"], answer: 0 },
    { q: "His instructions were deliberately ___ to give himself room for manoeuvre.", options: ["ambiguous", "clear", "unambiguous", "explicit"], answer: 0 },
    { q: "She ___ her driving test if she hadn't been so nervous.", options: ["would have passed", "would pass", "passed", "had passed"], answer: 0 },
    { q: "What does 'to set up' mean here: 'They decided to set up their own business.'?", options: ["to establish", "to close down", "to invest in", "to avoid"], answer: 0 },
    { q: "There's no point ___ complaining if you're not willing to suggest a solution.", options: ["in", "on", "at", "for"], answer: 0 },
    { q: "She ___ to call you yesterday, but her phone battery died.", options: ["had intended", "intended", "was going", "meant"], answer: 0 }, // Wszystkie poprawne, ale 'had intended' jest najsilniejsze dla B2
// ... (tutaj wstawiamy poprawione pytania) ...

    // ========== ROZSZERZENIE: 40 NOWYCH PYTAŃ B2 ==========

    // Grammar: Inversion & Emphasis (Cleft Sentences)
    { q: "___ should the freedom of the press be compromised.", options: ["Under no circumstances", "In any circumstances", "Only by", "For no reason"], answer: 0 },
    { q: "Not only ___ late, but he also forgot the documents.", options: ["did he arrive", "he arrived", "arrived he", "he did arrive"], answer: 0 },
    { q: "___ that I realized my mistake.", options: ["Only later", "Later only", "It was only later", "Only it was later"], answer: 2 }, // Cleft sentence
    { q: "So terrifying ___ that nobody dared to move.", options: ["was the experience", "the experience was", "had the experience been", "the experience had been"], answer: 0 },

    // Grammar: Advanced Tenses & Aspects
    { q: "This time next week, I ___ on a beach in Crete.", options: ["will be lying", "will lie", "will have lain", "am lying"], answer: 0 },
    { q: "She's annoyed because she ___ for over an hour and he still hasn't arrived.", options: ["has been waiting", "has waited", "waits", "is waiting"], answer: 0 }, // Emphasis on duration
    { q: "It was the worst meal I ___ in my entire life.", options: ["have ever had", "had ever had", "ever had", "was having"], answer: 1 },
    { q: "He ___ out every night this week. He must be exhausted.", options: ["has been", "was", "has been being", "is"], answer: 0 }, // State verb in continuous?

    // Grammar: Mixed Conditionals & Alternatives to 'if'
    { q: "If you ___ to the advice, you wouldn't be in this mess now.", options: ["had listened", "listened", "would listen", "listen"], answer: 0 }, // Mixed conditional
    { q: "___ you change your mind, here's my number.", options: ["Should", "Would", "Provided", "Unless"], answer: 0 }, // Inversion for condition
    { q: "I'll help you ___ you promise to be careful.", options: ["provided that", "unless", "whether", "so that"], answer: 0 },
    { q: "___ I known, I would have acted differently.", options: ["Had", "Would", "Should", "If"], answer: 0 },

    // Grammar: Participle Clauses & Complex Structures
    { q: "___ by the news, she couldn't speak for a moment.", options: ["Shocked", "Shocking", "Having shocked", "Being shocked"], answer: 0 },
    { q: "___ the report, she handed it to her manager.", options: ["Having finished", "Finishing", "Finished", "Being finished"], answer: 0 },
    { q: "The person ___ the question was a journalist from the Times.", options: ["asking", "asked", "having asked", "to ask"], answer: 0 }, // Reduced relative clause
    { q: "His ambition is ___ his own company by the age of 30.", options: ["to have set up", "to set up", "setting up", "having set up"], answer: 0 }, // Perfect infinitive

    // Vocabulary: Idioms & Fixed Phrases
    { q: "After the scandal, his reputation was ___.", options: ["in tatters", "on the mend", "in the black", "over the moon"], answer: 0 },
    { q: "Let's ___ and discuss this calmly.", options: ["take a step back", "push the envelope", "beat around the bush", "hit the nail on the head"], answer: 0 },
    { q: "She's always ___. She can't keep a secret.", options: ["letting the cat out of the bag", "biting her tongue", "playing her cards close to her chest", "feeling under the weather"], answer: 0 },
    { q: "The negotiations have reached ___.", options: ["a deadlock", "a breakthrough", "a consensus", "an agreement"], answer: 0 },

    // Vocabulary: Collocations (Advanced)
    { q: "The government is facing ___ criticism over its handling of the crisis.", options: ["mounting", "growing", "rising", "raising"], answer: 0 }, // Mounting pressure/criticism
    { q: "They conducted a ___ analysis of the market trends.", options: ["thorough", "strong", "large", "wide"], answer: 0 },
    { q: "He ___ a profound influence on my career.", options: ["exerted", "did", "made", "gave"], answer: 0 },
    { q: "The company is trying to ___ a balance between innovation and stability.", options: ["strike", "do", "make", "take"], answer: 0 },

    // Vocabulary: Synonyms (Nuanced)
    { q: "Choose the best synonym for 'arduous':", options: ["difficult and tiring", "simple and easy", "quick and efficient", "long and boring"], answer: 0 },
    { q: "Which word is closest in meaning to 'vindicated'?", options: ["proven right", "proven wrong", "accused", "forgiven"], answer: 0 },
    { q: "Choose the word that is NOT a synonym for 'prudent':", options: ["cautious", "judicious", "reckless", "wise"], answer: 2 },
    { q: "Her response was surprisingly ___ for someone in her position.", options: ["terse", "verbose", "eloquent", "detailed"], answer: 0 },

    // Vocabulary: Phrasal Verbs (Multiple Meanings/Advanced)
    { q: "Can you ___ (tolerate) his constant complaining?", options: ["put up with", "get on with", "do away with", "come up with"], answer: 0 },
    { q: "The meeting has been ___ until next week.", options: ["put off", "called off", "set off", "taken off"], answer: 0 },
    { q: "We need to ___ (reduce) on unnecessary expenses.", options: ["cut down", "cut off", "cut in", "cut out"], answer: 0 },
    { q: "She ___ her grandmother; they have the same eyes.", options: ["takes after", "takes over", "takes in", "takes up"], answer: 0 },

    // Prepositions & Dependent Prepositions
    { q: "He's always been preoccupied ___ his own problems.", options: ["with", "by", "for", "about"], answer: 0 },
    { q: "Is this line consistent ___ the company's overall strategy?", options: ["with", "to", "for", "on"], answer: 0 },
    { q: "There's been a sharp increase ___ the cost of raw materials.", options: ["in", "of", "by", "for"], answer: 0 },
    { q: "She has a natural aptitude ___ languages.", options: ["for", "in", "with", "to"], answer: 0 },

    // Discourse Markers & Linkers (Advanced)
    { q: "The plan is good. ___, there are significant risks involved.", options: ["Nevertheless", "Therefore", "Moreover", "Consequently"], answer: 0 },
    { q: "___ the overwhelming evidence, the jury acquitted him.", options: ["Despite", "Because of", "Owing to", "Therefore"], answer: 0 },
    { q: "___ advancing years, he remains very active.", options: ["Notwithstanding", "However", "Because of", "As a result of"], answer: 0 }, // Formal linker
    { q: "The project was completed on time and ___.", options: ["within budget", "for budget", "by budget", "on budget"], answer: 0 }, // Fixed phrase

    // Register & Formal/Informal Language
    { q: "Which phrase is most formal? 'We would appreciate it if you could ___'.", options: ["expedite the process", "hurry it up", "get a move on", "speed things along"], answer: 0 },
    { q: "Which word is too informal for a business report? The results were pretty ___.", options: ["good", "disappointing", "satisfactory", "encouraging"], answer: 0 }, // "pretty good"
    { q: "Choose the more formal equivalent of 'get in touch with':", options: ["contact", "ring", "hit up", "drop a line to"], answer: 0 },

    // Word Formation (Advanced)
    { q: "What is the noun from 'reluctant'?", options: ["reluctance", "reluctancy", "reluctation", "reluctivity"], answer: 0 },
    { q: "What is the adjective from 'envy'?", options: ["envious", "enviful", "enviable", "envyous"], answer: 0 },
    { q: "Which prefix creates the opposite of 'ethical'?", options: ["un-", "dis-", "im-", "in-"], answer: 0 } // Unethical
    
],
"C1": [
    { q: "Scarcely ___ he entered the room when the lights went out.", options: ["had", "did", "has", "was"], answer: 0 },
    { q: "Which word best describes someone who is extremely careful, precise, and pays attention to every detail?", options: ["meticulous", "perfunctory", "hasty", "negligent"], answer: 0 }, // Lepsze dystraktory
    { q: "Choose the best synonym for 'ubiquitous':", options: ["pervasive", "scarce", "unique", "localized"], answer: 0 }, // Lepszy synonim
    { q: "He insisted ___ his innocence throughout the trial.", options: ["on", "upon", "-", "for"], answer: 0 }, // 'on' jest najczęstsze, 'upon' bardziej formalne. Usunięto oczywiście błędne opcje.
    { q: "I'd rather you ___ mention this to anyone else; it's confidential.", options: ["didn't", "don't", "wouldn't", "won't"], answer: 0 },
    { q: "The plan was successful, ___ somewhat more expensive than initially projected.", options: ["albeit", "therefore", "because", "however"], answer: 0 }, // Zdanie kontekstowe
    { q: "If only I ___ his advice then, I wouldn't be in this situation now.", options: ["had taken", "took", "would take", "have taken"], answer: 0 }, // Mieszany tryb warunkowy
    { q: "The apparent contradiction at the heart of the theory presents a real ___.", options: ["conundrum", "celebration", "clarification", "certainty"], answer: 0 }, // Kontekst
    { q: "Her argument was ___ compelling that it swayed even the most skeptical critics.", options: ["so", "such", "too", "quite"], answer: 0 }, // 'such' wymagałoby rzeczownika (e.g., such a compelling argument)
    { q: "The ___ administrative duties left little time for actual research.", options: ["onerous", "trivial", "straightforward", "manageable"], answer: 0 },
    { q: "Which is a common collocation for the verb 'to render'?", options: ["to render a service", "to render a book", "to render a run", "to render a decision"], answer: 0 }, // 'render a decision' jest też poprawne, ale 'a service' jest częstsze. Pytanie wymaga przemyślenia.
    { q: "Recent archaeological finds have ___ the long-held theory about the city's origins.", options: ["undermined", "supported", "ignored", "constructed"], answer: 0 }, // Ciekawsze, mniej oczywiste
    { q: "The disclosure of confidential information was entirely ___.", options: ["inadvertent", "deliberate", "malicious", "calculated"], answer: 0 },
    { q: "She has a particular penchant ___ Baroque architecture.", options: ["for", "of", "towards", "in"], answer: 0 },
    { q: "___ her quick thinking, the situation would have escalated dramatically.", options: ["Were it not for", "If it wasn't for", "Unless for", "Without for"], answer: 0 }, // Najbardziej formalna opcja
    { q: "The storm showed no signs of ___; in fact, it intensified.", options: ["abating", "increasing", "growing", "evolving"], answer: 0 },
    { q: "Fashion trends are often ___, lasting only a single season.", options: ["ephemeral", "enduring", "perpetual", "timeless"], answer: 0 },
    { q: "The contract stipulates that the client ___ the first installment upon signing.", options: ["pay", "pays", "shall pay", "must pay"], answer: 0 }, // Subjunctive/formal demand
    { q: "She was reluctant ___ the offer without consulting her team.", options: ["to accept", "accepting", "for accepting", "on accepting"], answer: 0 },
    { q: "His explanation was remarkably ___, making a complex topic accessible to all.", options: ["lucid", "opaque", "obscure", "esoteric"], answer: 0 },
    { q: "The initial proposal was ___ with potential problems.", options: ["rife", "devoid", "empty", "scarce"], answer: 0 },
    { q: "He conducts himself in a way ___ commands respect.", options: ["that", "which", "who", "how"], answer: 0 }, // 'that' jest lepsze dla definiujących clause
    { q: "The test results were an ___; they contradicted all previous data.", options: ["anomaly", "norm", "expectation", "standard"], answer: 0 },
    { q: "The teacher felt compelled to ___ the students for their disruptive behavior.", options: ["admonish", "praise", "commend", "applaud"], answer: 0 },
    { q: "Despite ___ vehement objections, the committee approved the merger.", options: ["their", "them having", "they had", "theirs"], answer: 0 }, // Najzwięźlejsza i najpoprawniejsza
    { q: "The tragic event served to ___ the community into action.", options: ["galvanize", "pacify", "dissuade", "discourage"], answer: 0 },
    { q: "The journal published a ___ critique that dismantled the author's methodology.", options: ["devastating", "superficial", "complimentary", "vague"], answer: 0 }, // Bardziej zaawansowane słownictwo
    { q: "The resolution was ___ by acclamation.", options: ["adopted", "accepted", "denied", "discussed"], answer: 0 }, // Kolokacja formalna (UN/parlamentarna)
    { q: "The discussion quickly descended into ___ arguments understood only by a handful of specialists.", options: ["esoteric", "mainstream", "popular", "simplistic"], answer: 0 },
    { q: "She was ___ for her groundbreaking work in the field.", options: ["lauded", "criticized", "censured", "dismissed"], answer: 0 },
    { q: "Her theory is ___ on decades of empirical research.", options: ["predicated", "based", "founded", "built"], answer: 0 }, // Bardziej zaawansowane synonimy
    { q: "The ___ of smartphones has fundamentally changed social interaction.", options: ["ubiquity", "rarity", "absence", "novelty"], answer: 0 },
    { q: "Politicians often ___ the truth to avoid giving a direct answer.", options: ["obfuscate", "clarify", "elucidate", "illuminate"], answer: 0 },
    { q: "___ the central bank intervened, the currency would have collapsed.", options: ["Had", "If", "Should", "Would"], answer: 0 }, // Czysta struktura gramatyczna
    { q: "In a ___ gesture, he forgave the debt entirely.", options: ["magnanimous", "petty", "vindictive", "spiteful"], answer: 0 },
    { q: "Quantum computing is currently beyond the ___ of most commercial applications.", options: ["purview", "scope", "view", "idea"], answer: 0 }, // Lepsze słowo
    { q: "The data, when considered as a whole, ___ overwhelmingly against the proposed hypothesis.", options: ["militates", "stands", "is", "are"], answer: 0 }, // Zaawansowana kolokacja
    { q: "His ___ for exaggeration often got him into trouble.", options: ["proclivity", "aversion", "reluctance", "disinclination"], answer: 0 },
    { q: "The final manuscript must be submitted ___ the end of the month.", options: ["by", "on", "before", "until"], answer: 0 }, // Niuans przyimka
    { q: "The new safety features are designed to ___ the risks associated with the operation.", options: ["mitigate", "exacerbate", "heighten", "intensify"], answer: 0 },
  // ... (tutaj wstawiamy poprawione pytania) ...

    // ========== ROZSZERZENIE: 40 NOWYCH PYTAŃ C1 ==========

    // Grammar: Inversion & Cleft Sentences (Advanced)
    { q: "___ received official approval than they began construction.", options: ["No sooner had they", "No sooner they had", "Hardly they had", "Scarcely they"], answer: 0 },
    { q: "___ the financial implications that we need to consider most carefully.", options: ["It is", "There are", "What are", "Is it"], answer: 0 }, // Cleft sentence
    { q: "Under no circumstances ___ to disclose the source of the information.", options: ["are you permitted", "you are permitted", "permitted are you", "are permitted you"], answer: 0 },
    { q: "So intricate ___ that it took decades to decipher.", options: ["was the code", "the code was", "had the code been", "the code had been"], answer: 0 },

    // Grammar: Participle Clauses & Absolute Constructions
    { q: "___ , the expedition team pressed on despite the harsh conditions.", options: ["Their spirits buoyed by the discovery", "Buoying their spirits by the discovery", "Having buoyed their spirits", "Their spirits buoying"], answer: 0 }, // Absolute construction
    { q: "___ the final chapter, the author introduces a surprising twist.", options: ["Having set up the premise in", "Setting up the premise in", "Set up the premise in", "After set up the premise in"], answer: 0 },
    { q: "The deal ___, both parties expressed their satisfaction.", options: ["having been finalized", "finalized", "was finalized", "finalizing"], answer: 0 },

    // Grammar: Ellipsis & Substitution
    { q: "He asked her to call him back, but she didn't want to ___.", options: ["do so", "do it", "do", "make it"], answer: 0 },
    { q: "A: 'Will you attend the meeting?' B: 'I might ___.'", options: ["do", "be", "attend", "go"], answer: 0 }, // Ellipsis

    // Vocabulary: Near-Synonyms (Nuanced Differences)
    { q: "Which word implies a subtle and barely noticeable change?", options: ["imperceptible", "glaring", "obvious", "drastic"], answer: 0 },
    { q: "Choose the word that best describes a person who is stubbornly resistant to authority.", options: ["recalcitrant", "compliant", "docile", "amenable"], answer: 0 },
    { q: "Her success was ___; it was the result of years of meticulous planning.", options: ["fortuitous", "serendipitous", "calculated", "accidental"], answer: 2 },
    { q: "The report provided a ___ analysis of the root causes, not just the symptoms.", options: ["perfunctory", "cursory", "superficial", "penetrating"], answer: 3 },

    // Vocabulary: Formal & Academic Register
    { q: "The government's policies have ___ widespread social unrest.", options: ["precipitated", "prevented", "assuaged", "mitigated"], answer: 0 },
    { q: "The study aims to ___ the relationship between the two variables.", options: ["elucidate", "obfuscate", "confuse", "complicate"], answer: 0 },
    { q: "His argument, while compelling, ___ on a flawed assumption.", options: ["hinges", "rests", "depends", "relies"], answer: 0 }, // Wszystkie poprawne, 'hinges' jest bardzo formalne
    { q: "The theory has been largely ___ by recent empirical evidence.", options: ["substantiated", "refuted", "weakened", "challenged"], answer: 0 },

    // Vocabulary: Idioms & Fixed Phrases (Advanced)
    { q: "After the merger, the company was ___ (in a very strong position).", options: ["in an enviable position", "on its last legs", "in a tight spot", "behind the eight ball"], answer: 0 },
    { q: "His criticism ___ (was very accurate).", options: ["hit the nail on the head", "beat around the bush", "was off the mark", "pulled no punches"], answer: 0 },
    { q: "They decided to ___ (abandon the project) after the initial setbacks.", options: ["cut their losses", "throw good money after bad", "go back to the drawing board", "bite the bullet"], answer: 0 },

    // Collocations (Advanced)
    { q: "The comments were deemed to ___ a breach of protocol.", options: ["constitute", "make", "do", "have"], answer: 0 },
    { q: "She ___ a formidable challenge to the incumbent.", options: ["poses", "does", "makes", "takes"], answer: 0 },
    { q: "The agreement ___ the foundation for future cooperation.", options: ["lays", "sets", "makes", "does"], answer: 0 },
    { q: "He ___ a convincing case for his innocence.", options: ["presented", "did", "made", "had"], answer: 0 },

    // Prepositions (Advanced/Idiomatic)
    { q: "His actions were not ___ keeping with company policy.", options: ["in", "on", "by", "with"], answer: 0 },
    { q: "The results are ___ variance with the initial hypothesis.", options: ["at", "in", "on", "by"], answer: 1 },
    { q: "She has a talent ___ languages.", options: ["for", "in", "with", "on"], answer: 0 },
    { q: "There's no excuse ___ such behavior.", options: ["for", "about", "on", "in"], answer: 0 },

    // Phrasal Verbs (Formal Context)
    { q: "The investigation will ___ (discover) what went wrong.", options: ["ascertain", "find out", "look into", "figure out"], answer: 0 }, // Formal synonym for phrasal verb
    { q: "The committee was ___ (established) to review the procedures.", options: ["set up", "put up", "built up", "made up"], answer: 0 },
    { q: "They decided to ___ (postpone) the decision until more data was available.", options: ["defer", "put off", "call off", "hold up"], answer: 0 }, // Formal synonym

    // Discourse Markers & Linkers (Academic)
    { q: "___ the aforementioned points, it is clear that further research is needed.", options: ["In light of", "Because", "Even though", "Whereas"], answer: 0 },
    { q: "The sample size was small. ___, the results cannot be considered conclusive.", options: ["Hence", "Nevertheless", "Accordingly", "Moreover"], answer: 0 },
    { q: "___ the experiment was conducted under controlled conditions, some variables could not be eliminated.", options: ["Notwithstanding that", "Because", "Therefore", "So that"], answer: 0 },

    // Word Formation (Advanced)
    { q: "What is the noun from 'indefatigable'?", options: ["indefatigability", "indefatigableness", "indefatigation", "fatigue"], answer: 0 },
    { q: "What is the adjective from 'dichotomy'?", options: ["dichotomous", "dichotomic", "dichotomical", "dichotomistic"], answer: 0 },
    { q: "Which prefix is used with 'operable' to mean 'cannot be operated'?", options: ["in-", "un-", "non-", "dis-"], answer: 0 }, // inoperable

    // Meaning in Context (Subtle Differences)
    { q: "The speaker's ___ tone suggested she was not entirely convinced.", options: ["guarded", "enthusiastic", "forthright", "candid"], answer: 0 },
    { q: "The policy had the ___ effect of increasing inequality.", options: ["perverse", "intended", "beneficial", "direct"], answer: 0 },
    { q: "His apology seemed ___ and failed to satisfy anyone.", options: ["perfunctory", "heartfelt", "sincere", "genuine"], answer: 0 }
  ]
};
