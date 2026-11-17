---
title: "Lip-Synced Singing Faces with Claude"
description: "How North Pole South uses Claude in VS Code to make Light-O-Rama singing trees lip-sync to any song: vocals to phoneme timing to FaceV2 effects, without touching the rest of the sequence."
---

# Lip-Synced Singing Faces with Claude

*How I got the four singing trees at North Pole South to sing along to any song in the show, and how you can do the same with your own singing faces.*

---

## The idea

Singing faces are the part of the show people point at. Hand-placing mouth shapes in the Light-O-Rama Sequence Editor takes hours per song, and most of my songs had no faces at all. Animators solved this problem decades ago with a standard set of mouth positions and a standard way to break words into sounds, so I built on those.

I wanted to be able to say "add singing faces to *Believe*" and get back a sequence where:

- the lead tree's mouth moves in time with the singer, word for word,
- the eyes blink naturally and long held notes shimmer,
- the other trees doze, then wake up for the choruses,
- **nothing else in the sequence changes**, so my existing effects are safe.

That's now how it works. The first song done start to finish with the finished process was Josh Groban's *Believe*, in November 2026. I watched it in LOR, approved it, and it went into the show the same day.

---

## The pieces

### The trees

The display has four singing trees: **Zuzu**, **Elden**, **Felix** and **Ralphie**. In LOR each one is a set of plain-channel RGB props named `FaceV2-<Tree> <part>`:

| Row | What it does |
| --- | --- |
| Tree Outline | the tree's body; its color shows who's awake |
| Bow (Zuzu) or Star (others) | the accessory, follows the outline |
| Eyes Open, Eyes Closed | blinking, and dozing |
| Mouth Closed | rest position |
| Mouth AI, E, OU, L, WQ, MBP, FV, etc | the mouth shapes |

A mouth shape is just one row lit at a time.

### The mouths: the Preston Blair set

The mouth rows follow the **Preston Blair** set, named for the Disney animator whose animation books popularized it. It's the closest thing lip-sync has to an industry standard: Papagayo, xLights and most singing-face props use the same ten positions.

| Position | Sounds like | Our row |
| --- | --- | --- |
| AI | **a**h, c**a**t, m**y**, s**i**t | Mouth AI |
| E | b**e**d, s**ee**, and most hard consonants (t, d, k, g) | Mouth E |
| O | b**ou**ght | Mouth OU |
| U | b**oo**t, b**oo**k, n**ow** | Mouth OU |
| etc | n, s, z | Mouth etc |
| L | **l**, **r**, **th**e | Mouth L |
| WQ | **w**e, g**o**, b**oy**, h**er**, **sh**e, **ch**ip | Mouth WQ |
| MBP | **m**, **b**, **p** (lips together) | Mouth MBP |
| FV | **f**, **v** (teeth on lip) | Mouth FV |
| rest | silence | Mouth Closed |

Our trees have one mouth for both O and U, so those two positions share a row. If your props have separate O and U mouths, use them both.

### The phonemes: from words to mouths

A mouth shape follows a *sound*, not a letter. "Though" and "tough" end in the same letters but need different mouths. So each word is first broken into **phonemes**, the individual speech sounds, using the **CMU Pronouncing Dictionary**. It's the standard free dictionary for American English and covers about 134,000 words. Each sound is written in **ARPAbet**, the notation speech researchers use: "believe" becomes `B IH L IY V`.

Each phoneme then maps to one mouth using the conversion table that ships with Papagayo:

| Mouth | CMU phonemes |
| --- | --- |
| AI | AA, AE, AY, IH |
| E | AH, EH, EY, IY, Y, D, T, TH, G, K, NG, HH |
| O | AO |
| U | AW, UH, UW |
| etc | N, S, Z |
| L | L, R, DH |
| WQ | W, OW, OY, ER, CH, JH, SH, ZH |
| MBP | M, B, P |
| FV | F, V |
| rest | silence between words |

So "believe" plays as MBP, AI, L, E, FV. Using the standard table instead of inventing our own means a `.pgo` built here opens correctly in Papagayo, and anyone with Preston Blair mouths can use it.

### The phoneme file

The timing lives in a **Papagayo `.pgo` file**: a plain-text format from the free Papagayo lip-sync tool. It lists each phrase, each word and each mouth shape, with the frame it starts on. I make one per voice.

The one setting that matters: **always 20 frames per second.** One frame is 0.05 seconds, which is exactly LOR's timing grid, so nothing has to be rounded.

### The cast list

A small `faces.json` file says which tree sings which `.pgo`, what color each tree is when awake and asleep, and when the backup trees wake up. Here's the one for *Believe*:

```json
{
  "first": 3.0,
  "trees": {
    "Elden":   {"pgo": "Believe - lead.pgo", "color": "00B83C", "sleep_color": "1E5CFF"},
    "Zuzu":    {"wake": [[72.4, 103.4], [167.8, 231.4]], "color": "FF0000", "sleep_color": "1E5CFF"},
    "Felix":   {"wake": [[72.4, 103.4], [167.8, 231.4]], "color": "1E5CFF", "sleep_color": "1E5CFF"},
    "Ralphie": {"wake": [[72.4, 103.4], [167.8, 231.4]], "color": "FFB000", "sleep_color": "1E5CFF"}
  }
}
```

Elden sings the lead. The other three wake up for the two choruses (the numbers are seconds) and doze the rest of the time.

### The tools

Everything runs on the show computer, and all of it is free:

- **UVR** (Ultimate Vocal Remover models) pulls the vocals out of the song.
- **Whisper** (OpenAI's speech recognition, run locally) transcribes the words.
- **wav2vec2** lines the lyric sheet up against the vocal track, word by word.
- **CMU Pronouncing Dictionary** turns words into phonemes (speech sounds).
- A handful of **Python scripts** Claude wrote tie it together and write the LOR file.

I didn't install or wire any of this up myself. Claude did, in a project folder on my show computer, and explained each piece as it went.

---

## How the pipeline works

There are two halves. First, turn the song into timing. Then, turn the timing into effects.

**Half 1: song to `.pgo`**

1. **Get the lyrics.** Claude searches my project for an existing lyric sheet or `.pgo` for the song. If it can't find one, it stops and asks me to paste one in. (More on that below.)
2. **Separate the vocals.** UVR splits the song's MP3 into a vocal track and an instrumental. This takes a few minutes.
3. **Transcribe.** Whisper listens to the vocal track and writes down the words it hears, with rough times.
4. **Align.** wav2vec2 matches *my lyric sheet* against the vocal track and finds where each word really starts and ends. This is much more accurate than Whisper's times.
5. **Fix and check.** A small fix-up script trims words that hang open through a breath, and a checker compares every repeated chorus line with the first time it was sung. Repeats should match within about 0.06 seconds.
6. **Build the `.pgo`.** Words become CMU phonemes, and phonemes become Preston Blair mouths using the standard table above, at 20 fps.

**Half 2: `.pgo` to sequence**

7. **Survey the sequence.** Claude checks that the FaceV2 rows exist and whether anything is already on them. If the mouths already have effects on them (faces I placed by hand in an earlier year, say), it asks before replacing anything.
8. **Write the faces.** One script reads `faces.json` and the `.pgo` and writes the mouth, eye and outline effects. A dry run first prints when each tree is awake, so I can sanity-check it against the song.
9. **Verify.** The script re-reads its own output and confirms that every other prop and every other part of the file is byte-for-byte unchanged. If not, it says "VERIFY FAILED" and the file isn't used.
10. **I check it in LOR, then copy it back myself.** I open the copy in LOR and watch it with the music. After I'm satisfied with the results, I copy it back to my live Sequences folder so I can add it to the show.

Separation and transcription took about four minutes for *Believe*. The rest takes seconds.

---

## The house style for faces

These are the conventions we settled on. They live in the script, so every song gets them automatically:

- **Zuzu (with the bow) is the female lead. Elden is the male lead.**
- A tree that isn't singing **dozes**: outline at 15% in a soft sleep color, eyes shut, mouth closed, at 30%.
- A tree wakes **0.6 seconds before** its first phrase and fades back to sleep over 0.8 seconds after its last.
- Mouths and open eyes are white. Eyes **blink every 3.5 to 6.5 seconds** while awake.
- Vowels held for **0.8 seconds or longer** shimmer, so big notes look big.
- Each tree gets **its own awake color** taken from the song's palette, so you can tell them apart from the street. For *Believe* that was the yard's red, green, blue and gold.
- For big moments (a "Hey!", a key change, the finale) all four trees wake up.

Casting so far:

| Song | Lead | The others |
| --- | --- | --- |
| *Believe* | Elden | wake for the choruses, mouths closed |
| *All I Want for Christmas (Reimagined)*, *Canon Rock* | Zuzu, including wordless soprano | join on the hooks and choruses, doze between |
| *Dominic the Donkey* | Elden sings the words | Felix sings the hee-haws; Zuzu and Ralphie wake for accents |
| *You Make It Feel Like Christmas* (duet) | one tree per singer | |

---

## Turning it into a skill

The first few songs were worked out one at a time, and the know-how ended up scattered across a dozen folders. So I asked Claude to write it all down as a single, detailed set of instructions it could follow every time.

Claude Code supports **skills**: a folder with an instructions file (`SKILL.md`) and helper scripts. When I ask for something the skill covers, Claude loads those instructions and follows them instead of figuring it out from scratch. Ours is called `singing-faces`, and it includes:

- `find_lyrics.py`, which searches for a lyric sheet and exits with "NO LYRICS FOUND" when there isn't one,
- `new_song.py`, which sets up a working folder for the song, pointed at its audio and length,
- `check_timing.py`, which flags repeated lines that disagree, words held through quiet, and singing with no word on it,
- `add_singing_faces.py`, which writes the faces and verifies the result.

Now the whole job starts with one sentence: *"Add singing faces to Believe."*

---

## Lyrics: the one thing I supply

The lyric sheet is what the alignment step lines up against, so it matters more than anything else. Two rules came out of this:

**Claude never pulls lyrics from lyric websites, and doesn't type them from memory.** If it can't find a sheet in my own files, it asks me. I paste in the lyrics from the CD insert or my own notes.

**Every repeat has to be written out.** Whisper tends to drop repeated end choruses, and if the sheet says "repeat chorus" the alignment has nothing to line up. One sung phrase per line, in the order sung, every chorus spelled out.

A couple of tricks:

- **Phonetic spellings are fine**, sometimes better. The mouths come from how a word is pronounced, and for words the dictionary doesn't know, a phonetic spelling gets the guess right. "Chingedy" and "paisans" work great in *Dominic the Donkey*.
- Spell out "la la la" as separate words.
- If I'd rather not supply a sheet, Claude can use Whisper's transcript of my own audio instead, show it to me, and take my corrections.

---

## What we learned the hard way

Most of the work was in Half 1. Sung vocals are much harder to time than speech.

- **Whisper's word times run about 0.3 seconds early on singing.** On the ending of *Believe* they were 1.3 to 2.3 seconds off. That's why alignment against the lyric sheet is the main timing source, and Whisper is only used for the words.
- **Backing vocals and reverb leak into the vocal track.** The "silence" between phrases never gets truly quiet, so a held word would stay open through the breath and the next word would start late. The fix-up script listens at a stricter threshold and trims 14 words' tails and 14 onsets on *Believe* alone.
- **Instruments leak too.** On *Hippopotamus*, guitar bleed made the mouth stay open through an instrumental break. Comparing long held words against the vocal energy catches this.
- **Whisper invents words in instrumentals.** "Thank you for watching" showed up in at least one guitar solo. Those get deleted before alignment.
- **Brays and other non-words are invisible to Whisper.** For *Dominic the Donkey*, Claude wrote a detector that finds hee-haws by their sound (a "hee" is bright, a "haw" is lower), keeps lyric words out of those spots, and builds a second `.pgo` for Felix to bray along to.
- **Runs of identical syllables defeat alignment.** "La la la" gets scrambled. Timing from the beat grid, or hand-tapped timing from an older version of the sequence, fixed it.
- **Repeated choruses are the best check.** If the chorus is sung the same way twice, its timing should match twice. When it doesn't, something slipped, and the checker points right at it.
- **Close the sequence in LOR first.** If it's open when the new version is installed, LOR's next save overwrites it.

---

## Bonus: a singing face on a matrix

Once the timing exists, it can drive more than the trees. Two experiments:

- **The tree face, drawn on the window matrix.** Claude traced each FaceV2 tree's outline, eyes and mouths onto our 64×64 window matrix as custom pixel shapes, then copied the tree's face effects onto them. Same timing, bigger face.
- **A singing elf video.** The `.pgo` becomes a frame-by-frame timing list, and a short animated elf is rendered to match it, then played as a movie on the matrix. The rule there: the timing list is the only source of timing, and the renderer never adjusts it. Codex draws and renders the elf; see [Singing Elf Matrix Video](singing-elf-matrix-video.md) for the full story.

---

## Want to try it?

New to this? Start with [Getting Started](getting-started.md) to set up VS Code, Claude, Python and ffmpeg.

You'll need singing-face props in LOR (any set of plain-channel rows per mouth shape will do, but the standard Preston Blair set makes everything easiest), Visual Studio Code with the **Claude Code** extension, and the MP3s for your show.

### Tips

- **Let Claude survey before it writes.** Ask it to tell you what's already on your face rows before it changes anything.
- **Insist on verification.** "Change only the face rows, then prove nothing else changed" is a reasonable rule to give it, and it'll write the check.
- **Watch the dry run.** The awake windows it prints are the quickest way to catch a tree singing in the wrong place.
- **Ask for a README per song.** Ours record where the lyrics came from, the timing fixes and why, the casting, and what was and wasn't checked. Next year I'll be glad of it.
- **Watch it against the audio.** The checks catch most problems, but you're the final judge. Play it in LOR before it goes live.

### A starter prompt for Claude

Open your **project folder** in VS Code. This is the folder where you made copies of your sequences (see [Getting Started](getting-started.md)). **Never open your live Sequences folder in VS Code.** Then paste this into Claude. Replace the parts in [brackets] first.

```text
I run a Christmas light show with Light-O-Rama [version, e.g. S6 Pro]. I have singing-face
props: [describe them, e.g. "four trees, each with an outline, eyes open/closed, and
Preston Blair mouth rows: AI, E, O, U, etc, L, WQ, MBP, FV, rest"]. I'm not a programmer,
so please explain things in plain language and ask me before making decisions that are mine.

Goal: lip-sync my singing faces to a song in an existing sequence.
Sequence: [file name]. Audio: [MP3 name]. Lead singer: [which prop sings].

How it should work:
- Separate the vocals from my MP3, transcribe them, then align my lyric sheet to the vocal
  track to get word timing. Break the words into CMU dictionary phonemes and map them to
  Preston Blair mouths with Papagayo's standard table. Build a Papagayo .pgo file at 20 fps
  (matching LOR's 0.05 s grid).
- Turn the .pgo into effects on my face rows: one mouth row lit at a time, eyes blinking,
  long held vowels shimmering. Props that aren't singing should look asleep.

Rules that matter to me:
- Never get lyrics from lyric websites or type them from memory. If you need a lyric sheet,
  ask me to paste one, and remind me to write out every repeated chorus.
- Change only the face rows. After writing, re-read the file and prove every other prop and
  section is unchanged. Keep a backup of anything you overwrite.
- NEVER open, change, save or copy anything in my live LOR Sequences folder. EVER.
  Work only on the copies in this project folder. I'll copy finished files back myself.
- Use free tools that run on this computer. Ask before installing anything.

Please start by looking at the sequence and telling me what's on my face rows now.
When it works, help me turn the steps into a Claude Code skill so next time is one sentence.
```

Expect a few rounds on the first song, mostly on timing. After that, each new song is mostly waiting for the vocal separation to finish.

If you're a Light-O-Rama user and have questions, find us on the [North Pole South Facebook page](https://www.facebook.com/apachechristmas).

Merry Christmas from North Pole South! 🎄
