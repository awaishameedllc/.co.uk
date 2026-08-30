# Muhammad Awais Hameed — Portfolio Website

A premium, futuristic personal portfolio for **Muhammad Awais Hameed** — Amazon & eBay Expert, E-commerce Specialist, and SEO Expert based in Lahore, Pakistan.

## What's inside

- `index.html` — page structure and content
- `style.css` — design system (glassmorphism, dark futuristic UI, responsive layout)
- `script.js` — animations: particle-network background, 3D mouse-parallax hero console, animated "rank climb" SEO demo, scroll reveals, animated counters, mobile nav
- `README.md` — this file

No build step, no dependencies to install. It's a static site, so it works as-is in any browser and deploys directly to GitHub Pages. Three.js is loaded from a public CDN only on capable desktop browsers — see "3D command center" below.

## Design highlights

- **Hero — 3D e-commerce command center:** a lazily-loaded Three.js scene (floating data particles, connecting light lines, soft wireframe nodes, mouse-parallax camera, gentle scroll dolly) sits behind five glass "panels" (Amazon SEO, eBay Analytics, Keyword Research, Product Research, Listing Optimization) and the signature rank-tracker console. On mobile, low-memory devices, or browsers without WebGL, it automatically falls back to a lightweight CSS ambience — no broken canvas, no wasted download.
- **About — illustrated persona:** since no profile photo was provided, a small inline-SVG illustrated portrait (theme-matched navy/gold/teal, no external image file) replaces a plain letter avatar, with a subtle idle float. If you'd like to swap in a real photo later, replace the `<svg class="persona-illustration">` block in `index.html` with an `<img>` tag pointing at your photo — the surrounding `.persona-frame` / `.persona-halo` styling in `style.css` will still apply.
- **Micro-interactions:** magnetic buttons, cursor glow, 3D card tilt on the services grid, animated gradient borders, and cinematic scroll reveals (fade/scale/blur/rotate) throughout.
- Respects `prefers-reduced-motion` and simplifies automatically for touch devices and narrow viewports.

## Before you publish — fill in your real details

To avoid inventing information on your behalf, a few things were intentionally left as placeholders. Search each file for these and update them:

1. **Contact form** (`index.html`, `#contactForm`): the email field currently only collects what a visitor types — it does not yet send anywhere. Wire it up one of these ways:
   - **Simplest:** change the `<form>` tag to `<form action="mailto:YOUR-REAL-EMAIL@example.com" method="post" enctype="text/plain">` (works, but opens the visitor's email client rather than sending silently).
   - **Recommended:** sign up for a free form backend like [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com), and set `action="https://formspree.io/f/your-form-id"` on the `<form>` tag. No server code required.
2. **Direct contact links:** if you'd like a direct "Email me" or "WhatsApp me" button in the Contact section, add your real email address, phone number, or WhatsApp link into `index.html` where indicated by the comments.
3. **Social / professional links:** if you want LinkedIn, Upwork, Fiverr, or similar profile links in the nav or footer, add them manually — none are included by default since they weren't provided.
4. **Company names, client names, revenue figures, awards, certifications:** none are included. Add only real, verifiable details if you choose to include them later.

## Deploying to GitHub Pages

1. **Create a repository**
   - Go to [github.com/new](https://github.com/new).
   - Name it anything, e.g. `portfolio` (for a project page) or `<your-username>.github.io` (for a root user site).
   - Keep it **Public** (required for free GitHub Pages).

2. **Upload the files**
   - On the new repo page, click **"uploading an existing file"**.
   - Drag in `index.html`, `style.css`, `script.js`, and `README.md`.
   - Commit directly to the `main` branch.

   *Or, using Git from your computer:*
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - In your repository, go to **Settings → Pages**.
   - Under **Build and deployment → Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.

4. **Visit your live site**
   - GitHub will show a URL at the top of the Pages settings, usually:
     - `https://<your-username>.github.io/<your-repo>/` (project repo), or
     - `https://<your-username>.github.io/` (if your repo is named `<your-username>.github.io`)
   - It can take 1–2 minutes for the first deployment to go live. Refresh the Pages settings page if the link doesn't appear immediately.

5. **Custom domain (optional)**
   - If you own a domain (e.g. `awaishameed.com`), add it under **Settings → Pages → Custom domain**, and create the DNS records GitHub instructs you to add with your domain registrar.

## Updating the site later

Any time you want to change text, edit `index.html` directly (all copy is plain text in the markup — no CMS). Edit `style.css` for colors/spacing, and `script.js` for behavior. Commit and push your changes; GitHub Pages redeploys automatically within a minute or two.

## Browser support & performance notes

- Built with vanilla HTML/CSS/JS — no frameworks, no build tools, so there's nothing to break on GitHub Pages.
- Respects `prefers-reduced-motion` — animations are minimized automatically for visitors who have that OS setting enabled.
- The particle background and 3D hero console are lightweight (canvas + CSS transforms), so they run smoothly even on modest hardware and mobile devices.
- Fully responsive from large desktop screens down to small mobile viewports.
