---
title: "Требуется поддержка Unified deep linking на всех платформах"
ref: "changelog/unified-deep-linking"
nav_exclude: true
---

## Требуется поддержка Unified deep linking на всех платформах

### Данные deep linking AppsFlyer (UDL) при запросе к конфигу

В случае если удалось получить данные deep linking необходимо включить их в параметры запроса.

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

💡  
Некоторых полей в теле deep link данных может не быть.  
Так же некоторые поля совпадают по ключу с параметрами конверсии. В случае совпадения используются первые полученные данные.

Подробнее про deep linking:  
https://dev.appsflyer.com/hc/docs/dl_android_unified_deep_linking

https://dev.appsflyer.com/hc/docs/dl_ios_unified_deep_linking

https://dev.appsflyer.com/hc/docs/unifieddeeplink

Подробнее в разделе Запрос к конфигу
