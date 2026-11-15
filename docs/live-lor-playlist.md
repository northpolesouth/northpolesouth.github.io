---
title: "A Live Playlist Website for Your Light-O-Rama Show"
description: "How North Pole South built northpolesouth.org: a real-time Now Playing and Up Next page for a Light-O-Rama Christmas show, using a GoDaddy domain, Firebase, and Claude in VS Code."
---

# A Live Playlist Website for Your Light-O-Rama Show

*How I built [northpolesouth.org](https://northpolesouth.org) for the North Pole South Christmas light show in Apache, Oklahoma, and how you can build one too.*

---

## The idea

Every year people pull up in front of the house, tune in on the radio, and watch the show. Many of them ask the same questions: *What song is this? What's next? Will they play my favorite? How long does the show run?*

I thought it would be cool if anyone watching could pull out their phone and see the show **live**:

- the song playing right now, with a progress bar,
- the next few songs in the queue,
- a search box to find out whether a song is in the show and roughly when it's coming up,
- which FM station to tune to, and the show schedule.

Nobody should have to install an app or sign up. A QR code on the display, or the address on a sign, takes them straight to the page.

I've been a Light-O-Rama user almost from the beginning. By trade I'm a technical writer, not a web developer. This primer covers what I learned, the pieces I used, and how I worked with an AI coding assistant (Claude, inside VS Code) to build it.

---

## What visitors see

When the show is running, the site shows:

- **Show status**: "The show is on" or "The show is off", plus the next scheduled start time.
- **Now Playing**: song title, artist, and a progress bar that moves in real time.
- **Up Next**: the next five songs in order, with a note that the playlist starts over after the last one, so nobody thinks the show is ending.
- **Find a song**: search by title or artist. The answer says it's playing now, that it's coming up (with an estimated time), "It hasn't made it into the queue yet, but it's on its way!", or "Sorry, that isn't part of the show."
- **How to listen**: the FM frequency.
- **Schedule**: the planned show nights and times.
- **👍 / 👎 buttons** on the current song, so I can learn which songs people like.

When the show computer is off, or something goes wrong, the site says so honestly. It never shows a made-up song.

---

## Research: can Light-O-Rama even do this?

The first question was whether Light-O-Rama would tell another program what it's playing. **It does.**

The **LOR Scheduled Show Player** (part of Light-O-Rama S6; I run version 6.6.12 Pro) runs a small built-in web service on the show computer. Asking it for its status returns details about the current show:

```
GET http://127.0.0.1:8001/v1/player/status
```

The reply is plain JSON (structured text). Among other things it includes:

- whether the player is **playing** or **stopped**,
- which **show** is active, and whether it's scheduled or started **on demand**,
- the **playing queue**: the sequence playing now, when it started, and how long it is,
- the **upcoming queue**: the sequences that will play next, **in true play order**.

That last item is what makes an accurate Up Next list possible. LOR already knows the order, so the website doesn't have to guess.

A few important details:

- **It is read-only.** We only ever *ask* LOR what it's doing. The website can't start, stop, or change the show.
- **It only answers on the show computer itself** (`127.0.0.1` means "this computer"). That's good: it isn't exposed to the internet, and it shouldn't be.
- **I learned the format by watching it.** I started shows, saved what the status service reported, and compared it with what was actually happening. That's how I found out that:
  - a show has a "startup" item (my one-minute intro), then the musical sequences, plus a **background** item that loops underneath the whole time;
  - there's about a **one-second gap** between sequences;
  - when the playlist reaches the end, it **loops back to the top**;
  - on-demand shows report the same way as scheduled ones, apart from a flag saying they're on demand.

> **Tip:** Don't trust guesses about what a field means. Play a show, capture what LOR reports, and check it against what you see and hear.

---

## How the pieces fit together

The key rule: **the website never talks to the show computer directly.** Nothing on the internet can reach your show computer. Instead, a small program on the show computer *pushes* a cleaned-up status to the cloud, and visitors read it from there.

```
  Show computer (at home)                     Cloud (Google Firebase)             Visitors' phones
 ┌─────────────────────────────┐            ┌──────────────────────────┐        ┌──────────────────┐
 │ LOR Scheduled Show Player   │            │ Realtime Database        │        │ northpolesouth   │
 │   status service (local)    │            │   /public/live           │◀──────│ .org             │
 │            ▲ ask every 2 s  │  publish   │   (anyone can read,      │  read  │ (Firebase        │
 │            │                │───────────▶│    only the bridge can   │        │  Hosting)        │
 │  "Bridge" (small program)   │  outbound  │    write)                │        │                  │
 └─────────────────────────────┘   only     └──────────────────────────┘        └──────────────────┘
```

1. **The bridge** is a small program on the show computer. Every 2 seconds it asks LOR for its status.
2. It **translates and cleans** the data:
   - LOR sequence names like `wizards_v3_final` become "Wizards in Winter, Trans-Siberian Orchestra".
   - Voice-overs and intros are labeled "Announcement".
   - File names, folder paths, and anything private are dropped.
3. It **publishes** only that cleaned snapshot to a cloud database. The connection is outbound only, so no router changes or port forwarding are needed.
4. **The website** is a set of static files hosted in the cloud. Visitors' phones load it and receive the snapshot live; the page updates itself as songs change.

If the show computer or internet goes down, the snapshot stops updating and the site notices it's stale. It shows "Live status unavailable" instead of pretending.

---

## Step 1: The domain (GoDaddy)

I registered **northpolesouth.org** at **GoDaddy** for one year. Any domain registrar works.

Connecting the domain to the website, in general terms:

1. In the **Firebase console**, open **Hosting → Add custom domain** and enter your domain.
2. Firebase gives you DNS records to add:
   - first a **TXT** record that proves you own the domain,
   - then **A** records that point the domain at Firebase.
3. In **GoDaddy → My Products → your domain → DNS**, add those records exactly as Firebase shows them. Remove any old GoDaddy "parked" or "forwarding" records that conflict.
4. Wait. DNS changes can take from a few minutes to a few hours. Firebase then issues a free **HTTPS certificate** automatically.

> **Tip:** Copy the record values exactly from the Firebase console rather than from a tutorial. They can differ per project.

---

## Step 2: Firebase (free)

**Firebase** is Google's toolkit for small web apps. Everything this site needs fits in the free **Spark** plan, so **no credit card is required**. I deliberately did not upgrade to the paid plan.

I used four Firebase features:

| Feature | What it does here |
| --- | --- |
| **Hosting** | Serves the website files at northpolesouth.org, with HTTPS. |
| **Realtime Database** | Holds one small "live status" record that the bridge updates and visitors' pages listen to. |
| **Authentication** | Gives the bridge its own private login, so only the bridge can write to the database. |
| **Google Analytics** | Counts visits, searches, Facebook link clicks, and 👍/👎 votes. No names or contact details. |

### Security rules matter most

The Realtime Database has **rules** that decide who can read and write. Ours say:

- **Anyone** may *read* the one public live-status record, and nothing else.
- **Only the bridge's account** may *write* it.
- Every write must match a strict format: a song title under a set length, a progress time within range, and so on. Anything unexpected is rejected.

So even if someone studies the website's code, they can't change what visitors see, and the database can't be filled with junk.

> **Using Google Analytics? Add a privacy notice.** Google's Analytics terms require sites that use it to tell visitors so, including that it uses cookies. A short "Privacy" section or page on your site covers it. Ask Claude to draft one, and check it against Google's current requirements.

> **Keep secrets out of shared folders.** The bridge's password lives only on the show computer, outside the project folder, outside OneDrive or Dropbox, and outside GitHub. The Firebase settings inside the website (the "web config") are designed to be public; the rules are what protect you.

---

## Step 3: Song names and artists

LOR knows sequences by their file names, which usually aren't what you want visitors to see. The project has a small list (`config/tracks.json`) that maps each LOR sequence to a friendly title and artist.

I didn't type the artists by hand. A script reads the **ID3 tags** (the title and artist information already inside each MP3 in my LOR Audio folder) and fills in the list. Voice-over files tagged with the album "Voice Over" are treated as announcements automatically.

When I add a new song to the show:

1. run the import script,
2. check the list,
3. rebuild the website's song catalog (this is what the search box uses).

The bridge picks up changes to the list without a restart.

---

## Step 4: Building it with Claude in VS Code

I built this with **Claude Code**, Anthropic's AI coding assistant, running as an extension inside **Visual Studio Code** (a free code editor). I described what I wanted in plain English, and Claude wrote the code, tests, and documentation, ran them, and explained the choices. I made the decisions and checked the results.

### How a typical session went

- **I described the goal:** "When I play a show, the site should show what's playing and what's next."
- **Claude asked questions** where it mattered: which features, what wording, how to handle edge cases. It also said plainly when something wasn't known yet, instead of guessing.
- **We learned from the real show.** I'd start a show in LOR and Claude would record what the status service reported. Then it built the Now Playing and Up Next logic around that real data and checked it against what was actually playing.
- **I steered from what I saw.** Some changes that came from looking at the live site:
  - "Up Next getting shorter near the end might make people think the show is ending." → We added a note that the playlist starts over.
  - "Instead of 'No upcoming occurrence available', say it hasn't made it into the queue yet, but it's on its way." → Changed.
  - "Add 'Apache, Oklahoma' under the title." → Done in a minute.
- **Claude tested its own work.** It wrote automated tests, ran the site locally, took screenshots, and even clicked the 👍 button in a test browser to confirm it worked before telling me it was done.
- **I stayed in control of anything that mattered.** Claude asked before installing things, committing to GitHub, or deploying. I ran the final "publish the website" command myself.

### Tips if you try this

- **Start with a clear brief.** Write down what you want visitors to see, and the rules you care about, for example "the website must never control the show" and "don't spend money without asking me". Give it to Claude at the start. The [starter prompt](#a-starter-prompt-for-claude) below is a good template.
- **Feed it real data.** Play your show while it watches the status service. Real captures beat assumptions.
- **Look at the result on your phone**, as a visitor would, and say what feels off. Small wording changes make a big difference.
- **Ask "why?"** Claude explains its choices, which taught me a lot about how the pieces work.
- **Use GitHub** to save versions so you can always go back.
- **Review before you publish.** You're responsible for what goes live.

---

## Extras we added along the way

- **Google Analytics:** visit counts, what people search for (including songs I don't have, which is useful for next year), Facebook clicks, and song ratings.
- **👍 / 👎 on Now Playing:** one vote per song per night per phone, sent to Analytics. No accounts, no database writes from visitors.
- **QR code on the LED matrix:** a 64×64 QR code that points to the site, shown on my pixel matrix during the show.
  - It uses strong error correction, 2×2 LEDs per QR square, and a lit border.
  - It works best at reduced brightness, held still for 10–15 seconds.
  - **Safety first:** many visitors watch from their cars. Put "Please park before using your phone" next to any QR code or web address on your display.
- **Honest estimates:** "estimated around" times for upcoming songs, calculated from the real song lengths plus the measured one-second gap.

### Ideas we considered but skipped

- **Album artwork:** too few of my MP3s had embedded art to be worth it.
- **Saving every search in our own database:** we kept it simple and safe; Analytics covers it.

---

## What it costs

| Item | Cost |
| --- | --- |
| Domain (GoDaddy) | $9.99 for a one-year registration of northpolesouth.org (a first-year price; renewals usually cost more) |
| Firebase (Hosting, Database, Auth, Analytics) | Free (Spark plan) |
| Visual Studio Code | Free |
| Claude Code | Included with my $20/month Claude plan |
| Light-O-Rama | What you already have |

---

## Lessons learned

1. **The show computer stays private.** Push status out; never let the internet in.
2. **Unknown should look unknown.** If the site isn't sure, it says so. Visitors trust it more.
3. **Capture before you code.** Real LOR data answered questions no amount of guessing could.
4. **Watch it from the street.** Seeing the site on a phone during the show gave us the best improvements.
5. **Free is enough.** A small live site like this fits comfortably in Firebase's free plan.

---

## Want to build your own?

New to this? Start with [Getting Started](getting-started.md) to set up VS Code and Claude. This project also needs **Node.js**; see the note there.

A rough checklist:

1. Make sure your show runs from the **LOR Scheduled Show Player**, and that its status service answers on the show computer.
2. Buy a **domain** (optional; Firebase gives you a free `*.web.app` address too).
3. Create a free **Firebase** project with Hosting, Realtime Database, and Authentication.
4. Write strict **database rules**: public read for one record, write only for the bridge.
5. Set up the **bridge** on the show computer and have Windows start it automatically.
6. Build the **website**: Now Playing, Up Next, search, schedule, how to listen.
7. **Test with real shows**, then deploy and put a QR code or sign on your display.

### A starter prompt for Claude

You don't have to do the checklist alone. Install **Visual Studio Code** and the **Claude Code** extension, and open an empty folder on your show computer. This folder is where your website files will live. I chose a folder inside OneDrive so everything is backed up to the cloud automatically. (Your passwords and keys are the exception: those stay outside OneDrive, and Claude will help you put them somewhere safe.) Then paste the prompt below into Claude. Replace the parts in [brackets] with your own details first.

```text
I run a Christmas light show with Light-O-Rama [version, e.g. S6.6.12 Pro], using the
LOR Scheduled Show Player on this Windows computer. I'm not a web developer, so please
explain things in plain language and ask me before making decisions that are mine to make.

Goal: a public website where people watching my show can see, on their phones, in real time:
- whether the show is on or off, and the next scheduled start time
- the song playing now (title, artist, progress bar)
- the next few songs, in the order LOR will actually play them
- a search box: is a song in the show, and roughly when will it play?
- the FM station to tune to: [frequency], and my show schedule: [dates and times]

Show name: [name]. Location: [town, state]. Domain: [your domain, or "none yet"].

How it should work:
- The LOR Scheduled Show Player has a local, read-only status service at
  http://127.0.0.1:8001/v1/player/status. A small "bridge" program on this computer
  should read it every few seconds and publish a cleaned-up snapshot to Firebase.
- Host the site on Firebase Hosting, with the live snapshot in Firebase Realtime Database.
  Stay on the free Spark plan. Never upgrade or add billing without asking me.

Rules that matter to me:
- The website must never connect to the show computer or control the show in any way.
  Nothing on the internet should be able to reach this computer: no port forwarding.
- Visitors can only read. Only the bridge can write, enforced by strict database rules.
- Keep passwords and keys out of the project folder, out of cloud-synced folders
  (OneDrive, Dropbox), and out of GitHub.
- Publish only friendly song titles and artists, never file names or folder paths.
  My MP3s have ID3 tags with titles and artists; use those.
- Never show made-up data. If the site isn't sure what's playing, it should say so.

Please start by explaining the plan in a few steps. Then, before writing the bridge,
help me capture what the LOR status service actually reports while I play a show,
so we build from real data instead of guesses.
```

Claude will ask questions and work through it with you a step at a time. Expect to go back and forth: play your show, look at the site on your phone, and tell Claude what to change.

If you're a Light-O-Rama user and have questions, find us on the [North Pole South Facebook page](https://www.facebook.com/apachechristmas).

Merry Christmas from North Pole South! 🎄
