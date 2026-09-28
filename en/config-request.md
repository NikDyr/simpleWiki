---
title: "Config Request"
ref: "config-request"
nav_order: 3
---

The config implements the app's server-side logic, including registering the user in the notification system and providing the current link.

Using the config does not remove the need to integrate the AppsFlyer SDK and Firebase SDK into the app.

The config request endpoint is provided by the manager.  
To get it, provide:

- the app bundle (com.example.app)
- Apple ID (for iOS apps)
- the app name as it will appear in the target store

> Example: https://example.com/config.php
{: .callout .warn}

### Request

The request body includes AppsFlyer conversion data, the Firebase token and project, and some data about the user's device.

```json
curl --request POST \
     --url https://example.com/config.php \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "adset": "s1s3",
	"af_adset": "mm3",
	"adgroup": "s1s3",
	"campaign_id": "6068535534218",
	"af_status": "Non-organic",
	"agency": "Test",
	"af_sub3": null,
	"af_siteid": null,
	"adset_id": "6073532011618",
	"is_fb": true,
	"is_first_launch": true,
	"click_time": "2017-07-18 12:55:05",
	"iscache": false,
	"ad_id": "6074245540018",
	"af_sub1": "439223",
	"campaign": "Comp_22_GRTRMiOS_111123212_US_iOS_GSLTS_wafb unlim access",
	"is_paid": true,
	"af_sub4": "01",
	"adgroup_id": "6073532011418",
	"is_mobile_data_terms_signed": true,
	"af_channel": "Facebook",
	"af_sub5": null,
	"media_source": "Facebook Ads",
	"install_time": "2017-07-19 08:06:56.189",
	"af_sub2": null,
	"af_id": "1688042316289-7152592750959506765", // must be added on the app side 
	"bundle_id": "com.example.app", // must be added on the app side
	"os": "Android", // must be added on the app side
	"store_id": "com.example.app", // must be added on the app side
	"locale": "en", // must be added on the app side 
	"push_token": "dl28EJCAT4a7UNl86egX-U:APA91bEC1a5aGJL8ZyQHlm-B9togw60MLWP4_zU0ExSXLSa_HiL82Iurj0d-1zJmkMdUcvgCRXTrXtbWQHxmJh49BibLiqZVXPNyrCdZW-_ROTt98f0WCLtt531RYPhWSDOkykcaykE3",
	"firebase_project_id": "8934278530" // must be added on the app side
}
'
```

### Config response

Successful request:

```json
Status: 200 (OK)
{ 
	"ok": true, 
	"url": "http://link.com/",
	"expires": 1689002181 
}
```

> By default (for testing), a link can only be obtained for non-organic installs, i.e. when `"af_status": "Non-organic"`.
{: .callout .warn}

Failed request:

```json
404 (Not Found)
{ 
	"ok": false, 
	"message": "No data" 
}
```

> A **positive response** is a response with code 200 that contains a `url`. Any other response, including a network error or exceeding the wait limit, **counts as a negative response** when [deciding]({{ '/en/user-flow/' | relative_url }}) whether to launch the WebView.
{: .callout .warn}

> The overall wait limit for the AppsFlyer data and the endpoint response is **15 seconds**. If no positive response is received within this time, the response counts as negative: on first launch, the stub is opened.
{: .callout .warn}

|  | Type | Description |
|---|---|---|
| ok | Boolean | Request status |
| message | String | Message for a failed request |
| url | String | Current link for the app |
| expires | Timestamp | Link expiry date, after which a new link must be obtained with a new request |

> The notification system can only be tested if all client-side fields have been sent.
{: .callout .note}

### Conversion data
Conversion data is available after AppsFlyer initialization, in the callback for your development platform.

See the AppsFlyer documentation for details on getting conversion data:

[https://dev.appsflyer.com/hc/docs/conversion-data-android](https://dev.appsflyer.com/hc/docs/conversion-data-android)

[https://dev.appsflyer.com/hc/docs/conversion-data-ios](https://dev.appsflyer.com/hc/docs/conversion-data-ios)

[https://dev.appsflyer.com/hc/docs/conversion-data-unity](https://dev.appsflyer.com/hc/docs/conversion-data-unity)

The config request **uses all parameters available in the conversion data**, unchanged. Do not modify the list of parameters, the parameters themselves or their values in any way.

> Never modify the received list of conversion data parameters.
{: .callout .danger}

> The number of parameters in the request body for a particular install can differ significantly from the example above. The parameter list depends on the install source and any additional data passed.
{: .callout .info}

### App parameters

1. `af_id` contains the AppsFlyer ID, which is generated automatically when the AppsFlyer SDK is initialized and is returned by getAppsFlyerUID or getAppsFlyerId, depending on the development platform.

   > In the Unity editor, getAppsFlyerId returns an empty string.
   {: .callout .warn}

1. `bundle_id` contains the app's Bundle ID (`com.example.app`) or Package Name.
1. `os` contains the app platform; allowed values: `Android`, `iOS`.
1. `store_id` contains the app's Store ID. For iOS apps, `store_id` is prefixed with 'id', for example `id84435554334`. For Android apps, `store_id` is the same as `bundle_id`.
1. `locale` contains the primary locale of the user's device. The value must follow **RFC 3066** – `ru`, `en`, `en_US` – or be a name such as `English`, `French`, `Spanish`, `Italian`, etc.

### Firebase Messaging data

> If Firebase Messaging cannot be initialized, the fields below are omitted and the request is sent without them.
{: .callout .warn}

1. `push_token` contains the current Firebase Messaging registration token. [More about setting up Firebase Messaging and getting the token](https://firebase.google.com/docs/cloud-messaging).

   > When the token is refreshed, it must be sent immediately in a new request. If the response contains a new link, the saved `url` and `expires` are replaced with the new values.
   >
   > In stub mode, token refreshes are not handled — no config requests are made.
   {: .callout .note}

1. `firebase_project_id` contains the Firebase `Project number` or `Project ID`.

### AppsFlyer deep linking data (UDL)

If deep linking data was received from AppsFlyer, include it in the request parameters.

```json
{  
	"campaign_id": "",
	"af_sub3": "",
	"match_type": "probabilistic",
	"af_sub1": "",  
	"deep_link_value": "test_deep_link_value",  
	"campaign": "",  
	"af_sub4": "",  
	"timestamp": "2022-12-06T11:47:40.037",  
	"click_http_referrer": "",  
	"af_sub5": "",  
	"media_source": "",  
	"af_sub2": "",  
	"deep_link_sub1": "test_sub_value",  
	"is_deferred": true
}
```

> Some fields may be missing from the deep link data.
>
> Some fields also share keys with conversion parameters. In that case, the data received first is used.
{: .callout .tip}

*More about deep linking:*

[Android Unified Deep Linking](https://dev.appsflyer.com/hc/docs/dl_android_unified_deep_linking)

[iOS Unified Deep Linking](https://dev.appsflyer.com/hc/docs/dl_ios_unified_deep_linking)

[Unified Deep Linking (UDL)](https://dev.appsflyer.com/hc/docs/unifieddeeplink)

---

On a positive response, save the `url` and `expires` values and open the link in the WebView unchanged. If `expires` is missing from the response, save the device's current time instead.

On subsequent launches, compare `expires` with the device's current time. If the link has expired, make a new request and, on a positive response, save the new values.

If the new request returns a negative response but a `url` was received earlier and is currently saved on the device, open the saved link in the WebView.

### Behaviour on a negative response

On a negative response, if no `url` has been received before, launch the game and make no further config requests within this install, unless different logic has been agreed for this app.
