---
title: "App Requirements"
ref: "index"
nav_order: 1
permalink: "/en/"
layout: home
---

Requirements and scenarios for building and testing apps: WebView launch, the config request, push notifications and AppsFlyer integration.
{: .lead}

> **Do not change the Firebase project without the manager's approval** — it will break push notifications.
{: .callout .danger}

<div class="cards">
  <a class="card" href="{{ '/en/user-flow/' | relative_url }}"><span class="card-n">01</span><strong>User Flow</strong><span>First launch, WebView and stub modes, behaviour without internet</span></a>
  <a class="card" href="{{ '/en/config-request/' | relative_url }}"><span class="card-n">02</span><strong>Config Request</strong><span>Request format, AppsFlyer and Firebase data, server response</span></a>
  <a class="card" href="{{ '/en/notifications/' | relative_url }}"><span class="card-n">03</span><strong>Notifications Setup</strong><span>Permission prompt screen, FCM, notification icon</span></a>
  <a class="card" href="{{ '/en/app-requirements/' | relative_url }}"><span class="card-n">04</span><strong>App Requirements and Testing</strong><span>Tracking links, deep linking, pre-release checklist</span></a>
</div>

## Recent changes

{% include changelog-list.html limit=4 %}

[All changes →]({{ '/en/changelog/' | relative_url }})
