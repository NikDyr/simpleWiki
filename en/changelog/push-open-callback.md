---
title: "A callback must be sent when a notification is opened"
ref: "changelog/push-open-callback"
parent: "changelog"
date: 2026-09-29 16:07:00 +0300
---

When the app is opened by tapping a notification, send a `PUT` request to the `interaction.php` endpoint with the notification's `message_id` and the `af_id`.

Details: [Notifications Setup]({{ '/en/notifications/' | relative_url }})
