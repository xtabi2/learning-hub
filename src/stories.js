// Short original retellings of public-domain folk tales.
// Add another object to this array to include a new story.

export const stories = [
  {
    id: "pigs",
    title: "The Three Little Pigs",
    sentences: [
      "Three little pigs left home.",
      "One pig made a house of straw.",
      "One pig made a house of sticks.",
      "One pig made a house of bricks.",
      "A wolf blew down the straw and the sticks.",
      "He could not blow down the bricks.",
    ],
    questions: [
      {
        prompt: "Who made the brick house?",
        choices: [
          { text: "A little pig", ok: true },
          { text: "The wolf", ok: false },
          { text: "A hen", ok: false },
        ],
      },
      {
        prompt: "What did the wolf do?",
        choices: [
          { text: "He blew at the houses", ok: true },
          { text: "He made bread", ok: false },
          { text: "He went to sleep", ok: false },
        ],
      },
      {
        prompt: "What happened first?",
        choices: [
          { text: "The pigs left home", ok: true },
          { text: "The wolf went away", ok: false },
          { text: "The bricks fell down", ok: false },
        ],
      },
      {
        prompt: "Why were the pigs safe?",
        choices: [
          { text: "The brick house was strong", ok: true },
          { text: "The wolf was their friend", ok: false },
          { text: "They hid in the straw", ok: false },
        ],
      },
    ],
  },
  {
    id: "goldilocks",
    title: "Goldilocks",
    sentences: [
      "Goldilocks went into a little house.",
      "She saw three bowls.",
      "The little bowl was just right.",
      "She sat in a little chair, and it broke.",
      "Then she went to sleep.",
      "The bears came home, and she ran away.",
    ],
    questions: [
      {
        prompt: "Who went into the house?",
        choices: [
          { text: "Goldilocks", ok: true },
          { text: "The wolf", ok: false },
          { text: "The hen", ok: false },
        ],
      },
      {
        prompt: "What was just right?",
        choices: [
          { text: "The little bowl", ok: true },
          { text: "The big bowl", ok: false },
          { text: "The straw house", ok: false },
        ],
      },
      {
        prompt: "What happened last?",
        choices: [
          { text: "Goldilocks ran away", ok: true },
          { text: "She found the house", ok: false },
          { text: "She sat in the chair", ok: false },
        ],
      },
      {
        prompt: "How did the bears feel?",
        choices: [
          { text: "Not glad", ok: true },
          { text: "Happy she stayed", ok: false },
          { text: "Ready for a nap", ok: false },
        ],
      },
    ],
  },
  {
    id: "tortoise",
    title: "The Tortoise and the Hare",
    sentences: [
      "The hare could run fast.",
      "The tortoise was slow.",
      "They had a race.",
      "The hare sat down to rest.",
      "The tortoise did not stop.",
      "The slow tortoise got there first.",
    ],
    questions: [
      {
        prompt: "Who got there first?",
        choices: [
          { text: "The tortoise", ok: true },
          { text: "The hare", ok: false },
          { text: "The fox", ok: false },
        ],
      },
      {
        prompt: "What did the hare do?",
        choices: [
          { text: "He sat down to rest", ok: true },
          { text: "He flew away", ok: false },
          { text: "He helped the hen", ok: false },
        ],
      },
      {
        prompt: "What happened first?",
        choices: [
          { text: "They had a race", ok: true },
          { text: "The tortoise won", ok: false },
          { text: "The hare took a nap", ok: false },
        ],
      },
      {
        prompt: "Why did the tortoise win?",
        choices: [
          { text: "He did not stop", ok: true },
          { text: "He was the fastest", ok: false },
          { text: "The hare gave him a ride", ok: false },
        ],
      },
    ],
  },
  {
    id: "hen",
    title: "The Little Red Hen",
    sentences: [
      "The little red hen found some wheat.",
      "She asked for help.",
      "No one would help her.",
      "So she did the work.",
      "She made bread.",
      "Then she ate the bread.",
    ],
    questions: [
      {
        prompt: "Who did the work?",
        choices: [
          { text: "The little red hen", ok: true },
          { text: "The pig", ok: false },
          { text: "The cat", ok: false },
        ],
      },
      {
        prompt: "What did she make?",
        choices: [
          { text: "Bread", ok: true },
          { text: "A brick house", ok: false },
          { text: "A gold crown", ok: false },
        ],
      },
      {
        prompt: "What happened first?",
        choices: [
          { text: "She found some wheat", ok: true },
          { text: "She ate the bread", ok: false },
          { text: "She went to sleep", ok: false },
        ],
      },
      {
        prompt: "Why did she eat the bread?",
        choices: [
          { text: "She did the work", ok: true },
          { text: "The pig told her to", ok: false },
          { text: "She was not hungry", ok: false },
        ],
      },
    ],
  },
  {
    id: "gingerbread",
    title: "The Gingerbread Man",
    sentences: [
      "A woman made a gingerbread man.",
      "He jumped up and ran away.",
      "People ran after him.",
      "He said they could not catch him.",
      "A fox said he would help.",
      "Then the fox ate him.",
    ],
    questions: [
      {
        prompt: "Who ran away?",
        choices: [
          { text: "The gingerbread man", ok: true },
          { text: "The fox", ok: false },
          { text: "The hen", ok: false },
        ],
      },
      {
        prompt: "What did the fox do?",
        choices: [
          { text: "He ate the gingerbread man", ok: true },
          { text: "He made bread", ok: false },
          { text: "He built a house", ok: false },
        ],
      },
      {
        prompt: "What happened first?",
        choices: [
          { text: "A woman made him", ok: true },
          { text: "The fox ate him", ok: false },
          { text: "People sat down", ok: false },
        ],
      },
      {
        prompt: "Why did he get caught?",
        choices: [
          { text: "He trusted the fox", ok: true },
          { text: "He was too slow at first", ok: false },
          { text: "The hen stopped him", ok: false },
        ],
      },
    ],
  },
  {
    id: "goats",
    title: "The Three Billy Goats Gruff",
    sentences: [
      "Three goats wanted the green grass.",
      "A troll lived under the bridge.",
      "The little goat went across.",
      "The next goat went across.",
      "The big goat pushed the troll off.",
      "Then the goats ate the grass.",
    ],
    questions: [
      {
        prompt: "Who lived under the bridge?",
        choices: [
          { text: "A troll", ok: true },
          { text: "A hen", ok: false },
          { text: "A fox", ok: false },
        ],
      },
      {
        prompt: "What did the big goat do?",
        choices: [
          { text: "He pushed the troll off", ok: true },
          { text: "He made a house", ok: false },
          { text: "He went to sleep", ok: false },
        ],
      },
      {
        prompt: "What happened first?",
        choices: [
          { text: "The goats wanted the grass", ok: true },
          { text: "They ate the grass", ok: false },
          { text: "The troll went home", ok: false },
        ],
      },
      {
        prompt: "How did the goats feel at the end?",
        choices: [
          { text: "Glad", ok: true },
          { text: "Sad", ok: false },
          { text: "Scared of the grass", ok: false },
        ],
      },
    ],
  },
  {
    id: "duckling",
    title: "The Ugly Duckling",
    sentences: [
      "One duckling did not look like the others.",
      "They were not kind to him.",
      "He felt sad and went away.",
      "The winter was long and cold.",
      "In the spring he saw he was a swan.",
      "At last he felt happy.",
    ],
    questions: [
      {
        prompt: "Who was not kind?",
        choices: [
          { text: "The other ducks", ok: true },
          { text: "The swan", ok: false },
          { text: "The hen", ok: false },
        ],
      },
      {
        prompt: "What happened in the spring?",
        choices: [
          { text: "He saw he was a swan", ok: true },
          { text: "He turned into a pig", ok: false },
          { text: "Winter came back", ok: false },
        ],
      },
      {
        prompt: "What happened first?",
        choices: [
          { text: "He looked different", ok: true },
          { text: "He felt happy", ok: false },
          { text: "Spring came", ok: false },
        ],
      },
      {
        prompt: "How did he feel at the end?",
        choices: [
          { text: "Happy", ok: true },
          { text: "Sad", ok: false },
          { text: "Mad", ok: false },
        ],
      },
    ],
  },
  {
    id: "jack",
    title: "Jack and the Beanstalk",
    sentences: [
      "Jack sold the cow for some beans.",
      "The beans grew into a tall plant.",
      "Jack climbed up and up.",
      "He saw a giant and some gold.",
      "Jack took the gold and climbed down.",
      "Then he was safe at home.",
    ],
    questions: [
      {
        prompt: "Who climbed the plant?",
        choices: [
          { text: "Jack", ok: true },
          { text: "The giant", ok: false },
          { text: "The hen", ok: false },
        ],
      },
      {
        prompt: "What did Jack take?",
        choices: [
          { text: "Some gold", ok: true },
          { text: "The cow", ok: false },
          { text: "Some bread", ok: false },
        ],
      },
      {
        prompt: "What happened first?",
        choices: [
          { text: "Jack sold the cow", ok: true },
          { text: "He climbed down", ok: false },
          { text: "The giant went home with him", ok: false },
        ],
      },
      {
        prompt: "Why did Jack climb down?",
        choices: [
          { text: "To get home safe", ok: true },
          { text: "To find the cow", ok: false },
          { text: "The hen called him", ok: false },
        ],
      },
    ],
  },
];
