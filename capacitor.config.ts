import type { CapacitorConfig } from "@capacitor/cli";

/**
 * DEPLOYMENT MODEL:
 *
 * Because this app uses swisseph (a native C module) inside /api/calculate,
 * it CANNOT be packaged as a pure static APK. Instead:
 *
 *   • The Next.js server runs on your VPS / cloud host (Railway, Render, etc.)
 *   • The Capacitor Android shell loads that server URL inside a WebView
 *   • This gives you a native APK that still has full server-side calculation power
 *
 * For LOCAL DEVELOPMENT:
 *   Set server.url to "http://YOUR_LOCAL_IP:3000" so the phone/emulator
 *   can reach your dev machine (both must be on the same WiFi).
 *
 * For PRODUCTION:
 *   Replace server.url with your deployed domain and remove the
 *   cleartext / allowNavigation overrides.
 */

const isDev = process.env.NODE_ENV !== "production";

const config: CapacitorConfig = {
  appId: "com.jyotish.kundali",
  appName: "Jyotish Kundali",

  // webDir is only used when there is NO server.url (i.e. full static mode).
  // We keep it pointing to .next/standalone or out/ as a fallback.
  webDir: "out",

  server: {
    // ── DEVELOPMENT ──────────────────────────────────────────────────────────
    // Replace 192.168.x.x with the LAN IP of your dev machine.
    // Run `ip addr show` or `hostname -I` to find it.
    // url: "http://192.168.1.100:3000",

    // ── PRODUCTION ───────────────────────────────────────────────────────────
    // Once deployed, swap the line above for your real domain:
    url: "https://jyotish-app-latest.vercel.app",

    androidScheme: "https",

    // Allow the WebView to load your dev server over plain HTTP on LAN
    cleartext: isDev,

    // Allow navigation to any subdomain of your server
    allowNavigation: ["*"],
  },

  android: {
    initialFocus: true,
    // Minimum API level 22 = Android 5.1+ (covers >99% of devices)
    minWebViewVersion: 60,
  },

  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#0f0a1e",
      showSpinner: false,
    },
  },
};

export default config;
