/**
 * Glowtrail per-planet TTS lines by storyReadingBand.
 * Keys ONLY: emerging | early | growing | fluent-ms
 * Select via clamp(interpolatedBand, start, peak); never above personal peak.
 */
import type { StoryReadingBand } from "./storyReadingBand";
import { pickBeatLine } from "./narrativeBible";

/** Beat keys for modular planet narrative tables. */
export type PlanetBeatKey =
  | "arrive"
  | "gearLocked"
  | "gearUnlocked"
  | "start"
  | "win";

export type BandedBeatLines = Record<StoryReadingBand, string>;
export type BandedPlanetPack = Record<PlanetBeatKey, BandedBeatLines>;

export const GLOWTRAIL_BANDED_SCRIPTS: Record<string, BandedPlanetPack> = {
  mistwhisper: {
    arrive: {
      emerging: "Mistwhisper. Soft fog. Shy words.",
      early: "Mistwhisper! Soft fog. Shy words hiding.",
      growing: "Mistwhisper! Soft fog. Shy words hiding. Don't worry—I'm a lantern now. Sort of.",
      "fluent-ms": "Mistwhisper rolls in soft. Shy words hide in the fog—don't worry, I'm a lantern now. Sort of.",
    },
    gearLocked: {
      emerging: "Need a glow lantern first.",
      early: "Need a glow lantern first. I can fake one.",
      growing: "Need a glow lantern first. I can fake one... but the real one is brighter.",
      "fluent-ms": "Need a glow lantern first. I can fake one, but the real lantern is brighter.",
    },
    gearUnlocked: {
      emerging: "Lantern on!",
      early: "Lantern on! Fog, meet shiny.",
      growing: "Lantern on! Fog, meet shiny.",
      "fluent-ms": "Lantern on. Fog, meet shiny.",
    },
    start: {
      emerging: "Shine your light. Say hi.",
      early: "Shine your light. Say hi to the words.",
      growing: "Shine your light. Say hi to the words. They'll come out.",
      "fluent-ms": "Shine your light and say hi to the words—they'll come out when ready.",
    },
    win: {
      emerging: "Fog friends found! Mistwhisper glows.",
      early: "Fog friends found! Mistwhisper is glowing.",
      growing: "Fog friends found! Mistwhisper is glowing. Spark for the Story Star!",
      "fluent-ms": "Fog friends found. Mistwhisper glows—spark for the Story Star.",
    },
  },
  bouncebloom: {
    arrive: {
      emerging: "Bouncebloom! Springs. Whee!",
      early: "Bouncebloom! Everything springs. Including my goo.",
      growing: "Bouncebloom! Everything springs. Including my goo. Whee—okay I'm okay.",
      "fluent-ms": "Bouncebloom! Everything springs—including my goo. Whee—okay, I'm okay.",
    },
    gearLocked: {
      emerging: "Spring boots first.",
      early: "Spring boots first. Or we bounce into space.",
      growing: "Spring boots first. Otherwise we bounce into space. That's a bad bounce.",
      "fluent-ms": "Spring boots first—otherwise we bounce into space. That's a bad bounce.",
    },
    gearUnlocked: {
      emerging: "Boots on!",
      early: "Boots on! Boing mode.",
      growing: "Boots on! Boing mode: go.",
      "fluent-ms": "Boots on. Boing mode: go.",
    },
    start: {
      emerging: "Hop the path. Soft landing.",
      early: "Hop the path. Catch the bouncing lines.",
      growing: "Hop the path. Catch the bouncing lines. Soft landing, big pilot.",
      "fluent-ms": "Hop the path, catch the bouncing lines—soft landing, big pilot.",
    },
    win: {
      emerging: "Best bounce! Bouncebloom lit.",
      early: "Best bounce ever! Bouncebloom lit.",
      growing: "Best bounce ever! Bouncebloom lit. The Star got a giggle.",
      "fluent-ms": "Best bounce ever. Bouncebloom lit—the Story Star got a giggle.",
    },
  },
  "echo-canyon": {
    arrive: {
      emerging: "Echo Canyon. It copies you.",
      early: "Echo Canyon! It copies you... wrong on purpose.",
      growing: "Echo Canyon! It copies you... wrong on purpose. Rude. Funny. Rude-funny.",
      "fluent-ms": "Echo Canyon copies you wrong on purpose—rude, funny, rude-funny.",
    },
    gearLocked: {
      emerging: "We need echo headphones.",
      early: "Grab the echo headphones. Catch the silly copies.",
      growing: "Grab the echo headphones. So we can catch the silly copies.",
      "fluent-ms": "Echo headphones first—those counterfeit copies won’t catch themselves.",
    },
    gearUnlocked: {
      emerging: "Headphones on.",
      early: "Headphones ready. Bad echoes, watch out.",
      growing: "Headphones ready. Bad echoes, you’re toast.",
      "fluent-ms": "Headphones primed. Counterfeit echoes: you’re done.",
    },
    start: {
      emerging: "Listen. Fix the echo.",
      early: "Listen. Fix the echo. Stop the giggle-collapse.",
      growing: "Listen. Fix the echo. Stop the giggle-collapse.",
      "fluent-ms": "Listen, fix the echo, and stop the giggle-collapse.",
    },
    win: {
      emerging: "Echo fixed! Canyon shines.",
      early: "Echo fixed! Cliffs calm. Canyon shining.",
      growing: "Echo fixed! Cliffs calm. Canyon shining. Nice catch.",
      "fluent-ms": "Echo fixed. Cliffs calm, canyon shining—nice catch.",
    },
  },
  bubbledeep: {
    arrive: {
      emerging: "Bubbledeep! Chatty bubbles.",
      early: "Bubbledeep! Chatty bubbles everywhere.",
      growing: "Bubbledeep! Chatty bubbles everywhere. I'll be a fishbowl helmet. Fashion!",
      "fluent-ms": "Bubbledeep: chatty bubbles everywhere. I'll be a fishbowl helmet. Fashion!",
    },
    gearLocked: {
      emerging: "Scuba bubbles first.",
      early: "Scuba bubbles first. Dry pilots float... briefly.",
      growing: "Scuba bubbles first. Dry pilots only float... briefly.",
      "fluent-ms": "Scuba bubbles first—dry pilots only float briefly.",
    },
    gearUnlocked: {
      emerging: "Bubbles on.",
      early: "Bubbles on. Underwater crew.",
      growing: "Bubbles on. Underwater crew: activate.",
      "fluent-ms": "Bubbles on. Underwater crew: activate.",
    },
    start: {
      emerging: "Catch the matching bubble.",
      early: "Catch the matching bubble. Before it pops!",
      growing: "Catch the matching bubble. Before it pops into sparkles!",
      "fluent-ms": "Catch the matching bubble before it pops into sparkles.",
    },
    win: {
      emerging: "Pop-perfect! Bubbledeep bright.",
      early: "Pop-pop-perfect! Bubbledeep is bright.",
      growing: "Pop-pop-perfect! Bubbledeep is bright. Splash win.",
      "fluent-ms": "Pop-pop-perfect. Bubbledeep is bright—splash win.",
    },
  },
  "sizzle-rock": {
    arrive: {
      emerging: "Sizzle Rock! Hot hot hot.",
      early: "Sizzle Rock! Hot hot hot. Marshmallow mode: OFF.",
      growing: "Sizzle Rock! Hot hot hot. Marshmallow mode: OFF.",
      "fluent-ms": "Sizzle Rock is hot-hot-hot. Marshmallow mode: OFF.",
    },
    gearLocked: {
      emerging: "Fire suit time.",
      early: "Fire suit time. Real suit is better.",
      growing: "Fire suit time. I tried being a fire suit. I got toasty. Real suit is better.",
      "fluent-ms": "Fire suit time. I tried being one and got toasty—the real suit is better.",
    },
    gearUnlocked: {
      emerging: "Suit sealed.",
      early: "Suit sealed. Lava, behave.",
      growing: "Suit sealed. Lava, behave.",
      "fluent-ms": "Suit sealed. Lava, behave.",
    },
    start: {
      emerging: "Say the line out loud.",
      early: "Say the line out loud. Cool the trail.",
      growing: "Say the line out loud. Cool the trail. You've got this.",
      "fluent-ms": "Say the line out loud, cool the trail—you've got this.",
    },
    win: {
      emerging: "Lava cooled! Sizzle Rock shines.",
      early: "Lava cooled! Sizzle Rock shines. Not toast!",
      growing: "Lava cooled! Sizzle Rock shines. We did not become toast. Pride!",
      "fluent-ms": "Lava cooled. Sizzle Rock shines. We did not become toast. Pride!",
    },
  },
  flipcliff: {
    arrive: {
      emerging: "Flipcliff! Upside down.",
      early: "Flipcliff! Upside down. My top is my bottom.",
      growing: "Flipcliff! Upside down. My top is my bottom. Don't laugh. Okay laugh a little.",
      "fluent-ms": "Flipcliff flips everything—my top is my bottom. Don't laugh. Okay, laugh a little.",
    },
    gearLocked: {
      emerging: "Sticky boots first.",
      early: "Sticky boots first. Please do not drop the pilot.",
      growing: "Sticky boots first. Please do not drop the pilot.",
      "fluent-ms": "Sticky boots first—please do not drop the pilot.",
    },
    gearUnlocked: {
      emerging: "Boots sticky.",
      early: "Boots sticky. Ceiling is floor.",
      growing: "Boots sticky. Ceiling is floor. Let's walk weird.",
      "fluent-ms": "Boots sticky. Ceiling is floor. Let's walk weird.",
    },
    start: {
      emerging: "Stick to the trail.",
      early: "Stick to the trail. Follow the signs.",
      growing: "Stick to the trail. Follow the signs. No space-dropping.",
      "fluent-ms": "Stick to the trail, follow the signs—no space-dropping.",
    },
    win: {
      emerging: "Right-side-up win! Flipcliff lit.",
      early: "Right-side-up win! Flipcliff lit. Boots did their job.",
      growing: "Right-side-up win! Flipcliff lit. Boots did their job. So did you.",
      "fluent-ms": "Right-side-up win. Flipcliff lit. Boots did their job—and so did you.",
    },
  },
  "softsnow-drift": {
    arrive: {
      emerging: "Softsnow Drift. Shh. Soft steps.",
      early: "Softsnow Drift. Shh. Sleepy snowflakes. Soft voice.",
      growing: "Softsnow Drift. Shh. Sleepy story-snowflakes. Tiptoe voice.",
      "fluent-ms": "Softsnow Drift asks for hush. Sleepy story-snowflakes prefer a tiptoe voice.",
    },
    gearLocked: {
      emerging: "We need a hush scarf.",
      early: "Hush scarf first. Quiet gear.",
      growing: "Hush scarf first. Quiet gear for a quiet world.",
      "fluent-ms": "Hush scarf first—quiet gear for a quieter world.",
    },
    gearUnlocked: {
      emerging: "Scarf on.",
      early: "Hush scarf on. Whisper mode.",
      growing: "Hush scarf on. Whisper mode: me.",
      "fluent-ms": "Hush scarf on. Whisper mode: engaged (that’s me).",
    },
    start: {
      emerging: "Careful words. Wake one snowflake.",
      early: "Careful words. Wake one snowflake at a time.",
      growing: "Careful words. Wake one snowflake at a time. Gentle pilot.",
      "fluent-ms": "Choose careful words and wake one snowflake at a time, gentle pilot.",
    },
    win: {
      emerging: "Snowflakes awake! Softsnow glows.",
      early: "Snowflakes awake! Softsnow glowing soft and proud.",
      growing: "Snowflakes awake! Softsnow glowing soft and proud. Beautiful.",
      "fluent-ms": "Snowflakes awake. Softsnow glows soft and proud. Honestly beautiful.",
    },
  },
  "sparktown-dock": {
    arrive: {
      emerging: "Sparktown Dock. Busy bots. Light mail.",
      early: "Sparktown Dock! Busy bots. Tiny light packages. Mail for the Story Star!",
      growing: "Sparktown Dock! Busy bots. Tiny light packages. Story Star mail call!",
      "fluent-ms": "Sparktown Dock: bustling bots, tiny light packages, and one very important Story Star mail call.",
    },
    gearLocked: {
      emerging: "We need sorter gloves.",
      early: "Sorter gloves first. Spark mail is tricky.",
      growing: "Sorter gloves first. Sticky fingers, meet spark mail.",
      "fluent-ms": "Sorter gloves first—spark mail and sticky fingers need boundaries.",
    },
    gearUnlocked: {
      emerging: "Gloves on.",
      early: "Gloves on. Let's sort.",
      growing: "Gloves on. Let's sort like champions.",
      "fluent-ms": "Gloves on. Champion-level sorting: commence.",
    },
    start: {
      emerging: "Help the bots. Right spark. Right box.",
      early: "Help the dockbots. Right spark, right box.",
      growing: "Help the dockbots. Right spark, right box. Make the Star's mailbox happy.",
      "fluent-ms": "Help the dockbots: right spark, right box, happiest Story Star mailbox in the galaxy.",
    },
    win: {
      emerging: "Mail sent! Sparktown shines. Glowtrail brighter.",
      early: "Mail delivered! Sparktown shining! Glowtrail brighter. Ship upgrade next?",
      growing: "Mail delivered! Sparktown shining! Glowtrail Galaxy... brighter. Thrusters next? I can be a wrench.",
      "fluent-ms": "Mail delivered. Sparktown blazing. Glowtrail brighter. Thrusters next? I can temporarily become a wrench.",
    },
  },
};

export function bandedPlanetLine(
  planetId: string,
  beat: PlanetBeatKey,
  band: StoryReadingBand,
  runSeed: number = 0,
): string {
  const pack = GLOWTRAIL_BANDED_SCRIPTS[planetId];
  if (!pack) return "";
  return pickBeatLine(pack[beat]?.[band], runSeed);
}
