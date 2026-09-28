---
title: "Unified deep linking support is required on all platforms"
ref: "changelog/unified-deep-linking"
parent: "changelog"
---

### AppsFlyer deep linking data (UDL) in the config request

If deep linking data was received, include it in the request parameters.

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

- [Android Unified Deep Linking](https://dev.appsflyer.com/hc/docs/dl_android_unified_deep_linking)
- [iOS Unified Deep Linking](https://dev.appsflyer.com/hc/docs/dl_ios_unified_deep_linking)
- [Unified Deep Linking (UDL)](https://dev.appsflyer.com/hc/docs/unifieddeeplink)

Details: [Config Request]({{ '/en/config-request/' | relative_url }}).
