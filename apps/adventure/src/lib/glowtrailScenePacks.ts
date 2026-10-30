/**
 * Glowtrail planet scenePacks — full CW catalog (8 planets × 2).
 * beats[band].{arrive, optionalMid[], start, win}; gear on default planet beats.
 * V1.5 picker: hash(runSeed, planetId, "scene") % 2
 */
import type { StoryReadingBand } from "./storyReadingBand";
import { pickBeatLine, type BeatLineValue } from "./narrativeBible";

export type SceneBeatSet = {
  arrive: BeatLineValue;
  optionalMid?: readonly BeatLineValue[];
  start: BeatLineValue;
  win: BeatLineValue;
};

export type ScenePack = {
  id: string;
  tags?: readonly string[];
  weight?: number;
  beats: Record<StoryReadingBand, SceneBeatSet>;
};

export const PLANET_ID_ALIASES: Record<string, string> = {
  echocanyon: "echo-canyon",
  softsnowdrift: "softsnow-drift",
  sparktowndock: "sparktown-dock",
  sizzlerock: "sizzle-rock",
};

export function canonicalPlanetId(id: string): string {
  return PLANET_ID_ALIASES[id] ?? id;
}

export const GLOWTRAIL_SCENE_PACKS: Record<string, readonly ScenePack[]> = {
  "bouncebloom": [
    {
      id: "boing_path",
      tags: ["funny", "active"],
      beats: {
        emerging: {
          arrive: "Bouncebloom. Things bounce. Whee!",
          optionalMid: ["Soft knees. Big hops."],
          start: "Hop the path. Catch the lines.",
          win: "Great bounce! Planet lit.",
        },
        early: {
          arrive: "Bouncebloom! Everything springs. Even my goo. Whee!",
          optionalMid: ["Bend your knees. Count the hops."],
          start: "Hop the path. Catch the bouncing lines.",
          win: "Best bounce! Bouncebloom lit.",
        },
        growing: {
          arrive: "Bouncebloom! Everything springs. Including my goo. Whee—okay I’m okay.",
          optionalMid: ["Boing with purpose. The path likes confident hops."],
          start: "Hop the path. Catch the bouncing lines. Soft landing, big pilot.",
          win: "Best bounce ever! Bouncebloom lit. The Star got a giggle.",
        },
        "fluent-ms": {
          arrive: "Bouncebloom: where gravity has opinions and my goo briefly becomes a trampoline. Whee—okay, dignity restored.",
          optionalMid: ["Boing with purpose—the path rewards confident hops."],
          start: "Hop the true path and catch each bouncing line—soft landing, legendary pilot.",
          win: "Championship bounce. Bouncebloom lit. Pretty sure the Story Star just giggled.",
        },
      },
    },
    {
      id: "giggle_springs",
      tags: ["silly", "musical"],
      beats: {
        emerging: {
          arrive: "Bouncebloom. Springs sing. Ha!",
          optionalMid: ["Hop to the beat."],
          start: "Hop. Catch. Bounce. Win.",
          win: "Singing springs! Planet lit.",
        },
        early: {
          arrive: "Bouncebloom! The springs sing when we hop.",
          optionalMid: ["Match the beat. Then catch the line."],
          start: "Hop to the spring-song. Catch the bouncing lines.",
          win: "Spring-song win! Bouncebloom glowing.",
        },
        growing: {
          arrive: "New Bouncebloom mood: the springs hum a giggle-song when you land just right.",
          optionalMid: ["Listen—hop on the beat, then snag the line."],
          start: "Ride the giggle-springs. Catch every bouncing line before it springs away.",
          win: "Giggle-springs conquered! Bouncebloom lit. Encore spark for the Star.",
        },
        "fluent-ms": {
          arrive: "Bouncebloom’s springs are composing a giggle-song—land just right and they harmonize.",
          optionalMid: ["Listen for the beat, then snag the line mid-boing."],
          start: "Ride the giggle-springs and catch every bouncing line before it ricochets into orbit.",
          win: "Giggle-springs conquered. Bouncebloom lit—an encore spark for the Story Star.",
        },
      },
    },
  ],
  "echo-canyon": [
    {
      id: "fix_the_copy",
      tags: ["mystery", "classic"],
      beats: {
        emerging: {
          arrive: "Echo Canyon. It copies you. Sometimes wrong.",
          optionalMid: ["Listen close."],
          start: "Listen. Fix the echo.",
          win: "Echo fixed! Canyon shines.",
        },
        early: {
          arrive: "Echo Canyon! It copies you… wrong on purpose. Rude. Funny.",
          optionalMid: ["Find the wrong copy."],
          start: "Listen. Fix the echo. Keep the cliffs safe.",
          win: "Echo fixed! Cliffs calm. Canyon shining.",
        },
        growing: {
          arrive: "Echo Canyon! It copies you… wrong on purpose. Rude. Funny. Rude-funny.",
          optionalMid: ["Spot the fake echo before the cliffs giggle."],
          start: "Listen. Fix the echo. Stop the giggle-collapse.",
          win: "Echo fixed! Cliffs calm. Canyon shining. Nice catch.",
        },
        "fluent-ms": {
          arrive: "Echo Canyon repeats you—incorrectly, on purpose. Rude. Hilarious. Dangerously rude-funny.",
          optionalMid: ["Hunt the counterfeit echo before the cliffs join the joke."],
          start: "Listen hard, correct the false echo, and stop the giggle-collapse before the cliffs join in.",
          win: "Echo corrected. Cliffs calm. Canyon shining. Excellent catch, pilot.",
        },
      },
    },
    {
      id: "polite_echo",
      tags: ["cozy", "manners"],
      beats: {
        emerging: {
          arrive: "Echo Canyon. Teach it please.",
          optionalMid: ["Say please. Then fix."],
          start: "Be kind. Fix the echo.",
          win: "Polite echo! Canyon glows.",
        },
        early: {
          arrive: "Echo Canyon needs manners. It yells back rude copies.",
          optionalMid: ["Try ‘please’—then catch the wrong echo."],
          start: "Ask politely. Fix the rude echo.",
          win: "Manners win! Echo Canyon shining.",
        },
        growing: {
          arrive: "Today’s canyon mission: teach the echo some manners. It’s yelling rude copies again.",
          optionalMid: ["A nice ‘please’ softens it—then scoop the fake."],
          start: "Be politely brave. Fix the rude echo before the cliffs crack up.",
          win: "Polite pilot for the win! Echo Canyon lit and much nicer.",
        },
        "fluent-ms": {
          arrive: "Echo Canyon failed manners class—it’s shouting rude copies like a comedian with no filter.",
          optionalMid: ["Lead with please; then scoop the counterfeit echo."],
          start: "Stay politely brave, correct the rude echo, and keep the cliffs from laughing themselves loose.",
          win: "Manners: acquired. Echo Canyon lit—and slightly more polite.",
        },
      },
    },
  ],
  "bubbledeep": [
    {
      id: "match_pop",
      tags: ["classic", "splash"],
      beats: {
        emerging: {
          arrive: "Bubbledeep. Bubbles talk. I am a fishbowl.",
          optionalMid: ["Pop? Not yet."],
          start: "Catch the matching bubble.",
          win: "Pop! Bubbledeep is bright.",
        },
        early: {
          arrive: "Bubbledeep! Chatty bubbles. I’ll be a fishbowl helmet.",
          optionalMid: ["Find the twin bubble."],
          start: "Catch the matching bubble. Before it pops!",
          win: "Pop-pop-perfect! Bubbledeep is bright.",
        },
        growing: {
          arrive: "Bubbledeep! Chatty bubbles everywhere. I’ll be a fishbowl helmet. Fashion!",
          optionalMid: ["Listen for the bubble that matches—then catch it."],
          start: "Catch the matching bubble. Before it pops into sparkles!",
          win: "Pop-pop-perfect! Bubbledeep is bright. Splash win.",
        },
        "fluent-ms": {
          arrive: "Bubbledeep: an ocean of gossip bubbles. I’ll be the fishbowl helmet. It’s called fashion, thank you.",
          optionalMid: ["Tune your ears—catch the twin before it sparkles away."],
          start: "Match the right bubble before it bursts into sparkles.",
          win: "Pop-pop-perfect. Bubbledeep blazing. Official splash win.",
        },
      },
    },
    {
      id: "bubble_parade",
      tags: ["musical", "silly"],
      beats: {
        emerging: {
          arrive: "Bubbledeep. Bubbles parade!",
          optionalMid: ["March. Then catch."],
          start: "Catch parade bubble.",
          win: "Parade win! Bright sea.",
        },
        early: {
          arrive: "Bubbledeep throws a bubble parade. Marching pops everywhere.",
          optionalMid: ["Follow the parade. Grab the match."],
          start: "Catch the parade’s matching bubble before the big pop.",
          win: "Parade perfect! Bubbledeep glowing.",
        },
        growing: {
          arrive: "Bubbledeep’s throwing a bubble parade—chatty, floaty, extremely extra.",
          optionalMid: ["March with them, then snag the matching float."],
          start: "Join the parade just long enough to catch the matching bubble.",
          win: "Parade champion! Bubbledeep lit. Confetti = sparkles.",
        },
        "fluent-ms": {
          arrive: "Bubbledeep is hosting a full bubble parade—chatty, floaty, and deeply committed to drama.",
          optionalMid: ["Parade first; matching catch second."],
          start: "Slip into the parade, claim the matching bubble, and exit before the finale pop.",
          win: "Parade champion. Bubbledeep lit—sparkle confetti included.",
        },
      },
    },
  ],
  "sizzle-rock": [
    {
      id: "no_toast",
      tags: ["brave", "classic"],
      beats: {
        emerging: {
          arrive: "Sizzle Rock. Hot hot hot.",
          optionalMid: ["Suit on. Be brave."],
          start: "Say the line out loud. Cool the path.",
          win: "Lava cool! Rock shines.",
        },
        early: {
          arrive: "Sizzle Rock! Hot hot hot. No toasting us.",
          optionalMid: ["Fire suit ready. You’ve got this."],
          start: "Say the line out loud. Cool the trail. You can do it.",
          win: "Lava cooled! Sizzle Rock shines. Not toast!",
        },
        growing: {
          arrive: "Sizzle Rock! Hot hot hot. Marshmallow mode: OFF.",
          optionalMid: ["Suit sealed. Brave voice ready."],
          start: "Say the line out loud. Cool the trail. You’ve got this.",
          win: "Lava cooled! Sizzle Rock shines. We did not become toast. Pride!",
        },
        "fluent-ms": {
          arrive: "Sizzle Rock sends heat-wave greetings. Marshmallow mode: firmly OFF.",
          optionalMid: ["Suit sealed. Brave voice online."],
          start: "Speak the line out loud and cool the trail. You’ve got this.",
          win: "Lava cooled, Sizzle Rock shining, crew not toasted. Pride levels: maximum.",
        },
      },
    },
    {
      id: "cool_karaoke",
      tags: ["musical", "funny"],
      beats: {
        emerging: {
          arrive: "Sizzle Rock. Sing cool.",
          optionalMid: ["Loud words. Cool lava."],
          start: "Say it loud. Cool it down.",
          win: "Cool song win!",
        },
        early: {
          arrive: "Sizzle Rock wants a cool-down song—said out loud.",
          optionalMid: ["Microphone = your voice."],
          start: "Say the line loud like a song. Cool the trail.",
          win: "Cool karaoke! Sizzle Rock glowing.",
        },
        growing: {
          arrive: "Sizzle Rock’s lava listens to karaoke. Loud, clear lines cool the trail.",
          optionalMid: ["Imagine a tiny mic. Nibbles can be one."],
          start: "Belt the line out loud. Cool every glowing step.",
          win: "Cool-karaoke legend! Sizzle Rock lit. Encore spark.",
        },
        "fluent-ms": {
          arrive: "Sizzle Rock runs on cool-down karaoke—lava respects a clear, brave voice.",
          optionalMid: ["Nibbles morphs into a questionable microphone. Commit."],
          start: "Belt the line like you mean it and cool every glowing step of the trail.",
          win: "Cool-karaoke legend. Sizzle Rock lit—request that encore spark.",
        },
      },
    },
  ],
  "flipcliff": [
    {
      id: "sticky_trail",
      tags: ["classic", "dizzy"],
      beats: {
        emerging: {
          arrive: "Flipcliff. Upside down. Whoa.",
          optionalMid: ["Boots sticky. Go slow."],
          start: "Stick to the trail.",
          win: "You did it! Flipcliff lit.",
        },
        early: {
          arrive: "Flipcliff! Upside down. My top is my bottom.",
          optionalMid: ["Sticky boots. Follow signs."],
          start: "Stick to the trail. Follow the signs.",
          win: "Right-side-up win! Flipcliff lit.",
        },
        growing: {
          arrive: "Flipcliff! Upside down. My top is my bottom. Don’t laugh. Okay laugh a little.",
          optionalMid: ["Sticky boots. Weird walking authorized."],
          start: "Stick to the trail. Follow the signs. No space-dropping.",
          win: "Right-side-up win! Flipcliff lit. Boots did their job. So did you.",
        },
        "fluent-ms": {
          arrive: "Flipcliff flipped the world. My top is my bottom. Don’t laugh—okay, a little is allowed.",
          optionalMid: ["Sticky boots on. Weird walking: authorized."],
          start: "Stay glued to the trail, follow the signs, and absolutely no space-dropping.",
          win: "Right-side-up victory. Flipcliff lit. Boots performed. So did you.",
        },
      },
    },
    {
      id: "ceiling_picnic",
      tags: ["cozy", "silly"],
      beats: {
        emerging: {
          arrive: "Flipcliff. Picnic on ceiling?",
          optionalMid: ["Hold snacks. Hold boots."],
          start: "Walk the sticky picnic trail.",
          win: "Ceiling picnic win!",
        },
        early: {
          arrive: "Flipcliff picnic—on the ceiling. Don’t drop the snacks.",
          optionalMid: ["Sticky boots. Careful crumbs."],
          start: "Follow the sticky picnic trail. Keep snacks in space.",
          win: "Ceiling picnic success! Flipcliff lit.",
        },
        growing: {
          arrive: "Plot twist: Flipcliff is hosting a ceiling picnic. Gravity said no. We said yes.",
          optionalMid: ["Sticky boots, careful crumbs, zero snack-dropping."],
          start: "Walk the sticky picnic path. Signs first, sandwiches second.",
          win: "Ceiling picnic champions! Flipcliff lit. Snacks survived.",
        },
        "fluent-ms": {
          arrive: "Flipcliff invited us to a ceiling picnic. Gravity declined. We RSVP’d anyway.",
          optionalMid: ["Sticky boots, crumb discipline, no snack casualties."],
          start: "Follow the sticky picnic path—signs first, sandwiches second, space third (never).",
          win: "Ceiling picnic champions. Flipcliff lit. Snacks: heroically intact.",
        },
      },
    },
  ],
  "softsnow-drift": [
    {
      id: "tiptoe_wake",
      tags: ["cozy", "gentle"],
      beats: {
        emerging: {
          arrive: "Softsnow Drift. Shh. Soft steps.",
          optionalMid: ["Quiet voice."],
          start: "Careful words. Wake one snowflake.",
          win: "Snowflakes awake! Softsnow glows.",
        },
        early: {
          arrive: "Softsnow Drift. Shh. Sleepy snowflakes. Soft voice.",
          optionalMid: ["Tiptoe words only."],
          start: "Careful words. Wake one snowflake at a time.",
          win: "Snowflakes awake! Softsnow glowing soft and proud.",
        },
        growing: {
          arrive: "Softsnow Drift. Shh. Sleepy story-snowflakes. Tiptoe voice.",
          optionalMid: ["Whisper mode: me. Gentle mode: you."],
          start: "Careful words. Wake one snowflake at a time. Gentle pilot.",
          win: "Snowflakes awake! Softsnow glowing soft and proud. Beautiful.",
        },
        "fluent-ms": {
          arrive: "Softsnow Drift asks for hush. Sleepy story-snowflakes prefer a tiptoe voice.",
          optionalMid: ["Whisper mode engaged. Gentle pilot preferred."],
          start: "Choose careful words and wake one snowflake at a time, gentle pilot.",
          win: "Snowflakes awake. Softsnow glows soft and proud. Honestly beautiful.",
        },
      },
    },
    {
      id: "snowflake_lullaby",
      tags: ["musical", "soft"],
      beats: {
        emerging: {
          arrive: "Softsnow. Soft song.",
          optionalMid: ["Hum. Then wake."],
          start: "Soft words. Wake snowflakes.",
          win: "Lullaby win! Glow.",
        },
        early: {
          arrive: "Softsnow Drift likes a tiny lullaby before waking.",
          optionalMid: ["Hum soft. Then careful words."],
          start: "Sing soft. Wake one snowflake at a time.",
          win: "Lullaby worked! Softsnow glowing.",
        },
        growing: {
          arrive: "The snowflakes want a micro-lullaby—then they’ll wake for your words.",
          optionalMid: ["Hum with me. Then tiptoe the line."],
          start: "Soft lullaby first. Careful words next. One snowflake at a time.",
          win: "Lullaby legend! Softsnow lit soft and proud.",
        },
        "fluent-ms": {
          arrive: "Softsnow’s story-snowflakes negotiate: one micro-lullaby, then they’ll wake for your words.",
          optionalMid: ["Hum along—then tiptoe the line."],
          start: "Offer a soft lullaby, then wake one snowflake at a time with careful words.",
          win: "Lullaby legend. Softsnow lit—soft, proud, and perfectly hush-adjacent.",
        },
      },
    },
  ],
  "sparktown-dock": [
    {
      id: "mail_sort",
      tags: ["classic", "busy"],
      beats: {
        emerging: {
          arrive: "Sparktown Dock. Busy bots. Light mail.",
          optionalMid: ["Right spark. Right box."],
          start: "Help the bots. Right spark. Right box.",
          win: "Mail sent! Sparktown shines. Glowtrail brighter.",
        },
        early: {
          arrive: "Sparktown Dock! Busy bots. Tiny light packages. Mail for the Story Star!",
          optionalMid: ["Sort careful. Spark mail is tricky."],
          start: "Help the dockbots. Right spark, right box.",
          win: "Mail delivered! Sparktown shining! Glowtrail brighter. Ship upgrade next?",
        },
        growing: {
          arrive: "Sparktown Dock! Busy bots. Tiny light packages. Story Star mail call!",
          optionalMid: ["Sticky fingers, meet spark mail. Gloves help."],
          start: "Help the dockbots. Right spark, right box. Make the Star’s mailbox happy.",
          win: "Mail delivered! Sparktown shining! Glowtrail Galaxy… brighter. Thrusters next? I can be a wrench.",
        },
        "fluent-ms": {
          arrive: "Sparktown Dock: bustling bots, tiny light packages, and one very important Story Star mail call.",
          optionalMid: ["Spark mail vs sticky fingers—gloves set boundaries."],
          start: "Help the dockbots: right spark, right box, happiest Story Star mailbox in the galaxy.",
          win: "Mail delivered. Sparktown blazing. Glowtrail brighter. Thrusters next? I can temporarily become a wrench.",
        },
      },
    },
    {
      id: "dockbot_penpal",
      tags: ["friendship", "subplot-seed"],
      beats: {
        emerging: {
          arrive: "Sparktown. A bot waves. Hi!",
          optionalMid: ["Help your bot friend."],
          start: "Sort mail with your bot pal.",
          win: "Bot pal happy! Dock shines.",
        },
        early: {
          arrive: "Sparktown Dock! A shy dockbot waves—wants a pen-pal pilot.",
          optionalMid: ["Wave back. Then sort together."],
          start: "Help your dockbot pen-pal. Right spark, right box.",
          win: "Pen-pal delivery! Sparktown glowing. New friend: secured.",
        },
        growing: {
          arrive: "Sparktown twist: a shy dockbot wants a pen-pal. That’s you. Also mail is still chaotic.",
          optionalMid: ["Wave first. Sort second. Friendship third (ongoing)."],
          start: "Team up with your dockbot pen-pal. Right spark, right box, happy Star mailbox.",
          win: "Pen-pal mission complete! Sparktown lit. Friend + spark mail = win.",
        },
        "fluent-ms": {
          arrive: "Sparktown subplot unlocked: a shy dockbot requests a pen-pal pilot. Mail remains delightfully chaotic.",
          optionalMid: ["Wave first, sort second, friendship ongoing."],
          start: "Partner with your dockbot pen-pal—right spark, right box, legendary Story Star mailbox energy.",
          win: "Pen-pal mission complete. Sparktown lit. Friendship: delivered with the mail.",
        },
      },
    },
  ],
  "mistwhisper": [
    {
      id: "lantern_friends",
      tags: ["cozy", "classic"],
      weight: 1,
      beats: {
        emerging: {
          arrive: "Mistwhisper. Soft fog. Words hide. I am a light.",
          optionalMid: ["Hello, fog friends."],
          start: "Shine your light. Find the words.",
          win: "You did it! Mistwhisper glows.",
        },
        early: {
          arrive: "Mistwhisper! Soft fog. Shy words hide. I’m a lantern now.",
          optionalMid: ["Say hi to the fog friends."],
          start: "Shine your light. Say hi. The words will come out.",
          win: "Fog friends found! Mistwhisper is glowing.",
        },
        growing: {
          arrive: "Mistwhisper! Soft fog. Shy words hiding. Don’t worry—I’m a lantern now. Sort of.",
          optionalMid: ["Fog friends like hello almost as much as light."],
          start: "Shine your light. Say hi to the words. They’ll come out.",
          win: "Fog friends found! Mistwhisper is glowing. Spark for the Story Star!",
        },
        "fluent-ms": {
          arrive: "Mistwhisper rolls in soft and secret. Shy words tuck into the fog—lucky for them, I make an excellent lantern. Sort of.",
          optionalMid: ["Fog friends adore a polite hello almost as much as a good lantern."],
          start: "Sweep your light through the mist. Greet the hiding words—they’ll step out when they’re ready.",
          win: "Fog friends found and glowing. Mistwhisper sends a clean spark straight to the Story Star.",
        },
      },
    },
    {
      id: "echo_in_the_mist",
      tags: ["funny", "whisper"],
      weight: 1,
      beats: {
        emerging: {
          arrive: "Mistwhisper. The fog giggles.",
          optionalMid: ["Shh. Then shine."],
          start: "Whisper. Shine. Find words.",
          win: "Giggle fog glows!",
        },
        early: {
          arrive: "Mistwhisper! The fog giggles when we whisper.",
          optionalMid: ["Whisper first. Then shine."],
          start: "Whisper hello. Shine your light. Find the words.",
          win: "The giggle-fog glows. Mistwhisper lit!",
        },
        growing: {
          arrive: "Mistwhisper again—but this time the fog giggles when we whisper back.",
          optionalMid: ["Whisper first—then shine. The shy words love that trick."],
          start: "Whisper hello, shine your light, and coax the words out of the mist.",
          win: "Giggle-fog conquered! Mistwhisper lit. Another spark for the Star.",
        },
        "fluent-ms": {
          arrive: "Mistwhisper wears a different mood today: the fog giggles if you whisper first.",
          optionalMid: ["Whisper first, then shine. Shy words can’t resist that combo."],
          start: "Whisper a hello, lift your lantern, and coax every hiding word out of the mist.",
          win: "Giggle-fog conquered. Mistwhisper lit—and the Story Star pockets another spark.",
        },
      },
    },
  ],
};

export function scenePacksForPlanet(planetId: string): readonly ScenePack[] {
  return GLOWTRAIL_SCENE_PACKS[canonicalPlanetId(planetId)] ?? [];
}

/** V1.5 stub: hash(runSeed, planetId, "scene") % packCount */
export function pickScenePackIndex(
  runSeed: number,
  planetId: string,
  packCount: number = 2,
): number {
  if (packCount <= 0) return 0;
  let h = (runSeed >>> 0) ^ Array.from(canonicalPlanetId(planetId) + ":scene").reduce(
    (a, ch) => ((a * 33) ^ ch.charCodeAt(0)) >>> 0,
    5381,
  );
  return h % packCount;
}

export function pickScenePackLine(
  planetId: string,
  packId: string,
  band: StoryReadingBand,
  beat: "arrive" | "start" | "win",
  runSeed: number = 0,
): string {
  const pack = scenePacksForPlanet(planetId).find((p) => p.id === packId);
  if (!pack) return "";
  return pickBeatLine(pack.beats[band]?.[beat], runSeed);
}

