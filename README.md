# Regina Abihail Enudi — Portfolio & Academic Console

A multi-page personal site built from scratch in plain HTML, CSS and JavaScript — no frameworks, no build step. Six pages (Home, About, Work, Academics, Certifications, Contact) sharing one design system in `assets/css/style.css`.

## Structure

```
index.html            Home
about.html             Bio, skills, work history
work.html               Ventures & projects (filterable)
academics.html      Live CGPA calculator + task planner
certifications.html  20 credentials, searchable/filterable
contact.html            Validated contact form
404.html                 Custom not-found page
assets/css/style.css     Full design system (tokens, layout, components)
assets/js/main.js        Shared nav behaviour (every page)
assets/js/academics.js   CGPA calculator + task planner logic
assets/js/certifications.js  Search/filter for the credentials grid
assets/js/work.js        Category filter for ventures
assets/js/contact.js     Form validation + mailto handoff
```

Everything is static — open `index.html` directly in a browser, or serve the folder with any static file server. No npm install, no build.

## What's real vs. what you should personalize

- All copy, dates, credential IDs, and course names come from your CV and the certificate PDFs you shared — nothing is invented.
- The CGPA calculator ships with your known course names (CSC112, COS 106, COS 102, MATH 102, PHY 102) but **no pre-filled grades** — add your real ones. It saves to `localStorage`, so it remembers between visits on the same browser, but nothing leaves the browser.
- The task planner is intentionally empty by default. It doesn't include your weekly commitments (church, field service, etc.) — those are personal, and this is a public site anyone can view once it's live on GitHub Pages.
- Your photo is now in the hero on `index.html` (`assets/img/profile.jpg`), cropped to a square and set inside the halo-ring frame. If you want more photos (resin pieces, Phoebe's Paragon dishes), drop them in `assets/img/` and reference them the same way — the venture cards on `work.html` would be the natural next spot.
- The Credly note on the certifications page is left as plain text because I can't log into third-party accounts on your behalf — see the note below.

## Deploying to GitHub Pages (github.com/Quinn-abihail)

I can't push to your GitHub account directly — I don't have a connector with write access to it, and pasting a personal access token into this chat isn't something I'd recommend anyway. Here's the fastest safe path:

1. Go to github.com, sign in as **Quinn-abihail**, and create a new repository (e.g. `portfolio`). Leave it empty — no README, no .gitignore.
2. On your own machine, in this folder, run:
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/Quinn-abihail/portfolio.git
   git push -u origin main
   ```
3. On GitHub, open the repo → **Settings → Pages** → under "Build and deployment," set **Source** to "Deploy from a branch," branch `main`, folder `/ (root)`. Save.
4. Your site will be live in a minute or two at `https://Quinn-abihail.github.io/portfolio/`.

If you'd rather not touch the command line, GitHub's web uploader works too: create the repo, then use "Add file → Upload files" and drag in everything from this folder (keeping the `assets` folder structure intact), then do step 3.

## About the Credly request

I don't have a way to log into third-party sites on your behalf — no browser/login tool, and I'd steer you away from ever pasting a password into a chat anyway. Two ways to get your Credly badges onto this site properly:
- Send me your **public Credly profile link** (Settings → Public Profile on Credly gives you a shareable URL) — I can fetch that page and pull real badge names/links into the certifications page.
- Or export your badge list from Credly and paste it here — same result, no login needed either way.
