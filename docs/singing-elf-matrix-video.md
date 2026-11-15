---
title: "A Singing Elf on Your Pixel Matrix, Made with Two AIs"
description: "How North Pole South has Claude write a detailed prompt for OpenAI's Codex, which builds a lip-synced, animated singing-elf MP4 that plays on a 64x64 Light-O-Rama matrix panel."
---

# A Singing Elf on Your Pixel Matrix, Made with Two AIs

*How I get a cartoon elf to sing along with the music on a 64×64 pixel matrix in the North Pole South show, with Claude and Codex each doing the part it does best.*



---

## The idea

Our show already has four singing trees with faces. Their mouths move in time with the vocals. I wanted a character on the window matrix who sings along with them: a cartoon elf whose mouth makes the right shape on the right word, with eyes that blink and a hat pompom that sways on long notes.

The matrix can play a video. So the job is to make an MP4 for each song, with the elf singing that song, cut frame by frame to match the vocal.

Making that video takes two very different skills:

1. **Timing.** Work out exactly which mouth shape belongs on screen at every twentieth of a second of the song.
2. **Pictures.** Draw an appealing elf and a full set of mouth shapes that still read from the street at 64×64 pixels, then turn the art and the timing into a video.

I use a different AI for each.

### Example result

This is the kind of output the process produces on the matrix: a compact, mouth-synced elf with blinking eyes and a subtle hat pompom wobble.

<video controls width="640" playsinline style="image-rendering: pixelated;">
  <source src="../assets/videos/talking-elf-solar-power.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

## Two AI services, two jobs

| | Claude (Anthropic) | Codex (OpenAI) |
|---|---|---|
| Where I run it | Claude Code, inside VS Code | Codex, in the same project folder |
| Its job | Lip-sync timing, then writing the prompt for Codex | Drawing the elf and building the MP4 |
| What it produces | A phoneme file, a frame-by-frame timing table, and a detailed written prompt | Art layers, a render script, the matrix MP4, and a review MP4 |
| Knows about | My LOR sequences, my props, the singing-tree faces, the timing tools | Nothing about my show beyond what the prompt tells it |

### Why Claude does the planning

Claude already knows the project. It built the lip-sync timing for the singing trees, it knows the matrix prop and its exact size, and it can read my sequence files. That makes it the right one to work out *what* the video has to be and to write it all down precisely.

### Why Codex does the video

**Codex is better at artwork.** Codex is OpenAI's coding agent. The elf is a picture problem first: a character design, a set of mouth shapes, clean pixel art at a tiny size. In my experience Codex produces better artwork than Claude does, and it can also write and run the script that turns that artwork into a video.

So Claude plans and Codex draws. Each one does the half it's best at.

### Why a written prompt in between

The two services don't talk to each other. Claude can't hand Codex a task directly, and Codex starts with no idea what my show is. The prompt is the handoff: a Markdown file that Claude writes into the song's folder, and that I give to Codex.

Because Codex knows nothing else, the prompt has to carry everything: the size of the matrix, the frame rate, which file holds the timing, what the elf looks like, what each mouth shape looks like, and how to prove the result is right. A vague prompt gets a pretty video that's out of sync. A detailed one gets a video I can drop into the show.

---

## How the pieces fit together

1. **Song and lyrics** go into a folder for that song.
2. **Claude** separates the lead vocal from the music, lines the lyrics up with it, and builds a Papagayo phoneme file (`.pgo`). The same file drives the singing trees, so the trees and the elf sing together.
3. **Claude** converts the phoneme file to a table with one row per video frame: mouth shape, eyes open or closed, held-note shimmer, and brightness for the fade in and out.
4. **Claude** writes `CODEX_PROMPT.md` in the song folder.
5. **I** open Codex on the same project and tell it to do the task in that file.
6. **Codex** draws or adapts the elf art, writes a render script, and builds two videos: the 64×64 matrix video and a big review copy with the song.
7. **I** watch the review video with sound. If the elf is in sync and looks right, the matrix video goes into the LOR sequence.

---

## Know your matrix first

Every number in the prompt comes from the prop the video plays on. Ours is:

| Setting | Value | Why |
|---|---|---|
| Matrix size | 64 × 64 RGB pixels | The prop in my LOR preview is exactly this size |
| Video size | 64 × 64 | One video pixel lands on one LED, with no scaling or blur |
| Frame rate | 20 fps | Matches the Papagayo timing that also drives the singing trees |
| Length | Song length × 20 frames | It must end exactly where the LOR sequence ends |
| Background | Black | Black means the LEDs are off. No scenery, snow or gradients |
| Format | H.264, `yuv420p`, no audio | Plays in LOR. LOR plays the music itself |

At 64×64 every pixel counts. Details must be chunky, with no single stray pixels. The mouth is the whole point, so each mouth shape must be clearly different from the others at full size.

Check your own matrix's size in your LOR preview and use those numbers instead.

---

## Step 1: Get the timing right (Claude)

This is the part that takes the most care, and I let Claude do it. For each song Claude:

- separates the lead vocal from the music, so backing singers and instruments don't confuse the timing,
- matches my lyric sheet to the vocal word by word,
- builds the `.pgo` file using the standard Preston Blair mouth shapes (`AI`, `E`, `O`, `U`, `WQ`, `MBP`, `FV`, `L`, `etc`, and `rest`),
- converts it to one row per video frame and adds blinks, shimmer on held notes, and the fade in and out.

Before I give anything to Codex, the singing trees in LOR already use the same timing. If the trees look right, the elf will too. [Singing Faces with Claude](singing-faces.md) covers this timing step in detail.

---

## Step 2: Have Claude write the prompt

I ask Claude something like:

> Write a Codex prompt to build the singing-elf matrix video for this song. Use the frame timing table you made, the existing elf art, and the Matrix-Window size. Include checks Codex has to pass.

A good prompt from Claude has these sections. If one is missing, ask for it.

- [ ] **The task in one paragraph:** what the video is, where it plays, and the mood of the song (a slow ballad wants a gentle, sincere elf; an upbeat song wants a bouncy one).
- [ ] **A hard rule about timing:** "Frame *n* shows exactly row *n* of the table. Don't create, correct or resample the timing." Codex must never improve the lip-sync on its own.
- [ ] **Deliverables:** every file to produce, with exact specs (size, frame rate, exact frame count, codec, no audio), plus a review video scaled up 8× with the song added and a small on-screen label showing the current mouth shape.
- [ ] **Inputs:** which files to read, which are read-only, and what each column of the timing table means.
- [ ] **The character:** what the elf looks like, in detail: hat, colors, ears, collar. If we already have an elf, say to reuse it so the show has one recurring character.
- [ ] **What not to copy:** no characters, logos or artwork from movies or album covers. The elf is ours.
- [ ] **Art layers:** a separate image for the head, the pompom, open eyes, closed eyes, and each mouth shape, all lined up on the same canvas so they can be stacked.
- [ ] **A description of every mouth shape,** with how often it appears in the song, so Codex spends its effort on the shapes you'll see most.
- [ ] **Animation rules:** hard cuts between mouth shapes (no blending), closed eyes when the table says so, a gentle wobble on held notes, and nothing else moves.
- [ ] **A rough map of the song:** which sections are sung and which are silent, so nobody "fixes" an instrumental break.
- [ ] **Verification:** exact counts of each mouth shape that the finished video must match, plus a list of specific frames to pull from the finished MP4 and check by eye.
- [ ] **Don'ts:** don't touch the sequence files, the preview file, the timing files or any other song's folder.

The real prompt for *Believe* runs to about 200 lines. That sounds like a lot, but it's what lets Codex build the video in one pass with no guessing.

---

## Step 3: Hand it to Codex

Open Codex on the same project folder and say:

> Do the task in `elf-lipsync/<song>/CODEX_PROMPT.md`.

That's all. Everything Codex needs is in the file.

Codex works through it: it draws or adapts the art layers, writes a render script, builds the videos, runs the checks, and reports the results. The render script stays in the folder, so if I touch up a mouth shape by hand I can rebuild the video without starting over.

**The first song takes the most work.** For the first one, Codex designs the elf from the description. After that, each new prompt tells Codex to reuse the same art and only adapt it if needed. The elf stays the same character all season, and later songs go much faster.

---

## Step 4: Check it yourself

Codex's checks prove the video has the right size, length and number of each mouth shape. They can't tell you whether it *looks* in sync. Only watching can.

1. Watch the **review video with sound.** It's the big 8× copy with the song in it.
2. Look at the **contact sheet** (all the mouth shapes side by side). Can you tell every shape apart?
3. Look at the **spot-check image** (specific frames pulled from the finished video). Does each one show what the prompt said it would?

If something's off, tell Claude what you saw. Claude decides whether the timing needs fixing (Claude's job) or the art does (Codex's job), and writes a follow-up prompt if Codex has more to do.

---

## Step 5: Put it in the show

Copy the 64×64 MP4 to the folder where LOR looks for media, then add it to your `2026-` copy of the song's sequence: select the entire matrix row, add a **Movie** motion effect, and choose the new video file as its source. Then play the sequence. The elf on the matrix and the four singing trees should all sing together.

---

## Tips if you try this

- **Make the timing first and prove it on something else.** We check the timing on the singing trees before Codex ever sees it. Never let the video step change the timing.
- **Ask for hard rules, not hopes.** "Exactly 5,000 frames" can be checked. "About the right length" can't.
- **Ask for counts that must match.** A list like "AI: 1,401 frames, rest: 1,210…" catches a dropped or merged mouth shape that you'd never spot by eye.
- **Ask for the editable art and the render script, not just the video.** Then you can touch up one mouth shape and rebuild.
- **Tell Codex what's read-only.** It will happily "improve" files you didn't mean it to touch.
- **Describe the mood of the song.** The same elf should look different singing a ballad than a novelty song.
- **Keep the elf original.** Ask for your own character, and say not to base it on anything from a film or an album cover.

---

## What it costs

Both are paid services, so check current plans on each company's site.

- **Claude:** I use Claude Code in VS Code on my Claude subscription.
- **Codex:** Codex comes with a ChatGPT subscription from OpenAI.

I have the $20 monthly subscription for each.

Everything else is free: Python, ffmpeg, and Papagayo's phoneme format.

---

## Lessons learned

- **Two AIs beat one** when the jobs are this different. Claude is strong at careful planning and working inside my existing project. Codex is stronger at artwork.
- **The prompt is the product** of Claude's half. The more exact it is, the less back-and-forth with Codex.
- **Small means simple.** At 64×64, a bold, simple face with big mouth shapes reads from the street. Fine detail just becomes noise.
- **Silence is correct.** Instrumental breaks show the elf with its mouth closed. Put the song's sections in the prompt so Codex doesn't treat them as a mistake.

---

## Want to try it?

You need a pixel matrix in your LOR show, a song with clear vocals, its lyrics, and accounts with both Claude and OpenAI. If you already have singing faces with Papagayo timing, you're halfway there.

### A starter prompt for Claude

```text
I run a Light-O-Rama Christmas show. I want a cartoon elf that sings along with
a song on my pixel matrix, as a silent MP4 that LOR plays on the matrix prop.

My matrix: [width] x [height] RGB pixels, named [prop name] in my LOR preview.
Song: [title, artist]. Song file: [path]. Sequence length: [seconds].
Lyrics: [paste them, or say where they are].
Existing timing: [path to a .pgo file, or "none yet"].

Please:
1. Build the lip-sync timing at 20 fps from the lead vocal and my lyrics, if I
   don't have it already, and convert it to one row per video frame.
2. Write a detailed prompt for OpenAI Codex (CODEX_PROMPT.md in the song's
   folder) so Codex can draw the elf and build the video. Codex knows nothing
   about my show, so the prompt must include:
   - exact video specs: size, 20 fps, exact frame count, H.264, no audio
   - a rule that Codex must use the timing exactly and never change it
   - a detailed description of an original elf character (no film or album art)
   - separate, lined-up art layers for head, pompom, eyes and each mouth shape
   - what each mouth shape looks like, and how often it appears in the song
   - a review video scaled up with the song added, for me to check sync
   - counts and specific frames Codex must verify in the finished MP4
   - which files Codex must not touch
3. Don't change any of my sequence or preview files.
```

Then give Codex the prompt Claude wrote, watch the review video with sound, and send any problems back to Claude.

If you're a Light-O-Rama user and have questions, find us on the [North Pole South Facebook page](https://www.facebook.com/apachechristmas).

Merry Christmas from North Pole South! 🎄
