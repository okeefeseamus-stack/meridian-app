# Meridian app

The home-screen app for Meridian. This repo holds only the app's shell - no news, no keys.
The stories come from your Apps Script (which reads them from the private Meridian repo), and
every request needs the key that lives in your app link.

## Setup (~10 minutes)

1. **New repo.** On GitHub create a **public** repo named `meridian-app` and upload everything in
   this folder (or unzip it into a local clone and push).
2. **Pages.** Repo -> Settings -> Pages -> Source: *Deploy from a branch* -> Branch: `main`, folder
   `/ (root)` -> Save. After a minute the site is at
   `https://okeefeseamus-stack.github.io/meridian-app/`.
3. **Point it at your script.** Edit `config.js` and paste your Apps Script web app URL - the one
   ending in `/exec` (Apps Script -> Deploy -> Manage deployments). Commit.
4. **Update the script.** Paste the new `Code.gs` into Apps Script, then Deploy -> Manage
   deployments -> pencil icon -> Version: *New version* -> Deploy. Same URL, new code.
5. **Install on your phone.** Open
   `https://okeefeseamus-stack.github.io/meridian-app/?k=YOUR_BUTTON_KEY`
   - iPhone: Safari -> Share -> **Add to Home Screen**
   - Android: Chrome -> menu -> **Install app** (or Add to Home screen)

   Open it from the home screen icon - it runs full screen like an app. The key is remembered
   after the first open.

The app shows your latest edition once the main Meridian repo has produced `out/app.json`
(the first digest after updating it).

## How it behaves

- Opens instantly from the last edition it saw, then checks for a newer one.
- If the latest edition is more than 5 hours old, it offers to send a fresh one. Close it to just
  read. The send button (paper plane) does the same any time.
- After a send it checks every 30 seconds and swaps in the new edition when it lands.
- On-demand editions email you too, but not Dad, and never cancel the next 7:00 send.
- Each story's blue bar is its *meridian*: the heavier it is, the more outlets covered it. The
  day's most-covered story gets the red star.

## Updating

Change files here and push - Pages redeploys in about a minute, and the app picks up the new
version next time it's opened online. If an update ever seems stuck, bump `VERSION` in `sw.js`.
