Lockr — Local-only app blocker (React Native + TypeScript)

This repository contains the starter skeleton for "Lockr" — a privacy-first, on-device app that helps users throttle access to distracting apps with Time Lock, Hourly Ration, and Extreme modes.

What's included

- Basic project manifest files (package.json, tsconfig.json, babel.config.js)
- App structure plan and TODOs managed by Copilot

Getting started

1. Install Node.js (18+)/Yarn or npm.
2. Install dependencies:

```powershell
npm install
```

3. Run Metro bundler:

```powershell
npm start
```

4. Run on Android (device/emulator):

```powershell
npm run android
```

Notes

- This is a scaffold. Native modules and platform-specific code are generated as stubs in later steps.
- No network or backend is included; persistence is local only.

Next steps

- Implement app skeleton in `src/` with navigation and screens.
- Add Redux Toolkit state slices and persistence.
- Create Android/iOS native module stubs for Usage/Overlay/Speech.
- Implement overlay blocker screen and speech fuzzy-match utility.