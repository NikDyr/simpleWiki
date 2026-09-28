---
title: "User Flow"
ref: "user-flow"
nav_order: 2
---

#### 1. First launch
The first launch of the app requires an active internet connection. The internet connection is checked before the **endpoint** is contacted. Depending on the **endpoint**'s response to the request with the conversion data received from **AppsFlyer**, the following scenarios are possible:

> When adding a new app to AppsFlyer, use  
> `Timezone Moscow` (UTC + 3) and `Currency USD`
{: .callout .info}

> All scenarios are considered within a single install.
{: .callout .note}

- **1.1 The WebView launch condition is met:**
  - The request to the **[endpoint]({{ '/en/config-request/' | relative_url }})** returned a positive response (code 200 and a link for the **WebView**).
    - The link must be saved for use in scenario 2.1.
  - The mode is set to **WebView**, and on subsequent launches the app must open in this mode (2.1).
  - The user is shown the **WebView**.
- **1.2 The WebView launch condition is not met:**
  - The request to the **[endpoint]({{ '/en/config-request/' | relative_url }})** returned a negative response — any response other than a positive one, including a network error or exceeding the overall 15-second wait limit.
  - The mode is set to **stub**, and on subsequent launches the app must open in this mode (2.2).
  - The user is shown the **stub (a game or other content)**.
- **1.3 No internet connection:**
  - The app checks the connection before contacting the endpoint and does not send the request to the **endpoint**.
  - The user sees a **"No internet" placeholder screen**.
    <details markdown="1"><summary>More about the placeholder</summary>

    Optionally, the placeholder may include a Retry button that checks the connection and retries loading according to 1.1.

    </details>
  - Once the connection is restored and/or the app is relaunched, the first-launch scenario runs again according to 1.1 and 1.2.

#### 2. Subsequent launches
When reopened, the app must launch in the previously set mode:

- **2.1 WebView mode:**
  - If the **WebView** was shown on first launch, it must open on every subsequent launch.
  - The internet connection is checked first. If there is no connection, the "No internet" placeholder is shown.
  - Then the saved link's `expires` value is compared with the device's current time:
    - not expired — the saved link is opened;
    - expired — a request is sent to the **endpoint**. On a positive response, the new `url` and `expires` are saved and the new link is opened; on a negative response, the last saved link is opened.
- **2.2 Stub mode:**
  - If the **stub** was shown on first launch, the user also gets the **stub** on subsequent launches.
  - Internet is only required on first launch; after that the **stub** is shown regardless of network availability.

#### 3. Push notifications
> Firebase Messaging is used for notifications.
{: .callout .note}

> If there are problems starting notifications, the core WebView loading logic must not change.
{: .callout .warn}

- On first launch **in WebView mode**, the app must show a custom notification permission screen; if the user agrees, the system notification permission prompt appears (on Android, for SDK 33 and above). If the user declines on the custom screen, the screen is shown again after 3 days. After a refusal in the system prompt, the custom screen is no longer shown.  
  See [Notifications Setup]({{ '/en/notifications/' | relative_url }}) for details.
- After that, the app must receive and handle push notifications in the background.
- Push notifications must support images and, on Android, have a custom icon. Pushes may contain a link; tapping the notification must open it in the app.
