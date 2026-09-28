---
title: "Запрос к конфигу"
ref: "config-request"
nav_order: 3
---

Конфиг реализует серверную логику приложения, включая авторизацию пользователя в системе уведомлений и предоставление актуальной ссылки.

Использование конфига не исключает необходимость подключения Appsflyer SDK и Firebase SDK в приложение.

Эндпоинт для запроса к конфигу предоставляется менеджером.  
Для этого требуется предоставить:

- бандл приложения (com.example.app)
- Apple id (для iOS приложений)
- название приложения, как оно будет указано в целевом сторе

> ⚠️
>
> Пример https://example.com/config.php

### Запрос

В тело запроса включены данные конверсии AppsFlyer, токен и проект Firebase и некоторые данные об устройстве пользователя.

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
	"af_id": "1688042316289-7152592750959506765", //следует добавить на стороне приложения 
	"bundle_id": "com.example.app", //следует добавить на стороне приложения
	"os": "Android", //следует добавить на стороне приложения
	"store_id": "com.example.app", //следует добавить на стороне приложения
	"locale": "En", //следует добавить на стороне приложения 
	"push_token": "dl28EJCAT4a7UNl86egX-U:APA91bEC1a5aGJL8ZyQHlm-B9togw60MLWP4_zU0ExSXLSa_HiL82Iurj0d-1zJmkMdUcvgCRXTrXtbWQHxmJh49BibLiqZVXPNyrCdZW-_ROTt98f0WCLtt531RYPhWSDOkykcaykE3",
	"firebase_project_id": "8934278530" //следует добавить на стороне приложения
}
'
```

### Ответ конфига

Успешный запрос:

```json
Status: 200 (OK)
{ 
	"ok": true, 
	"url": "http://link.com/",
	"expires": 1689002181 
}
```

> ⚠️
>
> По умолчанию (для тестов) ссылку можно получить только для неорганических установок, т.е. если поле `"af_status": "Non-organic"`

Запрос, завершенный ошибкой:

```json
404 (Not Found)
{ 
	"ok": false, 
	"message": "No data" 
}
```

> ⚠️
>
> Ошибка полученная при запросе к эндпоинту **является отрицательным ответом** для [принятия решения](/1afe1469e68a805bb627fc29467dea52?pvs=25) о запуске WebView.

|  | Тип | Описание |
|---|---|---|
| ok | Boolean | Статус запроса |
| message | String | Сообщение в случае неуспешного запроса |
| url | String | Актуальная ссылка для приложения |
| expires | Timestamp | Дата окончания срока действия ссылки, после которой следует получить новую ссылку путем выполнения нового запроса |

> ☝
>
> Тестирование системы уведомлений возможно, только если были переданы все поля дополняемые на стороне клиента.

### **Данные конверсии**

Данные конверсии доступны после инициализации Appsflyer в колбеке, соответствующем платформе разработки.

Подробнее о получении данных конверсии написано в документации Appsflyer:

[https://dev.appsflyer.com/hc/docs/conversion-data-android](https://dev.appsflyer.com/hc/docs/conversion-data-android)

[https://dev.appsflyer.com/hc/docs/conversion-data-ios](https://dev.appsflyer.com/hc/docs/conversion-data-ios)

[https://dev.appsflyer.com/hc/docs/conversion-data-unity](https://dev.appsflyer.com/hc/docs/conversion-data-unity)

Для запроса к конфигу **используются все параметры, доступные в данных конверсии**, в неизменённом виде. Список параметров, а также сами параметры и их значения не надо как-либо модифицировать.

> ❗ Ни в коем случае не следует изменять полученный список параметров данных конверсии.

> ℹ️ Количество параметров в теле запроса на отдельной установке может значительно отличаться от приведенного примера. Список параметров зависит от источника установки и дополнительных передаваемых данных.

### Параметры приложения

1. `af_id` cодержит значение Appsflyer ID, который генерируется автоматически при инициализации Appsflyer SDK и доступен как ответ метода getAppsFlyerUID или getAppsFlyerId в зависимости от платформы разработки.

   > ⚠️
   >
   > В редакторе Unity getAppsFlyerId будет возвращать пустую строку

1. `bundle_id` содержит значение Bundle ID (`com.example.app`) или Package Name приложения.
1. `os` содержит значение платформы приложения; допустимые значения: `Android`, `iOS`.
1. `store_id` содержит значение Store ID приложения. Для iOS приложений `store_id` указывается с ‘id’ в начале строки, например`id84435554334`. Для Android приложений `store_id` совпадает с `bundle_id`.
1. `locale` содержит значение основной локализации устройства пользователя. Значение должно иметь формат в стандарте **RFC 3066** – `ru`, `en`, `en_US`, либо значения `English`, `French`, `Spanish`, `Italian` и т. д.

### Данные Firebase Messaging

> ⚠️
>
> Если Firebase Messaging не может быть инициализирован поля ниже пропускаются. Запрос отправляется без них.

1. `push_token`содержит значение текущего токена регистрации Firebase Messaging. [Подробнее о настройке Firebase Messaging и получении токена](https://firebase.google.com/docs/cloud-messaging).

   > ☝
   >
   > При обновлении токена необходимо сразу же передать его в новом запросе.

1. `firebase_project_id` содержит значение Firebase `Project number` или `Project ID`.

### Данные deep linking AppsFlyer (UDL)

В случае если удалось получить данные deep linking от AppsFlyer необходимо включить их в параметры запроса.

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

> 💡
>
> Некоторых полей в теле deep link данных может не быть.
>
> Так же некоторые поля совпадают по ключу с параметрами конверсии. В случае совпадения используются первые полученные данные.

*Подробнее про deep linking:*

[Android Unified Deep Linking](https://dev.appsflyer.com/hc/docs/dl_android_unified_deep_linking)

[iOS Unified Deep Linking](https://dev.appsflyer.com/hc/docs/dl_ios_unified_deep_linking)

[Unified Deep Linking (UDL)](https://dev.appsflyer.com/hc/docs/unifieddeeplink)

---

В случае успешного выполнения запроса, следует сохранить значения `url` и `expires` и запустить ссылку в вебвью без изменений.

При последующих запусках приложения необходимо сверять значение `expires` с текущим временем девайса. При истечении срока действия ссылки необходимо выполнить повторный запрос, получить и сохранить новые значения.

Если запрос выполнился с ошибкой (код ответа не равен 200), но ранее было получено значение `url`, сохраненное в текущий момент на устройстве, необходимо запустить в вебвью сохраненную ссылку.

### Поведение при неуспешном запросе

В случае неуспешного запроса, если ранее не было получено значение `url`, следует запустить игру и более не делать запросов к конфигу в рамках этой установки, если для этого приложения не была обговорена иная логика работы.
