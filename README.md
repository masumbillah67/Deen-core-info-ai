# Deen Core AI — Complete Android APK project

This is the React + Vite + Express project with Capacitor configuration and a GitHub Actions workflow for building a **debug APK**.

## Build APK on GitHub

1. Extract this ZIP on your device/computer.
2. Upload the *contents* of the project folder to the root of your GitHub repository (not the ZIP as a single file). Keep `.github/workflows/build-apk.yml` at that exact path.
3. Commit and push to `main` or `master`, or open **Actions → Build Android APK → Run workflow**.
4. When the run succeeds, open its summary and download the `Deen-Core-AI-APK` artifact. Extract the downloaded artifact ZIP to get the `.apk` file.

The workflow uses Bun because this project has `bun.lock`; it does not require `package-lock.json`. It installs Java 21 for the Android build.

## Run locally

- Install dependencies: `bun install`
- Development server (Vite + API): `bun run dev`
- Production web build: `bun run build`

## Important runtime notes

- `server.ts` runs the Express API and serves the web UI. An APK does not run a Node/Express server inside Android by itself. For Gemini chat to work in the installed APK, deploy the backend to a public HTTPS host and configure the frontend API calls to use that backend URL. Keep `GEMINI_API_KEY` on the backend only.
- Firebase settings are currently loaded from `firebase-applet-config.json`. Confirm that this file contains the Firebase project settings you intend to use and configure Firebase Authentication/Firestore rules appropriately.
- This workflow creates a debug APK, not a signed Play Store release APK/AAB.
- The project has been updated from the source ZIP, but this environment cannot run the GitHub Actions job or verify the final APK build. If the workflow fails, the exact Actions error log is needed for the next fix.
