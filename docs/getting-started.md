---
title: "Getting Started: Setting Up Your Computer for AI Helpers"
description: "A plain-English primer for Light-O-Rama users: what VS Code is, how to add Claude and Codex to it, and the few free tools (Python, ffmpeg) the other North Pole South projects need."
---

# Getting Started: Setting Up Your Computer for AI Helpers

*A plain-English guide for Light-O-Rama users who have never written code and don't plan to start.*

The other pages on this site ([Singing Faces](singing-faces.md), [Singing Elf Matrix Video](singing-elf-matrix-video.md), and the [Live Playlist](live-lor-playlist.md)) all assume one setup on your show computer. The Live Playlist also needs one extra tool, Node.js, covered at the end of Step 7. This page walks you through that setup step by step. Plan on about an hour, mostly spent waiting for downloads.

You don't need to understand code. The AI helpers write it and run it. Your job is to describe what you want, answer their questions, and check the results.

*This is what worked for me. Use it at your own risk; see the [Disclaimer](disclaimer.md).*

!!! danger "Never work on your live Light-O-Rama sequence files"
    **Never point an AI helper at your real LOR Sequences folder, and never let it change the files your show actually plays.** One wrong save, overwrite or "improvement" can wreck a sequence you spent weeks building, and it can happen days before the show.

    Do what I do instead:

    1. **Copy** the sequence and preview files you need into your project folder. Copy them; don't move them. **Leave your audio files where they are.** The copied sequences still point to the music in its usual place, and nothing in these projects changes audio files. The helpers only read them. To be safe, tell the helper the audio is read-only.
    2. **Rename the copies** so they can never be mistaken for the originals. I put a `2026-` prefix on every one, so `Believe.loredit` becomes `2026-Believe.loredit`.
    3. **Work only on the copies.** Tell the AI helper at the start: *"Never open, change, save or copy anything in my live LOR Sequences folder. Only work on the files in this project folder."*
    4. **Check the result in LOR** before it goes anywhere near the show.
    5. **Copy the finished file into LOR yourself.** Thanks to the prefix, it sits next to your original instead of replacing it, so you can always go back.

    If something goes wrong, you delete the copy and start again. Your real show is never at risk.

---

## The big picture

Here's everything you'll set up and what it does:

| Piece | Think of it as | Cost |
|---|---|---|
| **VS Code** | The workshop: a window where your project files and your AI helpers live side by side | Free |
| **Claude Code** (from Anthropic) | An assistant that lives in the workshop. It reads your files, writes scripts, runs them, and explains what it did | Paid subscription |
| **Codex** (from OpenAI) | A second assistant in the same workshop, especially good at artwork and images | Paid subscription |
| **Python** | The language the helpers write their little programs in. Your computer needs it installed to run them | Free |
| **ffmpeg** | A tool that cuts, converts and builds audio and video files | Free |

You talk to Claude and Codex in plain English. They use Python and ffmpeg behind the scenes. VS Code is where it all happens.

> **Do I need both AI helpers?** No. Claude alone covers the singing faces and the live playlist. You only need Codex for the singing-elf video, where it draws the artwork. Start with Claude and add Codex later if you want it.

These steps are written for **Windows**, since that's what Light-O-Rama runs on.

---

## Step 1: Sign up for the AI services

Both are paid subscriptions you sign up for on the company's website. I pay for the $20-a-month plan of each. Check the sites for current plans and prices.

- **Claude:** go to [claude.ai](https://claude.ai), create an account, and choose a paid plan (Pro or higher). The free plan doesn't include Claude Code.
- **Codex:** Codex comes with a paid **ChatGPT** plan. Go to [chatgpt.com](https://chatgpt.com), create an account, and choose a paid plan (Plus or higher).

Write down which email address you used for each. You'll sign in with it inside VS Code later.

---

## Step 2: Install VS Code

**Visual Studio Code** ("VS Code") is a free program from Microsoft. Programmers use it to edit code, but you'll mostly use it as a home for your project folder and a place to chat with the AI helpers.

1. Go to [code.visualstudio.com](https://code.visualstudio.com) and click the big **Download for Windows** button.
2. Run the file you downloaded.
3. Accept the agreement and keep clicking **Next**. When you reach the page called **Select Additional Tasks**, tick these two boxes:
    - **Add "Open with Code" action to Windows Explorer file context menu**
    - **Add "Open with Code" action to Windows Explorer directory context menu**

    These let you right-click a folder and open it straight in VS Code. Leave **Add to PATH** ticked (it's on by default).
4. Click **Install**, then **Finish**.

> **VS Code is not Visual Studio.** Microsoft also sells a much bigger program called *Visual Studio*. You don't want that one. Look for the blue icon and the name *Visual Studio **Code***.

### A quick tour of VS Code

When VS Code opens, you'll see:

- **The Activity Bar:** a column of icons down the far left edge. The one that looks like four little squares is **Extensions** (add-ons). The top one, two pieces of paper, is the **Explorer**, which shows your files.
- **The Side Bar:** the panel next to the icons. It shows whatever icon you clicked, such as your files.
- **The Editor:** the big area in the middle where files open.
- **The Terminal:** a panel that can open along the bottom. It's a text window where commands run. You'll mostly watch the AI helpers use it rather than typing in it yourself. Open it with **View → Terminal**.

---

## Step 3: Make a project folder

Each project gets its own folder. The AI helpers can only see and change what's inside the folder you open. That's a useful safety fence.

1. In File Explorer, make a new folder, for example `Documents\Christmas Show AI`.
2. In VS Code, choose **File → Open Folder…** and pick that folder.
3. VS Code asks **"Do you trust the authors of the files in this folder?"** It's your own folder, so click **Yes, I trust the authors**.

> **Tip:** I keep my project folders inside OneDrive so everything is backed up automatically. The exception is passwords and keys. Those never go in a synced or shared folder. The AI helpers will remind you.

> **Never open your live LOR Sequences folder as the project.** Copy the files you need into this project folder and rename the copies with a prefix such as `2026-`. See the [warning at the top of this page](#getting-started-setting-up-your-computer-for-ai-helpers).

---

## Step 4: Add Claude to VS Code

Add-ons for VS Code are called **extensions**. Claude comes as one.

1. Click the **Extensions** icon (the four squares) in the Activity Bar, or press **Ctrl+Shift+X**.
2. In the search box, type **Claude Code**.
3. Find the one published by **Anthropic**. Check the publisher name carefully, and look for the blue check mark that marks a verified publisher. Imitation extensions do exist.
4. Click **Install**.
5. A Claude icon appears in VS Code (in the Activity Bar or at the top right of the editor). Click it to open the Claude panel.
6. Claude asks you to sign in. Choose to sign in with your **Claude account**. Your web browser opens. Log in with the email from Step 1 and approve the connection. Then go back to VS Code.

You'll now have a chat box. Type to Claude in it the same way you'd write an email to a helpful expert.

---

## Step 5: Add Codex to VS Code (optional)

Codex installs the same way.

1. Open **Extensions** again (**Ctrl+Shift+X**).
2. Search for **Codex**.
3. Pick the one published by **OpenAI** (again, check for the verified check mark), and click **Install**.
4. Open the Codex panel from its icon and choose **Sign in with ChatGPT**. Log in in your browser with the account from Step 1, then go back to VS Code.

If the extension asks you to set up anything else, follow its prompts.

Both helpers can work in the same project folder. They don't talk to each other, so you pass work between them. On the singing-elf page, for example, Claude writes a set of instructions into a file and you tell Codex to follow it.

---

## Step 6: Install Python

Python is the programming language the helpers write their scripts in. Your computer needs Python installed to run those scripts. You won't write any Python yourself.

**Install it by following Python's own instructions.** Python's installer changes from time to time, and the official instructions are always up to date:

- Download page: [python.org/downloads/windows](https://www.python.org/downloads/windows/)
- Step-by-step guide: [Using Python on Windows](https://docs.python.org/3/using/windows.html)

Or let Claude do it, the same way as ffmpeg in the next step: *"Please install Python on this computer, following python.org's current instructions. Explain each step before you run it."*

### What matters for our projects

Whichever way you install it, check these four things:

1. **Python must work from the terminal.** The AI helpers run Python by typing `python` in VS Code's terminal. When you're done, close and reopen VS Code, open **View → Terminal**, type `python --version`, and press Enter. You should see something like `Python 3.15.2`. If you get an error, or the Microsoft Store opens, see [Troubleshooting](#troubleshooting).
2. **The newest version isn't always the right one.** Some of the tools these projects use, such as the vocal separation and speech recognition tools, can take months to support a brand-new Python version. If a project needs a particular version, Claude will tell you and can install it next to the one you have. Both can live on the same computer.
3. **Packages are Claude's job.** The projects also use free add-ons for Python, called *packages*. You don't install these by hand. Claude installs the ones each project needs inside that project's folder, and asks you first.
4. **Leave room on your disk.** Some packages, especially the ones for separating vocals and recognizing speech, are large downloads measured in gigabytes.

---

## Step 7: Install ffmpeg

**ffmpeg** is a free tool for working with audio and video. The singing-face and singing-elf projects use it to read your MP3s and build MP4 videos.

The easiest way to install it is to let Claude do it. Open the Claude panel and type:

> Please install ffmpeg on this computer using winget, and check that it works. Explain each step before you run it.

Claude shows you the command it wants to run and waits for you to approve it. Windows may also pop up a box asking whether to allow the change. Click **Yes**.

When it's done, **close VS Code completely and open it again** so it notices the new tool.

**Prefer to do it yourself?** Open the VS Code terminal and run:

```text
winget install --id Gyan.FFmpeg -e
```

Then close and reopen VS Code, and check it with `ffmpeg -version`.

### Only for the Live Playlist: Node.js

Skip this unless you're building the [Live Playlist](live-lor-playlist.md) website. That project runs on **Node.js** (version 20 or newer) instead of Python. The singing faces and singing elf don't need it.

Install it by following the official instructions at [nodejs.org](https://nodejs.org/en/download), choosing the version marked **LTS** (long-term support). Or ask Claude to install it for you. Claude installs the Firebase tool the project uses when it's needed.

---

## Step 8: Say hello

Make sure everything is connected. In the Claude panel, type:

> Check my setup: tell me which versions of Python and ffmpeg are installed, and whether you can see the files in this folder. Don't install or change anything.

Claude runs a few harmless commands and reports back. If anything is missing, it tells you what and offers to fix it.

You're ready. Head to [Singing Faces with Claude](singing-faces.md) for a first project.

---

## Working safely with AI helpers

The helpers can run commands on your computer, so they ask before doing anything that matters. You'll see an approval box describing what they want to do.

- **Read the box before you click.** If it says "install", "delete", "overwrite" or "publish" and you didn't expect that, click **No** and ask why.
- **Work on copies, never your live sequences.** Keep your real LOR files out of reach and give the helpers renamed copies (`2026-Believe.loredit`) in the project folder.
- **Tell them your rules up front.** For example: *"Never open, change, save or copy anything in my live LOR Sequences folder. Ask before installing anything."* They'll follow those rules.
- **Ask them to explain.** "What does that command do?" is always a fair question. You'll get a plain answer.
- **Keep backups.** Copy your sequence files somewhere safe before any project touches them. The helpers are careful, but backups are cheap.
- **Check the results yourself.** Open the sequence in LOR, or watch the video with sound. The helpers can prove a file is the right *size*. Only you can tell whether it *looks* right.

---

## Glossary

**Extension:** an add-on that gives VS Code a new ability, like a plug-in. Claude Code and Codex are extensions.

**Folder / workspace:** the folder you opened in VS Code. The AI helpers work inside it.

**Terminal:** a text window where commands are typed and run. The helpers use it, and you can watch.

**PATH:** a list Windows keeps of places to look for programs. "Add to PATH" means "let other programs find this one".

**Prompt:** what you type to an AI helper. Longer, more specific prompts get better results.

**Package:** a free add-on for Python that does one job, like reading MP3s. Claude installs these as needed.

**winget:** Windows' built-in app installer that works from the terminal. Claude uses it to install tools like ffmpeg.

---

## Troubleshooting

**Typing `python` gives an error or opens the Microsoft Store.**
Windows can't find Python yet. First close every VS Code window and open it again. If it still doesn't work, check the [Using Python on Windows](https://docs.python.org/3/using/windows.html) guide, or ask Claude: *"Typing python in the terminal doesn't work. Please help me fix it."*

**A tool works in one window but not in VS Code.**
VS Code only notices newly installed tools when it starts. Close every VS Code window and open it again.

**The Claude or Codex sign-in doesn't come back to VS Code.**
Make sure you finished the approval in the browser. Then close the browser tab and try signing in again from the extension's panel.

**"I can't find the extension."**
Check the spelling in the Extensions search and look at the publisher: **Anthropic** for Claude Code, **OpenAI** for Codex.

**Something else.**
Ask Claude. Describe what you did and paste in any error message. Fixing setup problems is one of the things it's best at.

---

If you're a Light-O-Rama user and have questions, find us on the [North Pole South Facebook page](https://www.facebook.com/apachechristmas).

Merry Christmas from North Pole South! 🎄
