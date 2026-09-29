---
title: "A second service account is required for Firebase Messaging integration"
ref: "changelog/firebase-service-account"
parent: "changelog"
date: 2026-08-07 11:57:00 +0300
---

For notifications to work, a second service account — `iosandroidpushes@iosandroidpushes.iam.gserviceaccount.com` — must be added to the Firebase project in addition to `marla-export@marfa-290610.iam.gserviceaccount.com`.

Details: [Notifications Setup]({{ '/en/notifications/' | relative_url }})
