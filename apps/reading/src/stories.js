// Original retellings of public-domain fairy tales, fables, and folk tales.
// Each story has three levels:
//   k  (Pre-K and K): 3-4 very short sentences, mostly K sight words, 2 questions
//   1  (1st grade):   5-6 sentences, 3 questions
//   2  (2nd and 3rd): 7-10 sentences, 4 questions
// A question is [prompt, right answer, wrong answer, wrong answer].
// Stories with no hand-drawn art in StoryArt.jsx get an emoji scene from `cast`.

const library = [
  {
    id: "pigs", title: "The Three Little Pigs", emoji: "🐷", cast: ["🐷", "🐺", "🏠"],
    k: [
      ["The three little pigs are out.", "One pig has a house of straw.", "The wolf blew it in.", "But the house of bricks is up."],
      [["Who blew?", "The wolf", "A pig", "A hen"], ["What house is up?", "The brick house", "The straw house", "No house"]],
    ],
    1: [
      ["Three little pigs left home.", "One pig made a house of straw.", "One pig made a house of sticks.", "One pig made a house of bricks.", "A wolf blew down the straw and the sticks.", "He could not blow down the bricks."],
      [["Who made the brick house?", "A little pig", "The wolf", "A hen"], ["What did the wolf do?", "He blew at the houses", "He made bread", "He went to sleep"], ["What happened first?", "The pigs left home", "The wolf went away", "The bricks fell down"]],
    ],
    2: [
      ["Three little pigs left home to build houses of their own.", "The first pig made a house of straw.", "The second pig made a house of sticks.", "The third pig worked hard on a house of bricks.", "A hungry wolf huffed and puffed until the straw house fell.", "He blew the stick house down too.", "The pigs ran to the brick house, and the wolf could not blow it down.", "The three pigs were safe together."],
      [["Who made the brick house?", "The third pig", "The wolf", "The first pig"], ["What did the wolf blow down?", "The straw and stick houses", "The brick house", "A tree"], ["What happened first?", "The pigs left home", "The wolf gave up", "The pigs were safe"], ["Why were the pigs safe?", "The brick house was strong", "The wolf was their friend", "They hid in the straw"]],
    ],
  },
  {
    id: "goldilocks", title: "Goldilocks", emoji: "👧", cast: ["👧", "🐻", "🥣"],
    k: [
      ["A little girl is in the house.", "She had the little bowl.", "She is in the little bed.", "The three bears look at her."],
      [["Who is in the house?", "A little girl", "A wolf", "A pig"], ["Which bowl was hers?", "The little bowl", "The big bowl", "No bowl"]],
    ],
    1: [
      ["Goldilocks went into a little house.", "She saw three bowls.", "The little bowl was just right.", "She sat in a little chair, and it broke.", "Then she went to sleep.", "The bears came home, and she ran away."],
      [["Who went into the house?", "Goldilocks", "The wolf", "The hen"], ["What was just right?", "The little bowl", "The big bowl", "The straw house"], ["What happened last?", "She ran away", "She saw three bowls", "She sat in a chair"]],
    ],
    2: [
      ["Three bears went for a walk while their soup cooled.", "A girl named Goldilocks opened their door and went inside.", "The big bowl was too hot, but the little bowl was just right.", "She sat in the little chair, and it broke into pieces.", "Upstairs she found a soft little bed and fell asleep.", "The bears came home and saw the empty bowl and the broken chair.", "Baby Bear found Goldilocks asleep in his bed.", "She woke up, jumped out the window, and ran home."],
      [["Whose house was it?", "The three bears", "Goldilocks", "A wolf"], ["What broke?", "The little chair", "The big bowl", "The window"], ["Who found Goldilocks?", "Baby Bear", "Papa Bear", "A pig"], ["Why did the bears go for a walk?", "Their soup was too hot", "They were lost", "They wanted to race"]],
    ],
  },
  {
    id: "tortoise", title: "The Tortoise and the Hare", emoji: "🐢", cast: ["🐢", "🐇", "🏁"],
    k: [
      ["The hare can run, so he is out of sight.", "He had a nap.", "The tortoise is not fast, but he is at the end.", "The tortoise was the one to win."],
      [["Who had a nap?", "The hare", "The tortoise", "A fox"], ["Who won?", "The tortoise", "The hare", "No one"]],
    ],
    1: [
      ["The hare could run fast.", "The tortoise was slow.", "They had a race.", "The hare sat down to rest.", "The tortoise did not stop.", "The slow tortoise got there first."],
      [["Who got there first?", "The tortoise", "The hare", "The fox"], ["What did the hare do?", "He sat down to rest", "He flew away", "He helped the hen"], ["What happened first?", "They had a race", "The tortoise won", "The hare took a nap"]],
    ],
    2: [
      ["A proud hare laughed at the tortoise for being so slow.", "The tortoise said, \"Let us race and see who wins.\"", "The hare dashed ahead and was soon far down the road.", "He was so sure he would win that he lay down for a nap.", "The tortoise kept walking, one small step at a time.", "He passed the sleeping hare and never stopped.", "When the hare woke up, he ran as fast as he could.", "It was too late, because the tortoise had already crossed the line."],
      [["Who laughed at the tortoise?", "The hare", "A fox", "A crow"], ["What did the hare do in the race?", "He took a nap", "He carried the tortoise", "He went home"], ["What happened last?", "The tortoise crossed the line", "The hare laughed", "They planned a race"], ["What is the lesson?", "Slow and steady wins", "Always run fast", "Never race"]],
    ],
  },
  {
    id: "hen", title: "The Little Red Hen", emoji: "🐔", cast: ["🐔", "🌾", "🍞"],
    k: [
      ["The little red hen has wheat.", "Who can help me?", "No one said yes, so she was the one to do it all.", "The bread is all hers."],
      [["Who has wheat?", "The little red hen", "A cat", "A pig"], ["Who did the work?", "The hen", "The dog", "The cat"]],
    ],
    1: [
      ["The little red hen found some wheat.", "She asked for help.", "No one would help her.", "So she did the work.", "She made bread.", "Then she ate the bread."],
      [["Who did the work?", "The little red hen", "The dog", "The cat"], ["What did she make?", "Bread", "Soup", "A cake"], ["What happened first?", "She found some wheat", "She ate the bread", "She made bread"]],
    ],
    2: [
      ["The little red hen found grains of wheat on the farm.", "She asked the dog, the cat, and the duck to help her plant it.", "\"Not I,\" said each of them.", "So she planted the wheat and watered it herself.", "When the wheat was tall, nobody helped her cut it.", "Nobody helped her grind it or bake the bread either.", "Then she asked who would help her eat the warm bread.", "Everyone wanted some, but the hen and her chicks ate it all."],
      [["Who planted the wheat?", "The little red hen", "The cat", "The duck"], ["What did the friends say?", "Not I", "Yes, please", "Let us help"], ["What happened last?", "The hen and chicks ate the bread", "She found wheat", "She planted seeds"], ["Why did the friends get no bread?", "They did not help", "They were not hungry", "The bread burned"]],
    ],
  },
  {
    id: "gingerbread", title: "The Gingerbread Man", emoji: "🍪", cast: ["🍪", "🦊", "👵"],
    k: [
      ["The little gingerbread man ran out.", "You can not get me, he said.", "The fox said, I can be your ride.", "That was the end of him."],
      [["Who ran out?", "The gingerbread man", "The fox", "A pig"], ["Who said he would give a ride?", "The fox", "A cow", "A hen"]],
    ],
    1: [
      ["A woman made a gingerbread man.", "He jumped up and ran away.", "People ran after him.", "He said they could not catch him.", "A fox said he would help.", "Then the fox ate him."],
      [["Who ran away?", "The gingerbread man", "The fox", "The woman"], ["What did the fox do?", "He ate the gingerbread man", "He baked a cake", "He ran home"], ["What happened first?", "A woman made him", "The fox ate him", "He met a fox"]],
    ],
    2: [
      ["An old woman baked a gingerbread man with raisin eyes.", "When she opened the oven, he jumped out and ran away.", "\"Run, run, as fast as you can,\" he sang.", "The woman, a cow, and a horse all chased him.", "He came to a wide river and could not swim.", "A sly fox offered to carry him across on his nose.", "Halfway over, the fox tossed his head.", "Snap went the fox, and that was the end of the gingerbread man."],
      [["Who baked him?", "An old woman", "A fox", "A horse"], ["What stopped him?", "A river", "A wall", "A storm"], ["Who carried him?", "The fox", "The cow", "The woman"], ["Why was trusting the fox a mistake?", "The fox wanted to eat him", "The fox could not swim", "The fox was slow"]],
    ],
  },
  {
    id: "goats", title: "The Three Billy Goats Gruff", emoji: "🐐", cast: ["🐐", "👹", "🌉"],
    k: [
      ["Three goats are at the bridge.", "A troll is there.", "The big goat is not little, so he can push.", "The troll is out, and the goats are on the hill."],
      [["Who is at the bridge?", "A troll", "A fox", "A hen"], ["Who can push?", "The big goat", "The little goat", "The troll"]],
    ],
    1: [
      ["Three goats wanted the green grass.", "A troll lived under the bridge.", "The little goat went across.", "The next goat went across.", "The big goat pushed the troll off.", "Then the goats ate the grass."],
      [["Who lived under the bridge?", "A troll", "A fox", "A bear"], ["What did the big goat do?", "He pushed the troll off", "He ran home", "He fell asleep"], ["What happened last?", "The goats ate the grass", "The little goat crossed", "The troll lived there"]],
    ],
    2: [
      ["Three billy goats named Gruff wanted to eat the grass on the hill.", "To get there, they had to cross a bridge.", "A grumpy troll lived under that bridge.", "The smallest goat went trip, trap across, and the troll wanted to eat him.", "\"Wait for my bigger brother,\" said the little goat.", "The middle goat said the same thing.", "Then the biggest goat came, and he butted the troll into the river.", "All three goats ate grass on the hill until they were fat and happy."],
      [["Where did the troll live?", "Under the bridge", "On the hill", "In a cave"], ["What did the little goat say?", "Wait for my bigger brother", "Please eat me", "I can swim"], ["Who beat the troll?", "The biggest goat", "The smallest goat", "A farmer"], ["Why did the goats cross the bridge?", "To eat grass on the hill", "To see the troll", "To go swimming"]],
    ],
  },
  {
    id: "duckling", title: "The Ugly Duckling", emoji: "🦢", cast: ["🐣", "🦆", "🦢"],
    k: [
      ["One little duck is not like the others.", "He is so blue.", "Then look at him.", "He is a swan."],
      [["Who is not like the others?", "One little duck", "A pig", "A hen"], ["What is he at the end?", "A swan", "A frog", "A goat"]],
    ],
    1: [
      ["One duckling did not look like the others.", "They were not kind to him.", "He felt sad and went away.", "The winter was long and cold.", "In the spring he saw he was a swan.", "At last he felt happy."],
      [["Who was not kind?", "The other ducks", "The swans", "A fox"], ["What happened in the spring?", "He saw he was a swan", "He went to sleep", "He found bread"], ["How did he feel at the end?", "Happy", "Sad", "Cold"]],
    ],
    2: [
      ["A mother duck sat on her eggs until they hatched.", "One chick was big, gray, and different from the rest.", "The other ducks teased him and called him ugly.", "Sad and lonely, he left the farm.", "He spent the long, cold winter hiding in the reeds.", "When spring came, he saw beautiful white swans on the lake.", "He bent his head to the water and saw his own reflection.", "He had grown into a swan, and the swans welcomed him."],
      [["Who teased the gray chick?", "The other ducks", "The swans", "The farmer"], ["Where did he spend the winter?", "In the reeds", "In a barn", "In a nest"], ["What did he see in the water?", "That he was a swan", "A fish", "A frog"], ["How did he feel at the end?", "Happy and welcome", "Lonely", "Angry"]],
    ],
  },
  {
    id: "jack", title: "Jack and the Beanstalk", emoji: "🌱", cast: ["👦", "🌱", "🐔"],
    k: [
      ["Jack has a little bean.", "It is up, up, up.", "Jack is up at the top.", "He had a hen that was so funny."],
      [["What did Jack have?", "A bean", "A cat", "A boat"], ["Where is Jack?", "Up at the top", "In a hole", "On a bus"]],
    ],
    1: [
      ["Jack traded the cow for magic beans.", "A giant beanstalk grew up to the sky.", "Jack climbed up to a castle.", "A giant lived there.", "Jack took a hen that laid gold eggs.", "He climbed down and cut the beanstalk."],
      [["What did Jack get for the cow?", "Magic beans", "Gold coins", "A horse"], ["Who lived in the castle?", "A giant", "A queen", "A troll"], ["What happened last?", "He cut the beanstalk", "He traded the cow", "He climbed up"]],
    ],
    2: [
      ["Jack and his mother were poor, so he took their cow to sell.", "A strange man gave him five magic beans for it.", "His mother was cross and threw the beans out the window.", "By morning, a huge beanstalk reached into the clouds.", "Jack climbed it and found a giant's castle.", "He hid while the giant counted his gold and fell asleep.", "Jack took a hen that laid golden eggs and hurried down.", "When the giant chased him, Jack chopped the beanstalk down.", "Jack and his mother were never poor again."],
      [["Why did Jack sell the cow?", "They were poor", "The cow was sick", "He wanted a horse"], ["Who threw the beans out?", "Jack's mother", "The giant", "Jack"], ["What did Jack take?", "A hen with golden eggs", "A cow", "A beanstalk"], ["What happened last?", "Jack and his mother were never poor", "Jack sold the cow", "Jack climbed up"]],
    ],
  },
  {
    id: "lion-mouse", title: "The Lion and the Mouse", emoji: "🦁", cast: ["🦁", "🐭", "🕸️"],
    k: [
      ["A lion had a little mouse in his paw.", "Let me go, said the mouse.", "Once the lion was in a net.", "The little mouse got him out."],
      [["Who was in a net?", "The lion", "The mouse", "A cat"], ["Who got him out?", "The little mouse", "A bird", "A man"]],
    ],
    1: [
      ["A lion caught a little mouse.", "The mouse begged him to let her go.", "The lion laughed and let her run away.", "Later the lion was trapped in a net.", "The mouse chewed the ropes.", "The lion was free."],
      [["Who caught the mouse?", "The lion", "A cat", "An owl"], ["How did the mouse help?", "She chewed the ropes", "She roared", "She ran away"], ["What happened last?", "The lion was free", "The lion caught the mouse", "The lion laughed"]],
    ],
    2: [
      ["A little mouse ran across a sleeping lion's nose and woke him.", "The lion trapped her under his huge paw.", "\"Please let me go, and someday I will help you,\" she squeaked.", "The lion laughed, because how could a mouse help a lion?", "Still, he lifted his paw and let her go.", "A few days later, hunters caught the lion in a rope net.", "The mouse heard him roar and chewed through the ropes.", "The lion learned that even small friends can be a big help."],
      [["How did the mouse wake the lion?", "She ran across his nose", "She sang", "She bit his tail"], ["Why did the lion laugh?", "He did not think a mouse could help", "The mouse told a joke", "He was tickled"], ["Who caught the lion?", "Hunters", "The mouse", "A bear"], ["What is the lesson?", "Small friends can be a big help", "Lions are always kind", "Never sleep outside"]],
    ],
  },
  {
    id: "fox-grapes", title: "The Fox and the Grapes", emoji: "🍇", cast: ["🦊", "🍇", "🌳"],
    k: [
      ["A fox can see the grapes up there.", "He can not get them.", "He is mad.", "The fox said that they are no good."],
      [["What does the fox see?", "Grapes", "A hen", "A hat"], ["Can he get them?", "No", "Yes", "Two of them"]],
    ],
    1: [
      ["A hungry fox saw some grapes.", "They hung high on a vine.", "He jumped and jumped.", "He could not reach them.", "He walked away.", "He said the grapes were sour anyway."],
      [["What did the fox want?", "Grapes", "A fish", "Bread"], ["Why could he not get them?", "They were too high", "They were gone", "A bear ate them"], ["What did he say at the end?", "The grapes were sour", "He was full", "He would come back"]],
    ],
    2: [
      ["On a hot day, a hungry fox walked through an orchard.", "He spotted a bunch of ripe purple grapes on a high vine.", "\"Those will be sweet and juicy,\" he thought.", "He backed up, ran, and jumped, but he missed.", "He tried again and again until he was tired.", "At last he turned up his nose and walked off.", "\"I am sure those grapes were sour,\" he said.", "It is easy to pretend you did not want what you cannot have."],
      [["Where were the grapes?", "On a high vine", "On the ground", "In a basket"], ["What did the fox do first?", "He jumped for them", "He climbed a ladder", "He asked for help"], ["What did he say at the end?", "The grapes were sour", "The grapes were sweet", "He would share"], ["What is the lesson?", "People pretend not to want what they cannot get", "Grapes are sour", "Foxes cannot jump"]],
    ],
  },
  {
    id: "ant-grasshopper", title: "The Ant and the Grasshopper", emoji: "🐜", cast: ["🐜", "🦗", "❄️"],
    k: [
      ["The ant is at work in the sun.", "The grasshopper is at play.", "Then it was so cold.", "The ant had food, but the grasshopper had no food."],
      [["Who is at work?", "The ant", "The grasshopper", "A cat"], ["Who had no food?", "The grasshopper", "The ant", "A bee"]],
    ],
    1: [
      ["All summer the ant worked hard.", "She carried food to her home.", "The grasshopper sang and played.", "Then winter came.", "The grasshopper had no food.", "The ant was warm and fed."],
      [["What did the ant do?", "She worked hard", "She sang all day", "She slept"], ["What did the grasshopper do?", "He sang and played", "He saved food", "He built a house"], ["What happened in winter?", "The grasshopper had no food", "The ant was hungry", "It was hot"]],
    ],
    2: [
      ["On warm summer days, a grasshopper hopped and sang in the grass.", "An ant walked by carrying a heavy kernel of corn.", "\"Why work so hard?\" asked the grasshopper.", "\"I am saving food for winter,\" said the ant.", "The grasshopper laughed and kept playing his fiddle.", "Soon the days grew short, and snow covered the fields.", "The grasshopper was cold and could not find anything to eat.", "He learned that it is wise to get ready for the days ahead."],
      [["What did the ant carry?", "Corn", "A fiddle", "Snow"], ["Why did the ant work?", "To save food for winter", "To win a race", "To help the grasshopper sing"], ["What happened when snow came?", "The grasshopper had no food", "The ant played music", "The grass grew"], ["What is the lesson?", "Get ready for the days ahead", "Always play", "Snow is fun"]],
    ],
  },
  {
    id: "cried-wolf", title: "The Boy Who Cried Wolf", emoji: "🐑", cast: ["👦", "🐑", "🐺"],
    k: [
      ["A boy said there was a wolf, but there was no wolf.", "He said it two times.", "Then a wolf was there.", "No one came to the boy."],
      [["What did the boy say?", "There was a wolf", "There was a cat", "He was hungry"], ["Did people come at the end?", "No", "Yes", "Three came"]],
    ],
    1: [
      ["A boy watched the sheep.", "He was bored, so he yelled wolf.", "People ran to help, but there was no wolf.", "He did it again.", "Then a real wolf came.", "No one believed him."],
      [["What did the boy watch?", "Sheep", "Cows", "Ducks"], ["Why did he yell wolf?", "He was bored", "He saw a wolf", "He was lost"], ["What happened last?", "No one believed him", "The wolf left", "People came to help"]],
    ],
    2: [
      ["A shepherd boy sat on a hill watching the village sheep.", "He was bored, so he shouted, \"Wolf, wolf!\"", "The villagers ran up the hill to help, but there was no wolf.", "The boy laughed at them, and they went home angry.", "A few days later, he played the same trick.", "One evening a real wolf crept toward the flock.", "The boy shouted for help, but no one came.", "Nobody believes someone who often tells lies, even when they tell the truth."],
      [["Where did the boy sit?", "On a hill", "In a boat", "In a barn"], ["How did the villagers feel after the trick?", "Angry", "Happy", "Sleepy"], ["Why did no one come at the end?", "They thought he was lying", "They were asleep", "They saw the wolf leave"], ["What is the lesson?", "Liars are not believed", "Wolves are friendly", "Sheep can run fast"]],
    ],
  },
  {
    id: "crow-pitcher", title: "The Crow and the Pitcher", emoji: "🐦‍⬛", cast: ["🐦‍⬛", "🏺", "🪨"],
    k: [
      ["A crow had to have a drink.", "The water is in the jug, and he can not get it.", "In go the little stones.", "Up it came, and the crow had a drink."],
      [["What did the crow want?", "A drink", "A hat", "A nap"], ["What did he put in the jug?", "Little stones", "Grapes", "Bread"]],
    ],
    1: [
      ["A thirsty crow found a pitcher.", "The water was at the bottom.", "His beak could not reach it.", "He dropped pebbles in, one by one.", "The water rose to the top.", "The crow had a drink."],
      [["What did the crow find?", "A pitcher", "A pond", "A cup of milk"], ["What did he drop in?", "Pebbles", "Leaves", "Seeds"], ["What happened to the water?", "It rose up", "It spilled", "It froze"]],
    ],
    2: [
      ["It had not rained for weeks, and a crow was very thirsty.", "He found a tall pitcher with a little water at the bottom.", "He pushed his beak inside, but the water was too low.", "He tried to tip the pitcher over, but it was too heavy.", "Then he had an idea.", "He picked up pebbles and dropped them in, one at a time.", "Slowly the water rose higher and higher.", "At last the crow could drink, and he flew off refreshed."],
      [["Why was the crow thirsty?", "It had not rained", "He ate salt", "He flew too far"], ["What did he try first?", "Pushing his beak in", "Dropping pebbles", "Calling a friend"], ["Why did the water rise?", "The pebbles filled the space", "It rained", "The pitcher grew"], ["What is the lesson?", "Thinking helps solve problems", "Crows hate water", "Pitchers are heavy"]],
    ],
  },
  {
    id: "town-mouse", title: "The Town Mouse and the Country Mouse", emoji: "🐁", cast: ["🐁", "🏙️", "🌾"],
    k: [
      ["One mouse is from the town.", "One mouse is from the farm.", "In the town there was a cat.", "The farm mouse said, I like my little home."],
      [["What was in the town?", "A cat", "A cow", "A bear"], ["Which home does the farm mouse like?", "His little home", "The town", "The cat house"]],
    ],
    1: [
      ["A country mouse lived in a field.", "His cousin lived in town.", "They went to the big town house.", "There was lots of rich food.", "Then a cat chased them.", "The country mouse went home happy."],
      [["Where did the country mouse live?", "In a field", "In town", "In a tree"], ["What chased them?", "A cat", "A dog", "A fox"], ["How did he feel going home?", "Happy", "Angry", "Hungry"]],
    ],
    2: [
      ["A country mouse invited his cousin from town to visit.", "He served simple food like barley and roots.", "\"Come to town, and I will show you a feast,\" said the town mouse.", "In the city house they found cake, cheese, and honey.", "Just as they began to eat, the door swung open.", "A big cat sprang into the room, and they ran for their lives.", "The country mouse packed his bag that night.", "\"I would rather eat plain food in peace than fine food in fear,\" he said."],
      [["What food did the country mouse serve?", "Barley and roots", "Cake and honey", "Fish"], ["What happened during the feast?", "A cat came in", "It rained", "They fell asleep"], ["Where did the country mouse go?", "Back home", "To the cat", "To sea"], ["What is the lesson?", "A calm life beats a scary rich one", "Cake is best", "Cats are friends"]],
    ],
  },
  {
    id: "wind-sun", title: "The North Wind and the Sun", emoji: "🌬️", cast: ["🌬️", "☀️", "🧥"],
    k: [
      ["The wind and the sun see a man.", "The wind blew, but his coat is on.", "Then the sun was out.", "The man is so hot that the coat is off."],
      [["Who blew?", "The wind", "The sun", "The man"], ["Who got the coat off?", "The sun", "The wind", "A dog"]],
    ],
    1: [
      ["The wind and the sun had a contest.", "Who could get a man's coat off?", "The wind blew hard.", "The man held his coat tight.", "The sun shone warm.", "The man took off his coat."],
      [["What was the contest?", "Getting a coat off", "A race", "Who was biggest"], ["What did the man do when the wind blew?", "Held his coat tight", "Took off his coat", "Went to sleep"], ["Who won?", "The sun", "The wind", "The man"]],
    ],
    2: [
      ["The North Wind boasted that he was stronger than the Sun.", "They saw a traveler walking down a road in a warm coat.", "\"Whoever makes him take off his coat wins,\" said the Sun.", "The Wind blew a freezing gale.", "The harder he blew, the tighter the man wrapped his coat.", "Then the Sun came out and shone gently.", "The man grew warm, wiped his forehead, and took off his coat.", "Kindness and warmth can work better than force."],
      [["Who boasted?", "The North Wind", "The Sun", "The traveler"], ["What happened when the Wind blew?", "The man held his coat tighter", "The coat flew off", "The man ran"], ["Why did the man take off his coat?", "He grew warm", "It was torn", "The Wind asked"], ["What is the lesson?", "Gentleness beats force", "Wind is strongest", "Always wear a coat"]],
    ],
  },
  {
    id: "golden-goose", title: "The Goose and the Golden Eggs", emoji: "🪿", cast: ["🪿", "🥚", "👨‍🌾"],
    k: [
      ["A man had a funny goose.", "The goose had a yellow egg of gold.", "He was mad that it was one egg.", "Then he had no goose and no eggs."],
      [["What did the goose have?", "An egg of gold", "A hat", "A fish"], ["What did he have at the end?", "No eggs", "Lots of gold", "Two geese"]],
    ],
    1: [
      ["A farmer had a special goose.", "Each day it laid one golden egg.", "The farmer got rich.", "He wanted all the gold at once.", "He hurt the goose to look inside.", "There was no gold, and no more eggs."],
      [["What did the goose lay?", "Golden eggs", "Blue eggs", "Stones"], ["What did the farmer want?", "All the gold at once", "A new goose", "A cow"], ["What happened last?", "There were no more eggs", "He got more gold", "The goose flew away"]],
    ],
    2: [
      ["A farmer and his wife owned a goose that was very special.", "Every morning it laid one shiny golden egg.", "They sold the eggs and soon had plenty of money.", "But the farmer grew greedy and impatient.", "\"The goose must be full of gold,\" he said.", "He decided to get all the gold at once.", "Inside, the goose was just like any other goose.", "Now there were no more golden eggs, because greed had ruined everything."],
      [["How many eggs a day?", "One", "Ten", "None"], ["How did the farmer change?", "He grew greedy", "He grew kind", "He grew tired"], ["What was inside the goose?", "No gold", "A pile of gold", "Eggs"], ["What is the lesson?", "Greed can lose what you have", "Geese are rich", "Eggs are gold"]],
    ],
  },
  {
    id: "dog-bone", title: "The Dog and His Reflection", emoji: "🐕", cast: ["🐕", "🦴", "🌊"],
    k: [
      ["A dog has a bone.", "In the water he can see a dog with a bone.", "He said, I like that one.", "The bone is in the water, and he has no bone."],
      [["What does the dog have?", "A bone", "A ball", "A hat"], ["What did he have at the end?", "No bone", "Two bones", "A fish"]],
    ],
    1: [
      ["A dog had a big bone.", "He walked over a bridge.", "He saw another dog in the water.", "That dog had a bone too.", "He barked to get it.", "His own bone fell in the river."],
      [["What did the dog carry?", "A bone", "A stick", "A shoe"], ["What did he see in the water?", "Another dog", "A fish", "A boat"], ["What happened when he barked?", "His bone fell in", "He got two bones", "The other dog left"]],
    ],
    2: [
      ["A dog got a juicy bone from the butcher.", "He trotted home with it held tightly in his mouth.", "On the way, he crossed a narrow bridge over a calm stream.", "Looking down, he saw a dog with an even bigger bone.", "He did not know it was his own reflection.", "Greedy for both bones, he opened his mouth to bark.", "His bone fell with a splash and sank out of sight.", "He walked home hungry, having lost what he already had."],
      [["Where did the bone come from?", "The butcher", "The river", "A cat"], ["Who was the dog in the water?", "His reflection", "His brother", "A wolf"], ["Why did the bone fall?", "He opened his mouth to bark", "The bridge broke", "A bird took it"], ["What is the lesson?", "Greed can make you lose what you have", "Dogs cannot swim", "Bridges are bad"]],
    ],
  },
  {
    id: "red-riding-hood", title: "Little Red Riding Hood", emoji: "🧺", cast: ["👧", "🐺", "👵"],
    k: [
      ["A little girl had a red hood.", "She had a basket for her grandma.", "There was a wolf in the bed.", "A man was there, and the wolf ran out."],
      [["Who was in the bed?", "A wolf", "A cat", "A pig"], ["What was red?", "Her hood", "The wolf", "The bed"]],
    ],
    1: [
      ["Red took a basket to Grandma.", "She met a wolf in the woods.", "The wolf ran to Grandma's house first.", "He hid in Grandma's bed.", "Red said, what big teeth you have.", "A woodcutter came, and the wolf ran away."],
      [["Who did Red visit?", "Grandma", "A bear", "Her teacher"], ["Where did the wolf hide?", "In Grandma's bed", "In a tree", "In the basket"], ["Who helped?", "A woodcutter", "A pig", "A fox"]],
    ],
    2: [
      ["A girl who always wore a red cape was called Little Red Riding Hood.", "Her mother asked her to take a basket of treats to Grandma.", "\"Stay on the path,\" her mother said.", "In the woods, a sly wolf asked where she was going.", "He raced ahead, locked Grandma in the closet, and climbed into her bed.", "\"Grandma, what big eyes you have,\" said Red.", "\"What big teeth you have,\" she said, and the wolf jumped up.", "A woodcutter heard her shout and chased the wolf away.", "Grandma came out of the closet, and they shared the treats."],
      [["What did her mother say?", "Stay on the path", "Run fast", "Pick flowers"], ["Where was Grandma?", "In the closet", "At the store", "In the woods"], ["Who chased the wolf away?", "A woodcutter", "Red's mother", "A bear"], ["What happened last?", "They shared the treats", "Red met the wolf", "Red left home"]],
    ],
  },
  {
    id: "henny-penny", title: "Henny Penny", emoji: "🐤", cast: ["🐤", "🦆", "🦊"],
    k: [
      ["Henny Penny said, the sky is out.", "She was with a duck and a goose.", "A fox said, look in here.", "The king said that it was an acorn."],
      [["What did Henny Penny say?", "The sky is out", "I am hungry", "Look at me"], ["What was it?", "An acorn", "A star", "A cake"]],
    ],
    1: [
      ["An acorn fell on Henny Penny.", "She said the sky was falling.", "She ran to tell the king.", "Ducky Lucky and Goosey Loosey came too.", "A fox tried to trick them.", "They learned it was just an acorn."],
      [["What fell on her?", "An acorn", "The sky", "A leaf"], ["Who did she want to tell?", "The king", "Her mom", "The fox"], ["Who tried to trick them?", "A fox", "A duck", "The king"]],
    ],
    2: [
      ["Henny Penny was pecking corn when something hit her on the head.", "\"The sky is falling,\" she cried.", "\"We must tell the king.\"", "Along the way, Cocky Locky, Ducky Lucky, and Goosey Loosey joined her.", "Then Foxy Loxy offered to show them a shortcut to the palace.", "The shortcut led to his den, where he planned to eat them.", "The rooster crowed loudly, and they all scattered home safely.", "Later they found the acorn and laughed at how silly they had been."],
      [["What really hit her?", "An acorn", "A raindrop", "A star"], ["Where did the fox's shortcut lead?", "To his den", "To the palace", "To a river"], ["How did they escape?", "The rooster crowed", "The king came", "They flew"], ["What is the lesson?", "Check facts before you panic", "The sky falls", "Foxes are helpful"]],
    ],
  },
  {
    id: "turnip", title: "The Enormous Turnip", emoji: "🥕", cast: ["👴", "🥕", "🐭"],
    k: [
      ["The man can not get the turnip out.", "The man and the dog and the cat pull.", "A little mouse is there to help.", "Up it came, and they all fell."],
      [["What can the man not get out?", "The turnip", "A rock", "A hat"], ["Who helped last?", "A little mouse", "A cow", "A pig"]],
    ],
    1: [
      ["An old man grew a giant turnip.", "He pulled, but it would not come up.", "His wife pulled with him.", "Then a girl, a dog, and a cat pulled too.", "At last a tiny mouse helped.", "Out came the turnip."],
      [["What did the man grow?", "A giant turnip", "A tree", "A bean"], ["Who helped last?", "A tiny mouse", "A horse", "The king"], ["What happened at the end?", "The turnip came out", "They gave up", "The turnip broke"]],
    ],
    2: [
      ["An old man planted a turnip seed and watered it every day.", "It grew bigger and bigger until it was enormous.", "He pulled and pulled, but it would not budge.", "He called his wife, and she pulled on his coat.", "They called a girl, then a dog, then a cat to join the line.", "Still the turnip stayed in the ground.", "At last a tiny mouse grabbed the cat's tail and pulled.", "Pop, out came the turnip, and everyone tumbled over.", "That night they all shared turnip soup."],
      [["Who planted the seed?", "An old man", "A mouse", "A girl"], ["Who joined right after the wife?", "A girl", "The mouse", "The cat"], ["What did they make?", "Turnip soup", "Bread", "Pie"], ["What is the lesson?", "Every helper counts", "Mice are strongest", "Turnips are small"]],
    ],
  },
  {
    id: "elves-shoemaker", title: "The Elves and the Shoemaker", emoji: "👞", cast: ["🧝", "👞", "🧵"],
    k: [
      ["A man had one little bit of leather.", "Two elves are in at night.", "They had shoes out for him.", "The man said, thank you, little elves."],
      [["Who came at night?", "Two elves", "A wolf", "Three pigs"], ["What did they make?", "Shoes", "Bread", "A hat"]],
    ],
    1: [
      ["A poor shoemaker had leather for one pair of shoes.", "He cut it and went to bed.", "In the morning the shoes were done.", "This happened night after night.", "He hid and saw two little elves.", "He made them tiny clothes to say thank you."],
      [["What did the shoemaker make?", "Shoes", "Hats", "Toys"], ["Who made the shoes?", "Two little elves", "His wife", "A fox"], ["How did he say thank you?", "He made them clothes", "He gave them gold", "He baked a pie"]],
    ],
    2: [
      ["A kind shoemaker was so poor that he had leather for only one pair of shoes.", "He cut the pieces, left them on his bench, and went to bed.", "In the morning he found a perfect pair of shoes.", "A customer paid so much that he could buy more leather.", "Every night he cut pieces, and every morning new shoes were ready.", "One night he and his wife hid to see who was helping.", "Two tiny elves in rags sewed quickly and then danced away.", "The couple sewed tiny clothes and shoes as a gift.", "The elves put them on, danced with joy, and never needed to come back."],
      [["Why was he poor?", "He had little leather", "He was lazy", "He lost his shop"], ["Who was helping him?", "Two tiny elves", "His neighbor", "A cat"], ["What gift did they make?", "Tiny clothes", "A cake", "Gold coins"], ["What happened last?", "The elves danced away", "He cut leather", "A customer paid"]],
    ],
  },
  {
    id: "stone-soup", title: "Stone Soup", emoji: "🍲", cast: ["🧑", "🍲", "🥕"],
    k: [
      ["A man had a pot of water and a stone.", "He said, we can all have soup.", "One had a carrot, and one had an onion.", "It was soup for all of us."],
      [["What was in the pot at the start?", "A stone", "A fish", "A hat"], ["Who had soup?", "All of them", "No one", "Just the man"]],
    ],
    1: [
      ["A hungry traveler came to a town.", "No one would share food.", "He put a stone in a pot of water.", "He said he was making stone soup.", "People added carrots, onions, and beans.", "Soon everyone shared a great soup."],
      [["What did he put in the pot?", "A stone", "A shoe", "Gold"], ["What did people add?", "Carrots and beans", "Rocks", "Sand"], ["What happened at the end?", "Everyone shared soup", "He left hungry", "The pot broke"]],
    ],
    2: [
      ["A tired traveler walked into a village with only an empty pot.", "The villagers said they had no food to spare.", "He filled the pot with water, dropped in a smooth stone, and lit a fire.", "\"Stone soup is delicious, but a carrot would make it better,\" he said.", "A curious woman brought a carrot.", "Others brought onions, potatoes, beans, and salt.", "Soon the pot bubbled with a rich, tasty soup.", "The whole village sat down together and shared a feast."],
      [["What did the traveler carry?", "An empty pot", "A bag of gold", "A basket of bread"], ["What did the villagers say at first?", "They had no food to spare", "Come eat with us", "Go away now"], ["Why did people add food?", "They were curious and wanted to help", "The traveler paid them", "The king said so"], ["What is the lesson?", "Sharing makes a feast", "Stones are tasty", "Never travel"]],
    ],
  },
  {
    id: "princess-pea", title: "The Princess and the Pea", emoji: "👑", cast: ["👸", "🛏️", "🫛"],
    k: [
      ["A girl was out in the rain.", "She said, I am a princess.", "There was one little pea in the bed.", "She had no sleep, so she is a princess."],
      [["What was in the bed?", "A pea", "A cat", "A shoe"], ["Did she sleep?", "No", "Yes", "All day"]],
    ],
    1: [
      ["A prince wanted to marry a real princess.", "One stormy night a girl knocked on the door.", "The queen put a pea under many mattresses.", "The girl slept on top.", "In the morning she said she could not sleep.", "Only a real princess could feel the pea."],
      [["What did the queen hide?", "A pea", "A ring", "A key"], ["How did the girl sleep?", "She could not sleep", "Very well", "On the floor"], ["What did it show?", "She was a real princess", "She was a queen", "She was a frog"]],
    ],
    2: [
      ["A prince traveled the world looking for a real princess to marry.", "He met many princesses, but something always seemed wrong.", "One stormy night, a soaking wet girl knocked on the castle gate.", "She said she was a princess, though she did not look like one.", "The queen quietly placed a single pea on the bed frame.", "On top she stacked twenty mattresses and twenty feather quilts.", "In the morning the girl said she was black and blue from something hard.", "Only a true princess could be so sensitive, so the prince married her."],
      [["What was the weather?", "Stormy", "Sunny", "Snowy"], ["How many mattresses?", "Twenty", "Two", "One"], ["Who placed the pea?", "The queen", "The prince", "The girl"], ["Why did the prince marry her?", "She felt the pea", "She was rich", "She was wet"]],
    ],
  },
  {
    id: "cinderella", title: "Cinderella", emoji: "👠", cast: ["👸", "🎃", "👠"],
    k: [
      ["Cinderella is at the ball.", "She is with the prince.", "She ran out and was without one shoe.", "The shoe was hers, and he is so glad."],
      [["Where is Cinderella?", "At the ball", "In a boat", "At a farm"], ["Whose shoe was it?", "Hers", "The prince's", "A cat's"]],
    ],
    1: [
      ["Cinderella worked hard for her stepsisters.", "She could not go to the ball.", "Her fairy godmother made her a gown.", "She danced with the prince.", "At midnight she ran and lost a glass slipper.", "The prince found her, and it fit."],
      [["Who made her a gown?", "Her fairy godmother", "Her stepsister", "The prince"], ["What did she lose?", "A glass slipper", "A crown", "A ring"], ["What happened last?", "The slipper fit", "She worked hard", "She went to the ball"]],
    ],
    2: [
      ["Cinderella cooked and cleaned for her mean stepmother and stepsisters.", "When the prince held a royal ball, they would not let her go.", "Her fairy godmother appeared and waved a wand.", "A pumpkin became a coach, and her rags became a sparkling gown.", "\"Be home by midnight,\" the godmother warned.", "Cinderella danced with the prince all night.", "When the clock struck twelve, she ran and lost a glass slipper on the stairs.", "The prince searched the kingdom until he found the foot that fit.", "Cinderella forgave her stepsisters and married the prince."],
      [["What did the pumpkin become?", "A coach", "A gown", "A slipper"], ["When did she have to be home?", "By midnight", "At noon", "By dinner"], ["How did the prince find her?", "The slipper fit her foot", "She wrote a letter", "Her sisters told him"], ["What did Cinderella do for her stepsisters?", "Forgave them", "Punished them", "Left without a word"]],
    ],
  },
  {
    id: "hansel-gretel", title: "Hansel and Gretel", emoji: "🍬", cast: ["👦", "👧", "🏠"],
    k: [
      ["Hansel and Gretel are out in the woods.", "They see a house of candy.", "A witch is there.", "They ran out and are with their dad."],
      [["What is the house made of?", "Candy", "Bricks", "Straw"], ["Who are they with at the end?", "Their dad", "The witch", "A bear"]],
    ],
    1: [
      ["Hansel and Gretel got lost in the woods.", "They found a house made of candy.", "A witch lived inside.", "She locked Hansel in a cage.", "Clever Gretel tricked the witch.", "The children found their way home."],
      [["What was the house made of?", "Candy", "Wood", "Stone"], ["Who tricked the witch?", "Gretel", "Hansel", "Their dad"], ["What happened last?", "They found their way home", "They got lost", "They found the house"]],
    ],
    2: [
      ["Hansel and Gretel lived with their father at the edge of a deep forest.", "One day they wandered too far and could not find the path home.", "Their trail of bread crumbs had been eaten by birds.", "Deep in the woods, they found a cottage made of gingerbread and candy.", "A witch invited them in, then locked Hansel in a cage.", "Gretel pretended not to know how to check the oven.", "When the witch leaned in to show her, Gretel shoved her and shut the door.", "She freed her brother, and they filled their pockets with jewels.", "A friendly duck carried them across a lake toward home and their happy father."],
      [["What happened to the bread crumbs?", "Birds ate them", "Rain washed them", "Hansel ate them"], ["Who was locked in a cage?", "Hansel", "Gretel", "The duck"], ["How did they cross the lake?", "A duck carried them", "They swam", "In a boat"], ["What word describes Gretel?", "Clever", "Lazy", "Mean"]],
    ],
  },
  {
    id: "frog-prince", title: "The Frog Prince", emoji: "🐸", cast: ["🐸", "👸", "⚽"],
    k: [
      ["A girl had a little yellow ball.", "It was in the well.", "A frog got it out for her.", "The frog was a prince."],
      [["Where was the ball?", "In the well", "In a tree", "On the bed"], ["What was the frog?", "A prince", "A dog", "A king"]],
    ],
    1: [
      ["A princess dropped her golden ball in a well.", "A frog offered to get it.", "She promised to be his friend.", "Then she ran off without him.", "Her father said she must keep her promise.", "The frog turned into a prince."],
      [["What did she drop?", "A golden ball", "A crown", "A cup"], ["What did she promise?", "To be his friend", "To give him gold", "To sing"], ["What did the frog become?", "A prince", "A bird", "A fish"]],
    ],
    2: [
      ["A young princess loved to play with a golden ball beside an old well.", "One day the ball slipped from her hands and sank into the deep water.", "A frog popped up and offered to fetch it.", "In return, she promised he could eat from her plate and be her friend.", "As soon as she had the ball, she ran home and forgot him.", "That evening the frog knocked at the castle door.", "The king told his daughter that a promise must be kept.", "She let the frog in, and the spell broke, turning him into a prince.", "They became the best of friends."],
      [["Where did the ball sink?", "Into a well", "Into a lake", "Into the sea"], ["What did the princess do after getting the ball?", "Ran home and forgot him", "Thanked him", "Kissed him"], ["Who said to keep the promise?", "The king", "The frog", "The queen"], ["What is the lesson?", "Keep your promises", "Never play ball", "Frogs are scary"]],
    ],
  },
  {
    id: "puss-boots", title: "Puss in Boots", emoji: "🐈", cast: ["🐈", "👢", "🏰"],
    k: [
      ["A funny cat has boots.", "The cat is with his little man.", "The cat said to the ogre, can you be a mouse.", "The ogre was a mouse, and that was the end of him."],
      [["What does the cat have?", "Boots", "A hat", "A pig"], ["What did the ogre turn into?", "A mouse", "A lion", "A frog"]],
    ],
    1: [
      ["A poor young man got only a cat.", "The cat asked for boots.", "He tricked the king with gifts.", "He tricked an ogre into turning into a mouse.", "Then the cat caught the mouse.", "The young man got a castle."],
      [["What did the cat ask for?", "Boots", "Fish", "A hat"], ["What did the ogre turn into?", "A mouse", "A lion", "A bird"], ["What did the young man get?", "A castle", "A horse", "A boat"]],
    ],
    2: [
      ["When a miller died, his youngest son was left with only a cat.", "\"Give me boots and a bag, and I will make you rich,\" said the cat.", "Puss caught rabbits and gave them to the king as gifts from his master.", "He told everyone his master was the great Marquis of Carabas.", "Then Puss visited a rich ogre who could change shape.", "\"I bet you cannot become something as small as a mouse,\" said Puss.", "The proud ogre turned into a mouse, and Puss gobbled him up.", "The young man got the ogre's castle and married the princess."],
      [["What did the son get?", "A cat", "A mill", "A horse"], ["What gifts did Puss bring the king?", "Rabbits", "Boots", "Gold"], ["How did Puss beat the ogre?", "He tricked him into becoming a mouse", "He fought him", "He ran away"], ["What word describes Puss?", "Clever", "Lazy", "Shy"]],
    ],
  },
  {
    id: "thumbelina", title: "Thumbelina", emoji: "🌷", cast: ["🌷", "🧚", "🐦"],
    k: [
      ["A little girl was in a tulip.", "She was as little as a thumb.", "A bird was her friend.", "They flew to the sun, and she is with the flower people."],
      [["Where was the girl?", "In a tulip", "In a boat", "In a box"], ["Who was her friend?", "A bird", "A toad", "A mole"]],
    ],
    1: [
      ["A tiny girl grew in a tulip.", "She was no bigger than a thumb.", "A toad took her away.", "She helped a sick swallow get well.", "The swallow flew her to a warm land.", "There she met the flower prince."],
      [["Where did she grow?", "In a tulip", "In a tree", "In a shell"], ["Who did she help?", "A sick swallow", "A toad", "A fish"], ["Who did she meet?", "The flower prince", "A giant", "A queen"]],
    ],
    2: [
      ["A woman planted a magic seed, and a tulip bloomed.", "Inside sat a girl no bigger than a thumb, so she was named Thumbelina.", "One night a toad carried her off to marry her son.", "Friendly fish chewed the lily pad stem so she could float away.", "All winter she stayed with a field mouse in a cozy burrow.", "She found a frozen swallow and nursed it back to health.", "In spring the swallow flew her to a sunny land full of flowers.", "There she met a tiny flower prince, and she was given wings of her own."],
      [["How did she get her name?", "She was as small as a thumb", "She liked thumbs", "Her mom was Thumb"], ["Who helped her escape the toad?", "Friendly fish", "A mole", "A bird"], ["What did she do for the swallow?", "Nursed it back to health", "Built a nest", "Fed it worms"], ["What happened last?", "She got wings", "She met a toad", "She stayed with a mouse"]],
    ],
  },
  {
    id: "emperor-clothes", title: "The Emperor's New Clothes", emoji: "🤴", cast: ["🤴", "🧒", "👔"],
    k: [
      ["Two men said, look at this coat.", "There was no coat.", "The king was out in his underwear.", "A little one said, he has no coat on."],
      [["Was there a coat?", "No", "Yes", "Three coats"], ["Who said the truth?", "A little one", "The king", "The two men"]],
    ],
    1: [
      ["Two tricksters said they made magic cloth.", "Only smart people could see it.", "The emperor could not see it, but he said nothing.", "He walked in a parade.", "A child said he had no clothes.", "Everyone laughed."],
      [["Who made the cloth?", "Two tricksters", "The emperor", "A child"], ["Who could see the cloth?", "No one", "Smart people", "Only kids"], ["Who told the truth?", "A child", "The emperor", "The tricksters"]],
    ],
    2: [
      ["An emperor loved fancy clothes more than anything.", "Two tricksters said they could weave cloth that foolish people could not see.", "The emperor paid them a fortune in gold and silk.", "His helpers saw nothing on the looms, but they were afraid to say so.", "Even the emperor pretended to admire the invisible suit.", "He marched through town in a parade, wearing only his underwear.", "A small child shouted, \"He has nothing on!\"", "Then everyone laughed, and the emperor knew he had been fooled."],
      [["What did the emperor love?", "Fancy clothes", "Gold coins", "Horses"], ["Why did the helpers say nothing?", "They were afraid", "They saw the cloth", "They were asleep"], ["Who spoke the truth?", "A small child", "The tricksters", "The emperor"], ["What is the lesson?", "Be brave and tell the truth", "Buy magic cloth", "Parades are fun"]],
    ],
  },
  {
    id: "fox-crow", title: "The Fox and the Crow", emoji: "🧀", cast: ["🦊", "🐦‍⬛", "🧀"],
    k: [
      ["A crow had cheese up in a tree.", "The fox said, you are so pretty, can you sing.", "The crow sang, and the cheese fell out.", "The fox had the cheese."],
      [["What did the crow have?", "Cheese", "A hat", "A bone"], ["Who got the cheese?", "The fox", "The crow", "A dog"]],
    ],
    1: [
      ["A crow sat in a tree with cheese.", "A fox wanted the cheese.", "He said the crow had a lovely voice.", "The crow opened her beak to sing.", "The cheese fell down.", "The fox ate it and ran off."],
      [["Where was the crow?", "In a tree", "On a roof", "In a nest of eggs"], ["What did the fox say?", "She had a lovely voice", "She was ugly", "Go away"], ["What happened when she sang?", "The cheese fell", "The fox left", "It rained"]],
    ],
    2: [
      ["A crow found a piece of cheese and flew up to a high branch.", "A hungry fox saw her and wanted that cheese.", "\"What beautiful feathers you have,\" said the fox.", "\"Surely your voice is the sweetest of all the birds.\"", "The crow felt proud and wanted to show off.", "She opened her beak to caw, and the cheese dropped.", "The fox snapped it up and said, \"Next time, do not trust flatterers.\"", "The crow sat alone, hungry and wiser."],
      [["Where did the crow sit?", "On a high branch", "On the ground", "On the fox"], ["What did the fox praise?", "Her feathers and voice", "Her cheese", "Her nest"], ["Why did the cheese drop?", "She opened her beak", "The wind blew", "The branch broke"], ["What is the lesson?", "Do not trust flattery", "Crows sing well", "Cheese is best"]],
    ],
  },
  {
    id: "porridge-pot", title: "The Magic Porridge Pot", emoji: "🥣", cast: ["👧", "🥣", "🏘️"],
    k: [
      ["A girl has a little pot.", "Cook, little pot, she said, and it was full.", "Mom said cook, but not stop.", "It was out in the town, and they all had a lot."],
      [["What does the girl have?", "A little pot", "A cat", "A boat"], ["Where did it go?", "Out in the town", "Up a tree", "In a box"]],
    ],
    1: [
      ["A kind woman gave a girl a magic pot.", "If she said cook, it made porridge.", "If she said stop, it stopped.", "One day her mother said cook.", "She forgot the word stop.", "Porridge filled the whole town until the girl came home."],
      [["What did the pot make?", "Porridge", "Soup", "Gold"], ["What word made it stop?", "Stop", "Cook", "Please"], ["Who forgot the word?", "The mother", "The girl", "The woman"]],
    ],
    2: [
      ["A girl and her mother were so poor that they often went hungry.", "In the woods, an old woman gave the girl a little pot.", "\"Say cook, little pot, cook, and it will make sweet porridge,\" she said.", "\"Say stop, little pot, stop, and it will stop.\"", "One day, while the girl was out, her mother told the pot to cook.", "She ate her fill but forgot the magic words to stop it.", "Porridge spilled over the table, out the door, and down the street.", "When the girl came home, she said, \"Stop, little pot, stop,\" and it did.", "Anyone who wanted to get back into town had to eat their way in."],
      [["Who gave the girl the pot?", "An old woman", "Her mother", "A king"], ["Why were they hungry at first?", "They were poor", "They were sick", "They were lost"], ["What did the mother forget?", "The words to stop it", "Her spoon", "The way home"], ["How did it end?", "The girl said stop", "The pot broke", "The town moved"]],
    ],
  },
  {
    id: "belling-cat", title: "Belling the Cat", emoji: "🔔", cast: ["🐭", "🐈", "🔔"],
    k: [
      ["The mice are in a little hole.", "A cat is out there.", "One said, we can put a bell on the cat.", "But which one of us can do that?"],
      [["What is out there?", "A cat", "A dog", "A bee"], ["What will they put on the cat?", "A bell", "A hat", "A bow"]],
    ],
    1: [
      ["The mice were afraid of the cat.", "They had a meeting.", "A young mouse said to put a bell on the cat.", "Then they would hear it coming.", "Everyone cheered.", "An old mouse asked who would do it."],
      [["Who were the mice afraid of?", "The cat", "The dog", "An owl"], ["What was the plan?", "Put a bell on the cat", "Move away", "Build a wall"], ["What did the old mouse ask?", "Who would do it", "Where is the cat", "Can we eat"]],
    ],
    2: [
      ["The mice in an old house lived in fear of a sneaky cat.", "She crept so quietly that they never heard her coming.", "One night the mice held a meeting to make a plan.", "A young mouse stood up and said, \"Let us tie a bell around her neck.\"", "\"Then we will always hear her and have time to hide.\"", "All the mice squeaked and clapped at the clever idea.", "Then a wise old mouse asked, \"Who will tie the bell on the cat?\"", "Nobody answered, because a plan is easy to say but hard to do."],
      [["Why were the mice afraid?", "The cat was sneaky and quiet", "The cat was loud", "The house was cold"], ["Who had the bell idea?", "A young mouse", "The cat", "A wise old mouse"], ["Why did nobody answer?", "Nobody dared to do it", "They were asleep", "They had no bell"], ["What is the lesson?", "Plans are easier said than done", "Cats like bells", "Never hold meetings"]],
    ],
  },
];

function toQuestion([prompt, right, ...wrong]) {
  return {
    prompt,
    choices: [{ text: right, ok: true }, ...wrong.map((text) => ({ text, ok: false }))],
  };
}

export const LEVELS = ["k", "1", "2"];

export const stories = library.map(({ id, title, emoji, cast, ...levels }) => ({
  id,
  title,
  emoji,
  cast,
  levels: Object.fromEntries(
    LEVELS.map((level) => {
      const [sentences, questions] = levels[level];
      return [level, { sentences, questions: questions.map(toQuestion) }];
    }),
  ),
}));

/** Story level for a shared-profile grade: Pre-K and K read "k", 1st reads "1", 2nd and 3rd read "2". */
/** Story level for { grade, progress }: early in the year (review time) reads at last year's level. */
export function storyLevelFor(level) {
  const grades = ["PreK", "K", "1", "2", "3"];
  const i = grades.indexOf(level?.grade);
  if (i < 0) return storyLevel(undefined);
  const early = Number(level.progress ?? 1) < 0.34 && i > 0;
  return storyLevel(grades[early ? i - 1 : i]);
}

export function storyLevel(grade) {
  const g = String(grade ?? "").toLowerCase();
  if (g === "prek" || g === "k") return "k";
  if (g === "1") return "1";
  if (g === "2" || g === "3") return "2";
  return "1";
}
