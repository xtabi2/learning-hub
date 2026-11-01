# Sight Words

A mobile-first sight-word game with three modes:

- **Flash Cards** shows one big word. Tap **Read it to me**, or move with **Next**, **Previous**, a swipe, or the arrow keys.
- **Build a Sentence** deals a few words from the deck you picked. Tap or drag them into a short sentence. **Check** accepts any fair English sentence, not one fixed answer.
- **Story Time** is a set of short retellings of public-domain folk tales. Read a story, tap a word to hear it, then answer a few questions.

The look follows the [math fluency game](https://github.com/xtabi2/math-fluency-game): Vite, React, and large colorful buttons on a warm background.

The look and stack follow the [math fluency game](https://github.com/xtabi2/math-fluency-game): Vite, React, and large colorful buttons on a warm background.

## Word lists

Ohio's [Department of Education and Workforce](https://education.ohio.gov/) does not publish a statewide sight-word list. Kindergarten, 1st grade, and 2nd grade in this game are the **Big Walnut Local Schools** (Ohio) High Frequency Words Assessment lists, revised 2026. Cards follow the sheets from top to bottom, one column at a time.

| Grade | Source | Words |
| --- | --- | --- |
| Kindergarten | Big Walnut High Frequency Words Assessment, revised 2026 | 65 |
| 1st Grade | Big Walnut High Frequency Words Assessment, revised 2026 | 60 |
| 2nd Grade | Big Walnut High Frequency Words Assessment, revised 2026 | 75 |
| 3rd Grade | Dolch third-grade service words | 41 |

Big Walnut's assessment photos cover kindergarten through 2nd grade. 3rd grade uses Edward William Dolch's third-grade list from "A Basic Sight Vocabulary," *The Elementary School Journal* 36, no. 6 (1936): 456–460 (a readable reprint is [sightwords.com](https://sightwords.com/sight-words/dolch/)). That is the list Ohio districts commonly use when the state does not publish its own.

## 1st grade class words

Madison's 1st grade Core Knowledge Language Arts (CKLA) take-home words (Skills 1 lesson 25.1 and Skills 2 lesson 1.1, in `src/class-words.js`) are part of the 1st Grade deck, not a separate deck. Words already on the 1st grade list are not repeated, and a 1st grader's own deck always includes them. Tricky letters stay underlined on 1st Grade cards, matching the sheets.

Add a later lesson by appending an object to the `lessons` array in `src/class-words.js`.

## Pre-K and K

Pre-K uses the Kindergarten words and Kindergarten stories. Pre-K and K kids hear the prompts read aloud (with a speaker button to replay) and get picture feedback, so text is never the only instruction.

## Build a Sentence

The checker lives in `src/grade-sentence.js`. It allows more than one right answer. `I can see you` passes, and `you can see I` does not. `The big pig can run` and `The pig can run` both pass. A singular noun still needs a verb that agrees, so `The big pig run` does not.

Word sets are in `src/sentence-sets.js`. Each set uses only words from that deck, and at least one order is a real sentence. Add a set there when you want more practice.

## Story Time

The stories are original 5 or 6 sentence retellings of public-domain tales: The Three Little Pigs, Goldilocks, The Tortoise and the Hare, The Little Red Hen, The Gingerbread Man, The Three Billy Goats Gruff, The Ugly Duckling, and Jack and the Beanstalk. Pictures are original SVG drawings. Add a story by appending an object to `src/stories.js`.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes a static site to `dist/`.

Speech uses the browser's built-in `speechSynthesis` API. No API key is required. A browser that blocks autoplay still speaks when the child taps the button.
