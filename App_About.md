PROJECT BRIEF — “Lockr” (React Native + TypeScript, iOS & Android)
0) Goal

Build a local-only mobile app that helps users throttle their own access to distracting apps with three escalating modes:

Time Lock (classic daily limit)

Hourly Ration (unlock windows of 5/10/15 min per hour)

Extreme (same as #2 but requires speaking a specific sentence to unlock)

Design must be clean, modern, minimal, and responsive. Focus on reliability, anti-bypass, and privacy (on-device only).

Important platform constraints (must implement):

Android: Full functionality via Usage Access, Draw over other apps, and optional AccessibilityService to detect/guard target apps and show a blocking overlay.

iOS: System does not permit third-party apps to block other apps without special FamilyControls entitlement (Apple-granted). Implement a “soft-lock” solution:

App-level timers + persistent notifications + Live Activities + Shortcuts automation guidance (user sets “when App X opens → run Lockr URL scheme → show gate”).

Optional URL scheme interception for known social apps (when user launches via Lockr quick actions/deeplinks).

Clear “limitations on iOS” copy in onboarding; provide one-tap guides to set Screen Time categories/limits manually.

Do not use any cloud/backend. Everything stored locally.

1) Tech/Project Setup

Stack: React Native (latest), TypeScript, React Navigation.

State: Redux Toolkit or Zustand (pick one, but keep typing strict).

Persistence: MMKV or AsyncStorage for low-latency local storage.

Timers/Background:

Foreground timers with high accuracy.

Android: Foreground service for countdown; post ongoing notification.

iOS: Background task friendly where possible + Live Activity to surface timers.

Voice: On-device speech:

Android: SpeechRecognizer bridge (RN library or custom native module).

iOS: Speech framework (on-device if available; fallback prompts).

Permissions Handling: Centralized module for requesting/validating:

Android: PACKAGE_USAGE_STATS (Usage Access), SYSTEM_ALERT_WINDOW (Draw Over), RECORD_AUDIO (Extreme mode), POST_NOTIFICATIONS, FOREGROUND_SERVICE.

iOS: Microphone, Notifications.

Feature Flags: Simple config for enabling/disabling voice challenge.

2) App Capabilities (MVP scope)
Modes

A) Time Lock

User selects apps to guard (Android: via UsageStats list; iOS: list with icons + manual instruction).

Set daily budget (e.g., 30 min).

Start timer on first detection/open of a guarded app; decrement cumulative budget across the day.

When budget hits 0: Blocker screen appears:

Options: “Remind me in 5 min”, “Add 10 min today (once)”, “Close app”.

Limit “Add X min” frequency by policy to avoid spam.

B) Hourly Ration

Config: choose 5/10/15 minutes per hour window.

Each hour, user can unlock guarded apps only for the chosen duration; then auto-relocks until next hour.

Show countdown overlay while unlocked.

C) Extreme

Same as Hourly Ration, but to unlock, user must press mic button and clearly say:

“I am stupid enough to waste more time. Please give me another 15 minutes.”

Voice gate:

On-device STT → normalize text → fuzzy match target sentence (tolerate minor errors).

If mismatch: show playful denial, allow retry with backoff.

Enforce cooldown after 3 failed attempts.

Cross-Mode UX

Quick Switcher on Home to change mode.

Per-app overrides (e.g., allow Messages).

Emergency bypass (hold button for 8s) → logs an event; optional PIN to confirm.

3) Anti-Bypass Measures (as feasible)

Android:

Overlay full-screen guard when a blocked app is foregrounded.

Keep a foreground service; auto-restart on boot.

Detect uninstall attempts of Lockr? (Show warning if package removal intent seen; cannot fully prevent).

“Protected settings” screen locked by PIN (optional).

iOS:

Provide step-by-step guides to set Screen Time limits and Shortcuts automations.

Persistent reminders & Live Activity countdown; haptic nags when exceeding.

Both:

If user force-stops Lockr or disables permissions, surface a big red “Protection Off” banner and badges until fixed.

4) UI/UX Requirements

Theme: Light/dark, neumorphic-lite cards, rounded 16-24, subtle shadows, large readable type.

Color: Neutral base; one accent color; system-adaptive.

Screens/Flows:

Welcome / Onboarding

Explain modes; platform limitation notes.

Permission setup checklist with progress (toggle states, deep links to settings).

Home (Dashboard)

Mode selector segment control.

Today usage: total budget left, next unlock window, big countdown chip.

“Guarded Apps” horizontal list with status badges.

Select Apps

Android: list from UsageStats with icons; multi-select.

iOS: curated common apps + manual add (copy explains OS limits).

Mode Config

Time Lock: daily budget slider (5–180 min), “extra minutes allowed per day” toggle.

Hourly/Extreme: 5/10/15 picker; “grace period” on app switch (e.g., 5s).

Extreme: mic test, sentence preview, sensitivity (strict/normal/lenient).

Blocker Overlay / Gate

Full-screen, distraction-free. Large countdown. Minimal choices.

Extreme: mic card with waveform animation, clear success/fail feedback.

Settings

PIN lock, haptics, notifications, theme, export/import config (JSON file).

Education

iOS how-to for Screen Time + Shortcuts (with deep links where possible).

Components to implement:

ModePillSelector, CountdownChip, PermissionChecklist, AppRow, MicGateCard, OverlayBlocker, HourDial, BigCTAButton, Toast, Sheet.

Animations: Subtle fades/scale, haptic taps on key actions.

5) Logic & State Machines

Global State Slices:

permissions: { usageAccess, overlay, mic, notifications, … }

guardedApps: [{ id, name, platformId, iconUri }]

mode: 'TIME' | 'HOURLY' | 'EXTREME'

quotas: { dailyBudgetSec, hourlyWindowSec, extraTodaySec, nextResetAt }

session: { isUnlocked: boolean, unlockEndsAt?, lastDeniedAt?, failedSpeechCount }

settings: { pin?, theme, haptics, voiceStrictness }

logs: [{ ts, type, detail }]

Timers:

TIME: Track cumulative foreground secs across guarded apps. When reach budget → lock.

HOURLY/EXTREME: Allow only within [hourStart, hourStart + window], else lock. Reset each hour; persist next reset boundary to avoid drift.

When user background/foreground switches apps, resume/stop timers correctly. Debounce app switches (e.g., 2–3s grace).

Speech Gate (EXTREME):

Normalize transcript: lowercase, strip punctuation/spaces.

Compare against normalized target; allow Levenshtein distance ≤ N (config by strictness).

If pass → start unlock window; if fail → increment failedSpeechCount and apply cooldowns (e.g., 15s → 45s → 120s).

6) Native Bridges / Permissions (generate code stubs)

Android Modules:

UsageMonitorModule (foreground app package via UsageStats / Accessibility).

OverlayModule (show RN blocker over other apps; manage SYSTEM_ALERT_WINDOW).

ForegroundService (keep timer & notification).

SpeechModule (SpeechRecognizer wrapper).

Boot receiver to re-init service on device restart.

iOS Modules:

SpeechModule (SFSpeechRecognizer).

Live Activities for countdown (ActivityKit).

Notifications scheduling.

URL scheme handler (lockr://open?app=…) for Shortcut integration.

(No FamilyControls; generate helper copy to guide user.)

7) Edge Cases (must handle)

Time changes / timezone changes / DST.

Device reboot during an active lock or unlock window.

App killed by OS; restore timers from persisted state.

Permission revoked mid-session (pause protection, show persistent banner).

Switching quickly between multiple guarded apps.

Mic failure / no permission / noisy environment (provide fallback typed phrase with penalty).

Voice text close but not exact → apply fuzzy threshold & feedback.

Low power mode / battery optimization (Android: request ignore battery optimizations prompt).

8) Testing/Debug

Feature flag to simulate “current foreground app”.

Time travel dev toggle (accelerate hour to 60s for testing).

Unit tests for:

Hour boundary resets.

Daily quota accumulation.

Speech matching thresholds.

Persistence/restore on relaunch.

E2E tests (Detox) for flow: onboarding → select apps → lock/unlock → overlays.

9) Distribution (non-store)

Android: produce signed APK; allow sideload; first-run wizard to grant all perms.

iOS: provide steps for TestFlight or sideload via AltStore/Sideloadly; include notes that full app-blocking is not possible without Apple entitlements. Generate in-app guides for setting Screen Time + Shortcuts automations.

10) Privacy & Accessibility

No network, no analytics. All data local.

Clear explanations for mic usage.

VoiceOver/TalkBack labels; dynamic type; sufficient contrast; haptic confirmation.