---
title: "User Flow"
ref: "user-flow"
nav_order: 2
---

#### 1. First launch
The first launch of the app requires an active internet connection. Depending on the conversion data received from **AppsFlyer**, the following scenarios are possible:

> When adding a new app to AppsFlyer, use  
> `Timezone Moscow` (UTC + 3) and `Currency USD`
{: .callout .info}

> All scenarios are considered within a single install.
{: .callout .note}

- **1.1 The WebView launch condition is met:**
  - The request to the **[endpoint]({{ '/en/config-request/' | relative_url }})** returned a positive response and a link for the **WebView**.
    - The link must be saved for use in scenario 2.1.
  - The mode is set to **WebView**, and on subsequent launches the app must open in this mode (2.1).
  - The user is shown the **WebView**.
- **1.2 The WebView launch condition is not met:**
  - The request to the **[endpoint]({{ '/en/config-request/' | relative_url }})** returned a negative response.
  - The mode is set to **wrapper**, and on subsequent launches the app must open in this mode (2.2).
  - The user is shown the **wrapper (a game or other content)**.
- **1.3 No internet connection:**
  - The app cannot send the request to the **endpoint**.
  - The user sees a **"No internet" placeholder screen**.
    <details markdown="1"><summary>More about the placeholder</summary>

    Optionally, the placeholder may include a Retry button that checks the connection and retries loading according to 1.1.

    </details>
  - Once the connection is restored and/or the app is relaunched, the first-launch scenario runs again according to 1.1 and 1.2.

#### 2. Subsequent launches
When reopened, the app must launch in the previously set mode:

- **2.1 WebView mode:**
  - If the **WebView** was shown on first launch, it must open on every subsequent launch.
  - The link to display is requested from the **endpoint**; if the **endpoint** does not respond, the **WebView** must display the last successfully received link.
  - If there is no internet connection, the "No internet" placeholder is shown.
- **2.2 Wrapper mode:**
  - If the **wrapper** was shown on first launch, the user also gets the **wrapper** on subsequent launches.
  - Internet is only required on first launch; after that the **wrapper** is shown regardless of network availability.

#### 3. Push notifications
> Firebase Messaging is used for notifications.
{: .callout .note}

> If there are problems starting notifications, the core WebView loading logic must not change.
{: .callout .warn}

- On first launch **in WebView mode**, the app must show a custom notification permission screen; if the user agrees, the system notification permission prompt appears (on Android, for SDK 33 and above). If the user declines, the prompt must be shown again after 3 days.  
  See [Notifications Setup]({{ '/en/notifications/' | relative_url }}) for details.
- After that, the app must receive and handle push notifications in the background.
- Push notifications must have a custom icon and support images. Pushes may contain a link; tapping the notification must open it in the app.
