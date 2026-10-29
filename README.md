# Sight Words

A mobile-first flash card game for practicing sight words in kindergarten through grade 3. Pick a grade, see one big word, and tap **Read it to me** to hear it. Move with **Next** and **Previous**, swipe (left for the next card, right for the previous one), or use the arrow keys.

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

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes a static site to `dist/`.

Speech uses the browser's built-in `speechSynthesis` API. No API key is required. A browser that blocks autoplay still speaks when the child taps the button.
