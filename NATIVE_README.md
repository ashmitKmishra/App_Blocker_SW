Native modules and integration points (Lockr)

This document lists the expected native modules, high-level behavior, and RN bridge signatures the app calls.

Android native modules (recommended implementations)

1) UsageMonitorModule
   - getForegroundApp(): Promise<string | null>
     * Returns current foreground package name.
   - listInstalledApps(): Promise<Array<{ id, name, icon }>>

2) OverlayModule
   - requestOverlayPermission(): Promise<boolean>
   - hasOverlayPermission(): Promise<boolean>
   - showOverlay(payload): void
   - hideOverlay(): void
   Behavior: Show a full-screen overlay Activity/Window above other apps using SYSTEM_ALERT_WINDOW or an Activity with TYPE_APPLICATION_OVERLAY.

3) ForegroundService
   - startService({ notificationTitle, notificationText }): Promise<boolean>
   - stopService(): Promise<boolean>
   - isRunning(): Promise<boolean>
   Behavior: Keeps a persistent foreground service to maintain timers and post ongoing notification. Restart on boot.

4) SpeechModule
   - requestMicrophonePermission(): Promise<boolean>
   - hasMicrophonePermission(): Promise<boolean>
   - startListening(callback)
   - stopListening()
   Behavior: Wrap Android SpeechRecognizer; provide interim and final transcripts to RN.

Additional: BootReceiver to restart service after reboot, receiver to detect package removals (warning only).


iOS native modules (recommended integrations)

1) SpeechModule (SFSpeechRecognizer wrapper)
   - Similar API to Android SpeechModule
   - Ensure local/on-device recognition where available

2) Live Activity (ActivityKit)
   - startLiveActivity(payload): start ActivityKit live activity for countdown
   - updateLiveActivity(id, data)
   - endLiveActivity(id)

3) URL Scheme Handler
   - Register URL scheme `lockr://` and route incoming `lockr://open?app=<bundle>` into the app for soft-lock flows and Shortcut integration.

Notes
- No network usage; all data stored locally (MMKV/AsyncStorage).
- Provide clear copy in onboarding about iOS limitations and Shortcuts automation guidance.

Integration
- The JS stubs in `src/modules/*.ts` provide a contract for native developers. Implement the native modules and export them via React Native bridge with the matching method names and signatures.

Security & privacy
- Microphone audio should never be uploaded. Only transcripts are used and kept locally.

*** End Patch