---
title: "A Light-O-Rama Sequence from Scratch with Claude"
description: "How North Pole South uses Claude in VS Code to build a whole Light-O-Rama S6 sequence from an empty .loredit: music analysis, a survey of the show's own sequences, a story-driven design, a scripted build and honest verification."
---

# A Light-O-Rama Sequence from Scratch with Claude

*How I went from an empty sequence and an MP3 to a finished, fully choreographed song for the North Pole South show, and how you can try it with your own display.*

---

## The idea

My first sequence from scratch, twenty years ago, took a week of evenings. A full song for today's display, with pixel trees, spinners, arches, ornaments, matrices and singing faces, takes much longer than that by hand.

So this year I tried something new. I made an empty sequence in Light-O-Rama with the song attached, opened my project folder in VS Code, and asked Claude to fill it in. I wanted a sequence that:

- **looks like my show**, not a generic one, because it borrows settings from sequences I already run,
- **tells a story** from the lyrics, with every big moment tied to a word or a change in the music,
- **lands on the beat** and on the words, because the timing comes from the audio, not from guesses,
- **loads in LOR without complaint**, because nothing in the file is invented from thin air.

The first try was Dolly Parton's *I Will Always Love You* in early November 2026. By mid-November we'd built eight songs this way, and each one taught us something that went into the next.

---

## What I give Claude

Claude asks for these before it starts. If something's missing, it either asks or proposes something and flags it for me to review.

| What | Example | If I don't have it |
| --- | --- | --- |
| The song's MP3 | the track from the CD | Nothing can start without it |
| An empty sequence | made in LOR with the song attached | Claude asks me to make one |
| A palette or theme | "pastels, pink first, in honor of Dolly" | Claude proposes one from the lyrics |
| A lyric sheet | pasted in from the CD insert | Claude transcribes my audio instead (never a lyric website) |
| Sign wording | song title, artist, "Tune to 90.7 FM" | Claude uses the title and FM line and flags it |
| Matrix content | two butterflies; spoken words one at a time | Claude proposes an idea that fits the song |

The empty sequence matters more than it looks. When you create a sequence in LOR, it already contains your whole preview: every prop, every motion row, every channel. So the only thing Claude has to add is effects. It never has to describe my display to LOR, which is where things could go badly wrong.

---

## How it works

There are six phases. The first three are thinking and measuring. Only the fourth writes the sequence.

### Phase 1: Listen to the song

Every later timing comes from this phase, so nothing is estimated by hand.

1. **Split the stems.** A free vocal separation tool (UVR models) splits the MP3 into a vocal track and an instrumental track.
2. **Analyze the audio.** A Python script finds the beats and downbeats, the tempo (including slowdowns at the end), the chords, the loud and quiet stretches, and every note held for 0.8 seconds or longer, with its pitch.
3. **Find the words.** Whisper transcribes the vocal track, then an alignment step lines my lyric sheet up against it to get each word's start and end. This is the same process as [Singing Faces](singing-faces.md).
4. **Write a section table.** Claude reads the lyric times, the level changes and the held notes together and writes a table like this one from *I Will Always Love You*:

| Time | Section | What the audio does |
| --- | --- | --- |
| 0.0–12.9 s | Intro | Solo guitar, the quietest part |
| 42.3–59.9 s | Chorus 1 | Jumps up an octave; "you" held for 3 seconds |
| 113.9–136.2 s | Bridge | Spoken, quiet, with gaps between sentences |
| 141.1–158.9 s | Chorus 3 | Loudest section; the top note at 154.8 s |
| 167.4–176.1 s | Ring-out | The band fades to silence |

That table drives everything else.

### Phase 2: Survey my own sequences

This is the step that makes the result look like *my* show. Claude reads the sequences already in my 2026 show and measures them: which props get used most, which effects, how long a typical effect lasts, what colors, and how the effects are layered. It also collects the exact settings for each effect type as LOR wrote them.

What it found about my show surprised me a little:

- **Color wash is about 73% of all motion effects.** The median wash lasts 0.4 seconds, so most of my "look" is many short fades, not long fancy effects.
- After that come blended bars, straight lines, curtains, twinkles and bars.
- **East and West sides mirror each other**, and arches light in pairs from the center out.
- The LED sign shows the title for the whole song, with "Tune to 90.7 FM" on a marquee.
- Videos play on the porch matrix, split into a left and right half.

### Phase 3: Design

Before any effects get written, Claude writes the design into a README in the song's folder, and I read it. The rule I like best: **the strongest sequences tell one story, by when props join and when they drop out, rather than by using every effect.**

The design covers:

- **The story in one sentence.** For Dolly: someone leaves with love, one butterfly flies away, and the pair reunites on "I wish you love."
- **The palette.** Two or three shades for the main color and four to six accents, with a color temperature for each section.
- **The energy.** Start small, add props each chorus, and hold something back so the last chorus can grow. Quiet passages should be really quiet.
- **Lyric moments.** A handful of literal ideas tied to exact word times. In *I Will Always Love You*, the arches walk away from the house one pair per beat on "each step of the way," and meteors fall down the trees like tears on "please don't cry."
- **The climax.** One display-wide moment on the top note, used only once.
- **The ending.** Follow the music's fade, usually from the outside in, and pick the last light.
- **What stays dark,** and why. More on that below.

### Phase 4: Build

Now Claude writes a Python script for the choreography. It reads the empty sequence, adds effects to the rows that are already there, and writes a new copy into a `build` folder. My live file is never touched.

A few rules keep the file safe for LOR:

- **Only effects get added.** No new props, no changed preview, no changed row IDs.
- **Every effect setting comes from my own sequences.** Claude copies a whole settings string that LOR already wrote, and changes only the colors. If my show has never used a particular effect setting, it doesn't appear.
- **Every time sits on LOR's 0.05-second grid**, and no two effects overlap on the same row.
- **The writer reproduces LOR's formatting exactly.** Before building, Claude proves this by reading the empty sequence and writing it back out with no changes. The two files have to match byte for byte.

Choruses repeat, so the script uses one chorus recipe with a "stage" setting that adds props each time. Background effects go on first, and short accents go on top. When an accent ends, the background picks up again where it would have been.

The script also writes the analysis into the sequence as beat rows and timing grids (beats, lyric phrases, sections), so when I open it in LOR I can see why things happen where they do, and adjust by hand.

### Phase 5: Matrix video

LOR's text and picture effects are fine, but a video gives full control of every pixel. Claude draws the porch matrix (192×64 pixels on my display) one frame at a time at 20 frames per second, splits it into a left and right video, and saves them where LOR keeps its media. The sequence just plays them.

These have been some of my favorite parts:

- **Dolly:** two butterflies. One flies away, a ghost of it appears on "memories," and it comes back with a heart behind the pair. During the spoken bridge, each word appears on its own, in pastel letters.
- **Feliz Navidad:** bilingual karaoke, with the English translation under each line, and a treble staff scrolling across the window matrix with the notes José Feliciano sings.
- **Rudolph** and others: Claude wrote a detailed brief for Codex to draw a singing elf for the window matrix. See [Singing Elf Matrix Video](singing-elf-matrix-video.md).

A firm rule here: **no real person's likeness on the matrix.** The butterflies stand in for Dolly; nobody draws Dolly.

### Phase 6: Verify, honestly

Claude can't open LOR or see my yard. It says so every time, and it runs every check it *can* run:

| Check | Must be |
| --- | --- |
| Writer round trip | The empty sequence, rewritten, matches the original byte for byte |
| Preview, row and track IDs | Unchanged |
| Times | Inside the song, on the 0.05 s grid |
| Overlaps | None on any row |
| Levels | 0 to 100 on motion rows |
| Effect settings | Every one found in my own sequences |
| Brightness | Most lit time at 80–100% (see the house style) |
| Palette share | Close to the design, song-wide and per section |

It also draws a **storyboard**: a picture of the whole song with one strip per prop group, colored by the effects. It's not a render, but it's great for spotting a dark gap before a chorus, a section that looks just like the one before it, or one color taking over.

Then the report splits into two lists: **what was verified, and what wasn't.** The "wasn't" list always includes "not opened in LOR, not run on the display." That honesty is the reason I trust the first list.

Finally, I open the copy in LOR, watch it with the music, and copy it back to my live Sequences folder myself when I'm happy.

---

## The house style

These came from my feedback on the early builds. They're now baked into every new song.

- **Keep the yard bright.** The first build ran its background effects at 25–45%, and from the street it just looked dim. Now motion effects never sit below **70%**, and a typical build has over 80% of its lit time at 80–100%. Quick flashes under half a second can still fade.
- **Keep everything moving.** The first passes left most props dark between word accents. My newer sequences never sit still, so every section now gets a low, moving background layer under the accents.
- **Layer the motion rows.** My best-looking sequences stack two to four effect rows on each prop. Now each prop gets a background on one row, beat accents on another and lyric hits on a third, plus the sub-part rows such as megatree tiers, spinner circles, ornament caps and star rings.
- **Match the song's rhythm.** For *Hard Candy Christmas* I asked that motion speed follow the music. Now chases and twists step on the measured beats or eighth notes, curtains and wipes are fitted to exactly one beat or one bar, and looping effects restart on every downbeat.
- **Leave retired fixtures alone.** I don't use moving heads, the snow machine or the smoke machine anymore, so they get nothing. Strobes and other physical effects stay off unless I ask.
- **Use every real prop.** By the later songs, every prop in the yard had something to do, down to the blow molds and the old incandescent tree strings.

---

## The songs so far

| Song | Theme | Extras |
| --- | --- | --- |
| *I Will Always Love You* (Dolly Parton) | Pastels, pink first | Butterfly video, spoken words on the matrix, singing faces |
| *Christmas Canon Rock* (TSO) | A classical melody catches fire: flame reds and oranges | Singing faces |
| *All I Want Is You* (Vince Vance), reimagined | My own old sequence, rebuilt with more layering and motion | Lyric picture-story video, singing faces |
| *Dominic the Donkey* (Lou Monte) | Italian flag | Two singing trees: one sings, one brays the hee-haws |
| *Feliz Navidad* (José Feliciano) | Bold, saturated | Bilingual karaoke video, scrolling music staff |
| *Last Christmas* (Wham!) | Frozen heart, '80s style: ice blue, violet and neon, with red only on the heart | Lyric and window videos, singing faces |
| *Rudolph the Red-Nosed Reindeer* (Gene Autry) | A vintage Christmas special: old C9 bulb colors, red for the nose | Singing faces, Codex singing elf |
| *Hard Candy Christmas* (Dolly Parton) | Grandma's candy dish: peppermint, spearmint, ribbon candy | Motion locked to the beat |

---

## Turning it into instructions

After the Dolly build, I asked Claude to write down everything it had done as a set of instructions it could follow next time: the inputs to ask for, the rules, every phase, every check, and a table of every problem it hit and how it was fixed. Every later song started from that document, and every song added to it.

That's the biggest lesson from this whole project. **The first song is an experiment. The instructions are what you keep.** Each new song took less of my time than the last, mostly because the mistakes from the previous one were already written down.

---

## What we learned the hard way

- **Start from the empty sequence, never from scratch.** LOR's file holds a lot of detail about your display. Letting LOR write the empty file, and only adding effects, is what makes the result load.
- **Brand-new empty sequences can be thin.** A fresh empty sequence sometimes had only one motion row per prop and none of the sub-part rows my older sequences had. Claude copied the row layout from an earlier empty sequence made with the same version of my preview.
- **Close LOR before installing.** If the sequence is open in LOR when a new copy is written, LOR's next save overwrites it. Several builds waited in the `build` folder until I closed LOR.
- **Don't let a rebuild eat your edits.** I sometimes open the copy in LOR and tweak it. A rebuild starts from the empty sequence and would wipe those tweaks. Now Claude compares the file with its last build before overwriting anything, and asks me if it changed.
- **Whisper invents words over instrumentals.** "Thank you for watching" turned up in a guitar solo. Those words get deleted before the alignment step.
- **Whisper drops repeated choruses**, so every repeat has to be written out in the lyric sheet.
- **Not every song has a steady beat.** *Rudolph* has a whole instrumental pass of the tune in the middle and slows down in the second half. *Feliz Navidad*, on the other hand, sits on a strict grid, so its timing came from the beats instead of the transcript.
- **Section-ending accents can step on the next section.** On *Dominic*, a flourish that ran a fraction of a second past the end of a line wiped out the next chorus's "Hey!" Now those accents stop when the next line starts.
- **A main color still needs accents.** "Pink first" came out at 82% pink on the first build, and it read as one color from the street. Rotating the accents through arches, mini trees and the fence brought it to 66%, which looked much better.
- **Claude won't type out lyrics.** For my lyric-based videos, Claude builds the lyric file with a script from the transcript of my own recording and refers to lines by number, not by quoting them.

---

## Want to try it?

New to this? Start with [Getting Started](getting-started.md) to set up VS Code, Claude, Python and ffmpeg.

You'll need Light-O-Rama S6, a preview with your props, a few of your existing sequences for Claude to learn from, and the MP3 for your song.

### Tips

- **Read the design before the build.** It's much easier to change a story in a README than in 40,000 effects.
- **Let it survey your show first.** The survey is what makes the result look like yours instead of like a demo.
- **Insist on "only add effects."** No new props, no changed preview, no invented settings. Ask Claude to prove it afterward.
- **Look at the storyboard.** Dark gaps and copy-paste sections jump out of it.
- **Ask for a README per song.** Ours record the section table, the design, how to rebuild, and what was and wasn't verified.
- **Give feedback, and ask Claude to write it down.** "Too dim" and "keep everything moving" became rules for every song after.
- **Watch it in LOR with the music.** The checks catch file problems. Only you can tell whether it looks good.

### A starter prompt for Claude

Open your **project folder** in VS Code. This is the folder where you made copies of your sequences (see [Getting Started](getting-started.md)). **Never open your live Sequences folder in VS Code.** In LOR, create a new, empty sequence for the song with the audio attached, and save it into your project folder. Then paste this into Claude. Replace the parts in [brackets] first.

```text
I run a Christmas light show with Light-O-Rama [version, e.g. S6 Pro]. I'm not a
programmer, so please explain things in plain language and ask me before making
decisions that are mine.

Goal: build a complete sequence for a song, starting from an empty sequence I made in LOR.
Empty sequence: [file name]. Audio: [MP3 name].
Theme and palette: [e.g. "Grandma's candy dish: peppermint and spearmint", or "propose one"].
LED sign text: [e.g. title / artist / "Tune to 90.7 FM"].
Props to leave dark: [e.g. "snow machine, smoke machine, strobes"].

How it should work:
1. Analyze the song: separate the vocals, find the beats, tempo, sections, loud and
   quiet parts and held notes, and time the words against my lyric sheet.
   Write a section table.
2. Survey my existing sequences: [list a few]. Tell me which props and effects I use
   most, how long effects usually last, and how my props are layered.
3. Write a design in a README before building: the story in one sentence, the palette,
   how the energy builds, which lyric moments get special effects, the climax and the
   ending. Wait for my OK.
4. Build the sequence by script into a separate build folder.

Rules that matter to me:
- Only add effects to rows the empty sequence already has. Don't add props, change my
  preview or change any IDs.
- Copy effect settings from my own sequences and change only the colors.
- Keep motion effects bright (70% or more) and keep the yard moving between big moments.
- Prove the file writer reproduces my empty sequence byte for byte before building, and
  check the build for overlaps, off-grid times and out-of-range levels.
- Never get lyrics from lyric websites or type them from memory. Ask me for a lyric
  sheet, and remind me to write out every repeated chorus.
- NEVER open, change, save or copy anything in my live LOR Sequences folder. EVER.
  Work only on the copies in this project folder. I'll copy finished files back myself.
- Use free tools that run on this computer. Ask before installing anything.
- When you report, list what you verified and what you couldn't.

When it works, help me write the steps down as instructions you can follow for the next song.
```

Expect the first song to take a few rounds, mostly on the design and the brightness. After that, the instructions carry forward and each new song goes faster.

If you're a Light-O-Rama user and have questions, find us on the [North Pole South Facebook page](https://www.facebook.com/apachechristmas).

Merry Christmas from North Pole South! 🎄
