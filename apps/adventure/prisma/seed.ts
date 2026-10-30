import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Uses Turso/libSQL when TURSO_DATABASE_URL is set, else DATABASE_URL SQLite (Docker/local, unchanged).
// Kept self-contained (no ../src import) because the Docker runner image only ships ./prisma.
const prisma = process.env.TURSO_DATABASE_URL
  ? new PrismaClient({
      adapter: new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN || undefined,
      }),
    })
  : new PrismaClient();

type SeedItem = {
  prompt: string;
  kind: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type SeedSkill = {
  pillar: string;
  slug: string;
  title: string;
  description: string;
  gradeBand: string;
  sortOrder: number;
  prerequisiteSlug?: string;
  items: SeedItem[];
};

const skills: SeedSkill[] = [
  {
    pillar: "phonemic_awareness",
    slug: "rhyme-time",
    title: "Rhyme Time",
    description: "Hear and match words that rhyme.",
    gradeBand: "K-1",
    sortOrder: 1,
    items: [
      {
        prompt: "Which word rhymes with cat?",
        kind: "choice",
        options: ["dog", "hat", "sun", "map"],
        correctAnswer: "hat",
        explanation: "Cat and hat both end with the /at/ sound.",
      },
      {
        prompt: "Which word rhymes with cake?",
        kind: "choice",
        options: ["lake", "cup", "bed", "frog"],
        correctAnswer: "lake",
        explanation: "Cake and lake share the long-a /ake/ ending.",
      },
      {
        prompt: "Which word rhymes with tree?",
        kind: "choice",
        options: ["truck", "bee", "ball", "run"],
        correctAnswer: "bee",
        explanation: "Tree and bee both end with the long-e sound.",
      },
      {
        prompt: "Which word rhymes with hop?",
        kind: "choice",
        options: ["stop", "ship", "heat", "moon"],
        correctAnswer: "stop",
        explanation: "Hop and stop both end with /op/.",
      },
      {
        prompt: "Which word rhymes with light?",
        kind: "choice",
        options: ["night", "lamp", "log", "nest"],
        correctAnswer: "night",
        explanation: "Light and night share the /ight/ ending.",
      },
      {
        prompt: "Which word rhymes with spoon?",
        kind: "choice",
        options: ["moon", "spin", "soap", "pen"],
        correctAnswer: "moon",
        explanation: "Spoon and moon both end with /oon/.",
      },
      {
        prompt: "Which word rhymes with red?",
        kind: "choice",
        options: ["bed", "ride", "rock", "rain"],
        correctAnswer: "bed",
        explanation: "Red and bed both end with /ed/.",
      },
      {
        prompt: "Which word rhymes with star?",
        kind: "choice",
        options: ["car", "step", "sit", "soap"],
        correctAnswer: "car",
        explanation: "Star and car both end with /ar/.",
      },
      {
        prompt: "Which word rhymes with pig?",
        kind: "choice",
        options: ["dig", "pan", "pot", "pen"],
        correctAnswer: "dig",
        explanation: "Pig and dig both end with /ig/.",
      },
      {
        prompt: "Which word rhymes with blue?",
        kind: "choice",
        options: ["glue", "black", "boat", "bell"],
        correctAnswer: "glue",
        explanation: "Blue and glue share the /oo/ ending sound.",
      },
    ],
  },
  {
    pillar: "phonemic_awareness",
    slug: "first-sounds",
    title: "First Sounds",
    description: "Identify the beginning sound in a spoken word.",
    gradeBand: "K-1",
    sortOrder: 2,
    prerequisiteSlug: "rhyme-time",
    items: [
      {
        prompt: "What is the first sound in sun?",
        kind: "choice",
        options: ["/s/", "/m/", "/t/", "/p/"],
        correctAnswer: "/s/",
        explanation: "Sun begins with /s/.",
      },
      {
        prompt: "What is the first sound in map?",
        kind: "choice",
        options: ["/m/", "/n/", "/b/", "/k/"],
        correctAnswer: "/m/",
        explanation: "Map begins with /m/.",
      },
      {
        prompt: "What is the first sound in dog?",
        kind: "choice",
        options: ["/d/", "/g/", "/t/", "/b/"],
        correctAnswer: "/d/",
        explanation: "Dog begins with /d/.",
      },
      {
        prompt: "What is the first sound in fish?",
        kind: "choice",
        options: ["/f/", "/sh/", "/p/", "/v/"],
        correctAnswer: "/f/",
        explanation: "Fish begins with /f/.",
      },
      {
        prompt: "What is the first sound in lion?",
        kind: "choice",
        options: ["/l/", "/n/", "/w/", "/r/"],
        correctAnswer: "/l/",
        explanation: "Lion begins with /l/.",
      },
      {
        prompt: "What is the first sound in kite?",
        kind: "choice",
        options: ["/k/", "/t/", "/s/", "/n/"],
        correctAnswer: "/k/",
        explanation: "Kite begins with /k/.",
      },
      {
        prompt: "What is the first sound in nest?",
        kind: "choice",
        options: ["/n/", "/m/", "/s/", "/t/"],
        correctAnswer: "/n/",
        explanation: "Nest begins with /n/.",
      },
      {
        prompt: "What is the first sound in rabbit?",
        kind: "choice",
        options: ["/r/", "/b/", "/w/", "/d/"],
        correctAnswer: "/r/",
        explanation: "Rabbit begins with /r/.",
      },
      {
        prompt: "What is the first sound in apple?",
        kind: "choice",
        options: ["/a/", "/p/", "/e/", "/i/"],
        correctAnswer: "/a/",
        explanation: "Apple begins with the short /a/ sound.",
      },
      {
        prompt: "What is the first sound in zebra?",
        kind: "choice",
        options: ["/z/", "/s/", "/v/", "/j/"],
        correctAnswer: "/z/",
        explanation: "Zebra begins with /z/.",
      },
    ],
  },
  {
    pillar: "phonemic_awareness",
    slug: "blend-sounds",
    title: "Blend the Sounds",
    description: "Put separate sounds together to make a word.",
    gradeBand: "K-1",
    sortOrder: 3,
    prerequisiteSlug: "first-sounds",
    items: [
      {
        prompt: "Blend /c/ /a/ /t/. What word?",
        kind: "choice",
        options: ["cat", "cot", "cap", "cut"],
        correctAnswer: "cat",
        explanation: "/c/ /a/ /t/ blends to cat.",
      },
      {
        prompt: "Blend /p/ /i/ /g/. What word?",
        kind: "choice",
        options: ["pig", "peg", "pug", "pin"],
        correctAnswer: "pig",
        explanation: "/p/ /i/ /g/ blends to pig.",
      },
      {
        prompt: "Blend /s/ /u/ /n/. What word?",
        kind: "choice",
        options: ["sun", "sin", "son", "sap"],
        correctAnswer: "sun",
        explanation: "/s/ /u/ /n/ blends to sun.",
      },
      {
        prompt: "Blend /b/ /e/ /d/. What word?",
        kind: "choice",
        options: ["bed", "bad", "bid", "bud"],
        correctAnswer: "bed",
        explanation: "/b/ /e/ /d/ blends to bed.",
      },
      {
        prompt: "Blend /h/ /o/ /p/. What word?",
        kind: "choice",
        options: ["hop", "hip", "hat", "hut"],
        correctAnswer: "hop",
        explanation: "/h/ /o/ /p/ blends to hop.",
      },
      {
        prompt: "Blend /m/ /o/ /p/. What word?",
        kind: "choice",
        options: ["mop", "map", "mug", "man"],
        correctAnswer: "mop",
        explanation: "/m/ /o/ /p/ blends to mop.",
      },
      {
        prompt: "Blend /f/ /i/ /n/. What word?",
        kind: "choice",
        options: ["fin", "fan", "fun", "fog"],
        correctAnswer: "fin",
        explanation: "/f/ /i/ /n/ blends to fin.",
      },
      {
        prompt: "Blend /r/ /u/ /g/. What word?",
        kind: "choice",
        options: ["rug", "rag", "rig", "run"],
        correctAnswer: "rug",
        explanation: "/r/ /u/ /g/ blends to rug.",
      },
      {
        prompt: "Blend /t/ /e/ /n/. What word?",
        kind: "choice",
        options: ["ten", "tan", "tin", "ton"],
        correctAnswer: "ten",
        explanation: "/t/ /e/ /n/ blends to ten.",
      },
      {
        prompt: "Blend /d/ /u/ /ck/. What word?",
        kind: "choice",
        options: ["duck", "dock", "deck", "dark"],
        correctAnswer: "duck",
        explanation: "/d/ /u/ /ck/ blends to duck.",
      },
    ],
  },
  {
    pillar: "phonics",
    slug: "short-a",
    title: "Short A Words",
    description: "Read and match short-a CVC words.",
    gradeBand: "K-1",
    sortOrder: 1,
    items: [
      {
        prompt: "Which word is spelled with short a like in apple?",
        kind: "choice",
        options: ["cat", "kite", "cone", "cute"],
        correctAnswer: "cat",
        explanation: "Cat has the short /a/ vowel sound.",
      },
      {
        prompt: "Which letter makes the middle sound in hat?",
        kind: "choice",
        options: ["a", "e", "i", "o"],
        correctAnswer: "a",
        explanation: "Hat is h-a-t with short a in the middle.",
      },
      {
        prompt: "Choose the word that matches /m/ /a/ /p/.",
        kind: "choice",
        options: ["map", "mop", "mud", "mad"],
        correctAnswer: "map",
        explanation: "Map uses short a.",
      },
      {
        prompt: "Which word has the same vowel sound as bag?",
        kind: "choice",
        options: ["sad", "seed", "soap", "soup"],
        correctAnswer: "sad",
        explanation: "Bag and sad both have short a.",
      },
      {
        prompt: "Pick the short-a word.",
        kind: "choice",
        options: ["pan", "pine", "poke", "peel"],
        correctAnswer: "pan",
        explanation: "Pan is a short-a CVC word.",
      },
      {
        prompt: "Which word ends with /at/?",
        kind: "choice",
        options: ["mat", "met", "mit", "mut"],
        correctAnswer: "mat",
        explanation: "Mat ends with the -at pattern.",
      },
      {
        prompt: "Choose the correct spelling for /r/ /a/ /t/.",
        kind: "choice",
        options: ["rat", "rot", "rut", "ret"],
        correctAnswer: "rat",
        explanation: "Rat uses r-a-t.",
      },
      {
        prompt: "Which word has short a in the middle?",
        kind: "choice",
        options: ["jam", "jeep", "joke", "june"],
        correctAnswer: "jam",
        explanation: "Jam has short a.",
      },
      {
        prompt: "Pick the word that rhymes with man and uses short a.",
        kind: "choice",
        options: ["can", "cone", "coin", "cane"],
        correctAnswer: "can",
        explanation: "Can is a short-a rhyme for man.",
      },
      {
        prompt: "Which word is a short-a animal?",
        kind: "choice",
        options: ["bat", "bee", "boat", "bear"],
        correctAnswer: "bat",
        explanation: "Bat is a short-a CVC word.",
      },
    ],
  },
  {
    pillar: "phonics",
    slug: "short-i",
    title: "Short I Words",
    description: "Practice short-i CVC patterns after short a.",
    gradeBand: "K-1",
    sortOrder: 2,
    prerequisiteSlug: "short-a",
    items: [
      {
        prompt: "Which word has the short i sound?",
        kind: "choice",
        options: ["sit", "seat", "soap", "same"],
        correctAnswer: "sit",
        explanation: "Sit has short /i/.",
      },
      {
        prompt: "Choose the word for /p/ /i/ /g/.",
        kind: "choice",
        options: ["pig", "peg", "pug", "pag"],
        correctAnswer: "pig",
        explanation: "Pig uses short i.",
      },
      {
        prompt: "Which word rhymes with fin?",
        kind: "choice",
        options: ["pin", "pan", "pen", "pun"],
        correctAnswer: "pin",
        explanation: "Fin and pin share short i and -in.",
      },
      {
        prompt: "Pick the short-i word.",
        kind: "choice",
        options: ["lid", "load", "laid", "loud"],
        correctAnswer: "lid",
        explanation: "Lid is a short-i CVC word.",
      },
      {
        prompt: "Which letter makes the middle sound in dig?",
        kind: "choice",
        options: ["i", "a", "e", "o"],
        correctAnswer: "i",
        explanation: "Dig is d-i-g.",
      },
      {
        prompt: "Choose /w/ /i/ /n/.",
        kind: "choice",
        options: ["win", "won", "wan", "wen"],
        correctAnswer: "win",
        explanation: "Win uses short i.",
      },
      {
        prompt: "Which word has the same vowel as six?",
        kind: "choice",
        options: ["mix", "max", "mux", "mox"],
        correctAnswer: "mix",
        explanation: "Six and mix both have short i.",
      },
      {
        prompt: "Pick the short-i animal sound word.",
        kind: "choice",
        options: ["chick", "chair", "cheese", "choir"],
        correctAnswer: "chick",
        explanation: "Chick has the short i sound.",
      },
      {
        prompt: "Which word ends with /ip/?",
        kind: "choice",
        options: ["sip", "sap", "sop", "sup"],
        correctAnswer: "sip",
        explanation: "Sip ends with -ip.",
      },
      {
        prompt: "Choose the correct spelling for /b/ /i/ /g/.",
        kind: "choice",
        options: ["big", "bag", "bog", "bug"],
        correctAnswer: "big",
        explanation: "Big is b-i-g.",
      },
    ],
  },
  {
    pillar: "fluency",
    slug: "smooth-sentences",
    title: "Smooth Sentences",
    description: "Choose the sentence that would sound smoothest when read aloud.",
    gradeBand: "K-1",
    sortOrder: 1,
    items: [
      {
        prompt: "Which sentence is easiest to read smoothly?",
        kind: "choice",
        options: [
          "The cat sat on the mat.",
          "Cat the mat sat on the.",
          "On sat cat the mat the.",
          "Mat cat the on sat.",
        ],
        correctAnswer: "The cat sat on the mat.",
        explanation: "Natural word order helps fluent reading.",
      },
      {
        prompt: "Which line would you read with a pause at the period?",
        kind: "choice",
        options: [
          "Sam can hop. Sam can run.",
          "Sam can hop Sam can run",
          "Sam. can hop Sam can run",
          "Sam can. hop Sam. can run",
        ],
        correctAnswer: "Sam can hop. Sam can run.",
        explanation: "Periods mark places to pause.",
      },
      {
        prompt: "Which sentence sounds like talking?",
        kind: "choice",
        options: [
          "I see a big red ball.",
          "Ball red big a see I.",
          "See I ball a big red.",
          "Big I see red a ball.",
        ],
        correctAnswer: "I see a big red ball.",
        explanation: "Fluent reading mirrors natural speech.",
      },
      {
        prompt: "Pick the sentence with clear phrasing.",
        kind: "choice",
        options: [
          "We can go to the park.",
          "We can go to the. park",
          "We. can go to the park",
          "We can. go to the park.",
        ],
        correctAnswer: "We can go to the park.",
        explanation: "Keep related words together as you read.",
      },
      {
        prompt: "Which sentence should end with an excited voice?",
        kind: "choice",
        options: [
          "We won the game!",
          "We won the game.",
          "We won the game?",
          "We won the game,",
        ],
        correctAnswer: "We won the game!",
        explanation: "Exclamation points cue energetic expression.",
      },
      {
        prompt: "Choose the smoothest reading of a list.",
        kind: "choice",
        options: [
          "I pack a hat, a book, and a snack.",
          "I pack a hat a book and a snack.",
          "I pack a, hat a, book and a snack.",
          "I pack a hat and a book a snack.",
        ],
        correctAnswer: "I pack a hat, a book, and a snack.",
        explanation: "Commas help you phrase a list.",
      },
      {
        prompt: "Which sentence asks a question?",
        kind: "choice",
        options: [
          "Where is my coat?",
          "Where is my coat.",
          "Where is my coat!",
          "Where is my coat,",
        ],
        correctAnswer: "Where is my coat?",
        explanation: "Question marks cue a rising voice.",
      },
      {
        prompt: "Pick the sentence that would sound choppy if you paused after every word.",
        kind: "choice",
        options: [
          "The little puppy ran fast.",
          "The. little. puppy. ran. fast.",
          "The little puppy. ran fast.",
          "The little, puppy ran fast.",
        ],
        correctAnswer: "The. little. puppy. ran. fast.",
        explanation: "Fluent reading groups words, not every single word.",
      },
      {
        prompt: "Which line is ready for a smooth read-aloud?",
        kind: "choice",
        options: [
          "Mom and I bake muffins.",
          "Mom and I bake. muffins",
          "Mom and. I bake muffins.",
          "Mom and I. bake muffins",
        ],
        correctAnswer: "Mom and I bake muffins.",
        explanation: "Keep the idea together until the end.",
      },
      {
        prompt: "Choose the sentence with helpful punctuation for fluency.",
        kind: "choice",
        options: [
          "Stop! Look both ways.",
          "Stop look both ways",
          "Stop look. both ways!",
          "Stop look both? ways",
        ],
        correctAnswer: "Stop! Look both ways.",
        explanation: "Punctuation guides phrasing and expression.",
      },
    ],
  },
  {
    pillar: "vocabulary",
    slug: "word-meanings",
    title: "Word Meanings",
    description: "Match kid-friendly words to everyday meanings.",
    gradeBand: "K-1",
    sortOrder: 1,
    items: [
      {
        prompt: "What does tiny mean?",
        kind: "choice",
        options: ["very small", "very loud", "very fast", "very cold"],
        correctAnswer: "very small",
        explanation: "Tiny means very small.",
      },
      {
        prompt: "What does giggle mean?",
        kind: "choice",
        options: ["a little laugh", "a big yell", "a long sleep", "a quick run"],
        correctAnswer: "a little laugh",
        explanation: "A giggle is a light laugh.",
      },
      {
        prompt: "What does soak mean?",
        kind: "choice",
        options: ["get very wet", "get very dry", "get very hot", "get very dark"],
        correctAnswer: "get very wet",
        explanation: "To soak is to get thoroughly wet.",
      },
      {
        prompt: "What does peek mean?",
        kind: "choice",
        options: ["look quickly", "jump high", "eat slowly", "sing loudly"],
        correctAnswer: "look quickly",
        explanation: "Peek means to take a quick look.",
      },
      {
        prompt: "What does cozy mean?",
        kind: "choice",
        options: ["warm and snug", "cold and wet", "loud and busy", "hard and sharp"],
        correctAnswer: "warm and snug",
        explanation: "Cozy describes a warm, comfortable feeling.",
      },
      {
        prompt: "What does dash mean?",
        kind: "choice",
        options: ["run quickly", "walk slowly", "sit quietly", "talk softly"],
        correctAnswer: "run quickly",
        explanation: "Dash means to move fast.",
      },
      {
        prompt: "What does gentle mean?",
        kind: "choice",
        options: ["soft and careful", "rough and loud", "sharp and fast", "heavy and hard"],
        correctAnswer: "soft and careful",
        explanation: "Gentle means kind and careful.",
      },
      {
        prompt: "What does enormous mean?",
        kind: "choice",
        options: ["very big", "very small", "very quiet", "very short"],
        correctAnswer: "very big",
        explanation: "Enormous means extremely large.",
      },
      {
        prompt: "What does polish mean?",
        kind: "choice",
        options: ["make shiny", "make sticky", "make muddy", "make broken"],
        correctAnswer: "make shiny",
        explanation: "To polish is to rub something until it shines.",
      },
      {
        prompt: "What does whisper mean?",
        kind: "choice",
        options: ["speak very softly", "shout loudly", "sing high", "talk fast"],
        correctAnswer: "speak very softly",
        explanation: "A whisper is a quiet voice.",
      },
    ],
  },
  {
    pillar: "comprehension",
    slug: "who-what",
    title: "Who and What",
    description: "Answer simple who/what questions about short texts.",
    gradeBand: "K-1",
    sortOrder: 1,
    items: [
      {
        prompt: 'Read: "Mia put on her red boots." Who put on boots?',
        kind: "choice",
        options: ["Mia", "Mom", "Max", "the cat"],
        correctAnswer: "Mia",
        explanation: "The sentence says Mia put on her boots.",
      },
      {
        prompt: 'Read: "The dog chased a yellow ball." What did the dog chase?',
        kind: "choice",
        options: ["a yellow ball", "a red truck", "a blue bird", "a green leaf"],
        correctAnswer: "a yellow ball",
        explanation: "The dog chased a yellow ball.",
      },
      {
        prompt: 'Read: "Ben eats an apple at snack." What does Ben eat?',
        kind: "choice",
        options: ["an apple", "a cookie", "a sandwich", "a pear"],
        correctAnswer: "an apple",
        explanation: "Ben eats an apple.",
      },
      {
        prompt: 'Read: "Lila waters the garden." Who waters the garden?',
        kind: "choice",
        options: ["Lila", "Leo", "Dad", "the dog"],
        correctAnswer: "Lila",
        explanation: "Lila is the who in the sentence.",
      },
      {
        prompt: 'Read: "Sam rides the blue bike." What does Sam ride?',
        kind: "choice",
        options: ["the blue bike", "the red sled", "the green bus", "the yellow car"],
        correctAnswer: "the blue bike",
        explanation: "Sam rides the blue bike.",
      },
      {
        prompt: 'Read: "Ava finds a shell at the beach." Where is Ava?',
        kind: "choice",
        options: ["at the beach", "at school", "at the store", "at home"],
        correctAnswer: "at the beach",
        explanation: "The sentence says Ava is at the beach.",
      },
      {
        prompt: 'Read: "The bird sings in the morning." When does the bird sing?',
        kind: "choice",
        options: ["in the morning", "at night", "at noon", "in winter only"],
        correctAnswer: "in the morning",
        explanation: "The bird sings in the morning.",
      },
      {
        prompt: 'Read: "Omar packs a lunch for the trip." What does Omar pack?',
        kind: "choice",
        options: ["a lunch", "a tent", "a toy", "a coat"],
        correctAnswer: "a lunch",
        explanation: "Omar packs a lunch.",
      },
      {
        prompt: 'Read: "The kitten hid under the chair." Where did the kitten hide?',
        kind: "choice",
        options: ["under the chair", "on the bed", "in the box", "by the door"],
        correctAnswer: "under the chair",
        explanation: "The kitten hid under the chair.",
      },
      {
        prompt: 'Read: "Nora shared her crayons with Eli." Who shared crayons?',
        kind: "choice",
        options: ["Nora", "Eli", "the teacher", "Mom"],
        correctAnswer: "Nora",
        explanation: "Nora is the one who shared.",
      },
    ],
  },
  {
    pillar: "comprehension",
    slug: "story-order",
    title: "Story Order",
    description: "Put simple story events in beginning-middle-end order.",
    gradeBand: "1-2",
    sortOrder: 2,
    prerequisiteSlug: "who-what",
    items: [
      {
        prompt: "A seed is planted, a sprout grows, then a flower blooms. What happens last?",
        kind: "choice",
        options: ["A flower blooms", "A seed is planted", "A sprout grows", "Rain falls"],
        correctAnswer: "A flower blooms",
        explanation: "Blooming is the end of the sequence.",
      },
      {
        prompt: "Jen wakes up, brushes teeth, then eats breakfast. What happens first?",
        kind: "choice",
        options: ["Jen wakes up", "Jen eats breakfast", "Jen brushes teeth", "Jen goes to school"],
        correctAnswer: "Jen wakes up",
        explanation: "Waking up starts the morning.",
      },
      {
        prompt: "Clouds gather, rain falls, then a puddle forms. What is the middle?",
        kind: "choice",
        options: ["Rain falls", "Clouds gather", "A puddle forms", "The sun sets"],
        correctAnswer: "Rain falls",
        explanation: "Rain comes after clouds and before puddles.",
      },
      {
        prompt: "Theo mixes batter, pours cups, then bakes muffins. What comes after mixing?",
        kind: "choice",
        options: ["Pours cups", "Bakes muffins", "Eats muffins", "Washes pans"],
        correctAnswer: "Pours cups",
        explanation: "Pouring is the middle step.",
      },
      {
        prompt: "The bus stops, kids climb on, then the bus drives away. What happens last?",
        kind: "choice",
        options: ["The bus drives away", "The bus stops", "Kids climb on", "Kids wave"],
        correctAnswer: "The bus drives away",
        explanation: "Driving away ends the scene.",
      },
      {
        prompt: "A puppy digs, finds a bone, then wags its tail. What happens first?",
        kind: "choice",
        options: ["A puppy digs", "Finds a bone", "Wags its tail", "Runs home"],
        correctAnswer: "A puppy digs",
        explanation: "Digging starts the story.",
      },
      {
        prompt: "Lights dim, the movie starts, then the credits roll. What is the end?",
        kind: "choice",
        options: ["The credits roll", "Lights dim", "The movie starts", "People clap"],
        correctAnswer: "The credits roll",
        explanation: "Credits come at the end.",
      },
      {
        prompt: "Maya packs a bag, walks to school, then hangs her coat. What is the middle?",
        kind: "choice",
        options: ["Walks to school", "Packs a bag", "Hangs her coat", "Reads a book"],
        correctAnswer: "Walks to school",
        explanation: "Walking is between packing and hanging the coat.",
      },
      {
        prompt: "Snow falls, kids build a snowman, then they drink cocoa. What happens last?",
        kind: "choice",
        options: ["They drink cocoa", "Snow falls", "Kids build a snowman", "Wind blows"],
        correctAnswer: "They drink cocoa",
        explanation: "Cocoa is the final event.",
      },
      {
        prompt: "The library opens, readers choose books, then checkout begins. What happens first?",
        kind: "choice",
        options: ["The library opens", "Readers choose books", "Checkout begins", "Stories are shared"],
        correctAnswer: "The library opens",
        explanation: "Opening comes first.",
      },
    ],
  },
];

const placementItems = [
  {
    pillar: "phonemic_awareness",
    prompt: "Which word rhymes with frog?",
    options: ["log", "flag", "fish", "farm"],
    correctAnswer: "log",
    sortOrder: 1,
  },
  {
    pillar: "phonemic_awareness",
    prompt: "What is the first sound in mouse?",
    options: ["/m/", "/n/", "/s/", "/b/"],
    correctAnswer: "/m/",
    sortOrder: 2,
  },
  {
    pillar: "phonics",
    prompt: "Which word has a short a sound?",
    options: ["cap", "cake", "coat", "cube"],
    correctAnswer: "cap",
    sortOrder: 3,
  },
  {
    pillar: "phonics",
    prompt: "Choose the word for /s/ /i/ /t/.",
    options: ["sit", "sat", "set", "sot"],
    correctAnswer: "sit",
    sortOrder: 4,
  },
  {
    pillar: "fluency",
    prompt: "Which sentence is written for smooth reading?",
    options: [
      "The pup naps on the rug.",
      "Pup the naps rug on the.",
      "On naps the pup rug the.",
      "The. pup naps on the rug",
    ],
    correctAnswer: "The pup naps on the rug.",
    sortOrder: 5,
  },
  {
    pillar: "vocabulary",
    prompt: "What does enormous mean?",
    options: ["very big", "very small", "very quiet", "very slow"],
    correctAnswer: "very big",
    sortOrder: 6,
  },
  {
    pillar: "comprehension",
    prompt: 'Read: "Kai flew a kite at the park." Where was Kai?',
    options: ["at the park", "at home", "at school", "at the store"],
    correctAnswer: "at the park",
    sortOrder: 7,
  },
  {
    pillar: "comprehension",
    prompt: "Plant, water, bloom. What happens last?",
    options: ["bloom", "plant", "water", "dig"],
    correctAnswer: "bloom",
    sortOrder: 8,
  },
];

async function main() {
  await prisma.attempt.deleteMany();
  await prisma.session.deleteMany();
  await prisma.skillProgress.deleteMany();
  await prisma.item.deleteMany();
  await prisma.placementItem.deleteMany();
  await prisma.skill.deleteMany();

  for (const skill of skills) {
    const created = await prisma.skill.create({
      data: {
        pillar: skill.pillar,
        slug: skill.slug,
        title: skill.title,
        description: skill.description,
        gradeBand: skill.gradeBand,
        sortOrder: skill.sortOrder,
        prerequisiteSlug: skill.prerequisiteSlug,
      },
    });
    for (const [index, item] of skill.items.entries()) {
      await prisma.item.create({
        data: {
          skillId: created.id,
          prompt: item.prompt,
          kind: item.kind,
          optionsJson: JSON.stringify(item.options),
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          sortOrder: index + 1,
        },
      });
    }
  }

  for (const item of placementItems) {
    await prisma.placementItem.create({
      data: {
        pillar: item.pillar,
        prompt: item.prompt,
        optionsJson: JSON.stringify(item.options),
        correctAnswer: item.correctAnswer,
        sortOrder: item.sortOrder,
      },
    });
  }

  console.log(`Seeded ${skills.length} skills and ${placementItems.length} placement items.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
