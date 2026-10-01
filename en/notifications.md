---
title: "Notifications Setup"
ref: "notifications"
nav_order: 4
---

Notifications in the apps are implemented with [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).

> **Do not change the Firebase project without the manager's approval** — it will break push notifications.
{: .callout .danger}

---

If, according to the [user flow]({{ '/en/user-flow/' | relative_url }}), the **WebView** is launched, the app must ask the user for permission to send notifications. To do this, implement a screen offering notifications that is shown before the system prompt:

<figure class="figma-embed">
  <iframe src="https://embed.figma.com/design/amAQaFjDIzjYyL0W0l4KIh/Push?node-id=0-1&embed-host=share&theme=system" title="Notification prompt screen" loading="lazy" allowfullscreen></iframe>
  <figcaption><span class="figma-logo" aria-hidden="true"></span>Notification prompt screen · <a href="https://www.figma.com/design/amAQaFjDIzjYyL0W0l4KIh/Push?node-id=0-1&t=oar6I4PXQeTbu7HM-1">Open in Figma</a></figcaption>
</figure>

> The design prepared for the app may include unique images for this screen.
> The image style must match the app's theme.
{: .callout .note}

**The prompt screen must be shown if:**

- Permission has not been granted yet and can still be requested
- The last refusal was more than 3 days ago

**Buttons:**

- **"Yes, I Want Bonuses!"** — requests the system notification permission, then proceeds to the WebView
- "Skip" — proceeds to the WebView without asking

> A refusal in the system prompt is a complete refusal: the custom screen is no longer shown.
{: .callout .note}

---

To support notifications on Android 13 and above (API level 33+), you must request the notification permission: add the corresponding permission to the manifest and call the method that requests it.

- [Notification runtime permission (Android Developers)](https://developer.android.com/develop/ui/views/notifications/notification-permission)
- [ActivityCompat.requestPermissions — API reference (Android Developers)](<https://developer.android.com/reference/androidx/core/app/ActivityCompat#requestPermissions(android.app.Activity,%20java.lang.String%5B%5D,%20int)>)

---

Android requires a separate icon to be shown in the notification:

<figure class="figma-embed">
  <iframe src="https://embed.figma.com/design/FeBnHuFUJBa2mv0t68d314/Notification-icon?node-id=0-1&embed-host=share&theme=system" title="Notification icon" loading="lazy" allowfullscreen></iframe>
  <figcaption><span class="figma-logo" aria-hidden="true"></span>Notification icon · <a href="https://www.figma.com/design/FeBnHuFUJBa2mv0t68d314/Notification-icon?node-id=0-1&p=f&t=BcfG1L34x3pB1FOI-0">Open in Figma</a></figcaption>
</figure>

![]({{ '/assets/img/c147e697f000.png' | relative_url }})

---

Notifications must support images

![]({{ '/assets/img/e12ca734f4f5.png' | relative_url }})

![]({{ '/assets/img/e50cb8365b40.png' | relative_url }})

![]({{ '/assets/img/c98e8a076a76.png' | relative_url }})

![]({{ '/assets/img/d653094629df.png' | relative_url }})

---

> **FCM integration**
>
> For notifications to work, **the service accounts must be added**  
> `marla-export@marfa-290610.iam.gserviceaccount.com` and `iosandroidpushes@iosandroidpushes.iam.gserviceaccount.com` to the Firebase project via Google Cloud Platform with the `Basic → Owner` role. To do this:
>
> - open `Users and permissions` in the Firebase project settings
> - click the `Advanced permission settings` link at the bottom of the page to go to the corresponding project in Google Cloud Platform
> - click `+ Add` to add a new user
> - add the service accounts `marla-export@marfa-290610.iam.gserviceaccount.com` and `iosandroidpushes@iosandroidpushes.iam.gserviceaccount.com` and set the access level to `Owner` in the `Basic` category
> - save the changes by clicking `Save`
{: .callout .info}

> If the Firebase project needs to be replaced, let the manager know.
> **Do not change the Firebase project without the manager's approval** — it will break push notifications.
{: .callout .warn}

---

> For the notification system to work, the data must be sent via the [config request]({{ '/en/config-request/' | relative_url }}).
{: .callout .warn}

---

#### Handling received notifications

1. Set up notification receiving in the app using the platform's methods.
1. When the app is opened by tapping a notification, check the notification `payload` `data` for a `url` key.
   <details markdown="1"><summary>Example notification <code>payload</code></summary>

   ```json
   {
   	"message":{
   		"token":"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
   		"notification":{
   			"title":"Great offer!",
   			"body":"play now"
   		},
   		"data" : {
   			"url" : "https://example.com/"
   		}
   	}
   }
   ```

   </details>

1. If `url` is present and not empty, open that link in the WebView.
1. **Do not save this link.** On the next launch, the link received from the [config request]({{ '/en/config-request/' | relative_url }}) must be opened.

#### Notification open callback

When the app is opened by tapping a notification, send a callback to the `interaction.php` endpoint. The endpoint is on the same domain as the [config request]({{ '/en/config-request/' | relative_url }}): if the config is at `https://example.com/config.php`, the callback goes to `https://example.com/interaction.php`.

```json
curl --request PUT \
     --url 'https://example.com/interaction.php?message_id=0%3A1500415314455276%2531bd1c9631bd1c96' \
     --header 'content-type: application/json' \
     --data '{"af_id": "1688042316289-7152592750959506765"}'
```

| Parameter | Passed in | Description |
|---|---|---|
| message_id | Query parameter | The message ID Firebase assigns to every notification when it is sent (see below). Sent as is, **URL-encoded** |
| af_id | Request body (JSON) | AppsFlyer ID, the same one sent in the [config request]({{ '/en/config-request/' | relative_url }}). Must not be empty |

##### Where to get message_id

`message_id` is a default Firebase parameter. In the app it is available under a different key on each platform:

| Platform | Where to get it when the notification is opened |
|---|---|
| Android | App in the background or closed: launch intent extras, key `google.message_id` — `intent.getStringExtra("google.message_id")`. App in the foreground: `RemoteMessage.getMessageId()` in `onMessageReceived`; if the app shows the notification itself, pass this ID into its `PendingIntent` |
| iOS | `userInfo["gcm.message_id"]` in `userNotificationCenter(_:didReceive:)` |
| Flutter | `RemoteMessage.messageId` from `FirebaseMessaging.instance.getInitialMessage()` and `FirebaseMessaging.onMessageOpenedApp` |
| Unity | `FirebaseMessage.MessageId` in the `FirebaseMessaging.MessageReceived` handler when `NotificationOpened == true` |

> The ID format is set by Firebase, e.g. `0:1500415314455276%31bd1c9631bd1c96`. It contains `:` and `%`, so the value must be encoded in the query parameter (`encodeURIComponent`, `Uri.encode`, `addingPercentEncoding`, etc.): `message_id=0%3A1500415314455276%2531bd1c9631bd1c96`. Without encoding, `%31` is read as `1` and the ID is corrupted.
{: .callout .warn}

Error responses:

| Code | Reason |
|---|---|
| 400 (Bad Request) | `message_id` is missing, or `af_id` is empty |
| 405 (Method Not Allowed) | A method other than `PUT` was used |
