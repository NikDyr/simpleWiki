---
title: "Настройка и работа с уведомлениями"
ref: "notifications"
nav_order: 4
---
Уведомления в приложениях реализуются с помощью [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).

> **Не менять проект Firebase без согласования с менеджером** — это сломает пуши.
> {: .callout .danger}

---

Если согласно [сценарию пользовательского взаимодействия]({{ '/ru/user-flow/' | relative_url }}) запускается **WebView**, необходимо запросить у пользователя разрешение на отправку уведомлений. Для этого реализуется экран с предложением получать уведомления, который отображается перед системным запросом:

<figure class="figma-embed">
  <iframe src="https://embed.figma.com/design/amAQaFjDIzjYyL0W0l4KIh/Push?node-id=0-1&embed-host=share&theme=system" title="Экран запроса уведомлений" loading="lazy" allowfullscreen></iframe>
  <figcaption><span class="figma-logo" aria-hidden="true"></span>Экран запроса уведомлений · <a href="https://www.figma.com/design/amAQaFjDIzjYyL0W0l4KIh/Push?node-id=0-1&t=oar6I4PXQeTbu7HM-1">Открыть в Figma</a></figcaption>
</figure>

> Подготовленный для приложения дизайн может содержать уникальные изображения для данного экрана.
> Стиль изображений должен соответствовать тематике приложения.
> {: .callout .note}

**Экран запроса должен быть отображен если:**

- Разрешение ещё не получено и есть возможность его запросить
- Последний отказ был более 3 дней назад

**Кнопки:**

- **“Yes, I Want Bonuses!”** — запрашивает системное разрешение на уведомления с последующим переходом к WebView
- “Skip” — переход к WebView без запроса

> Отказ в системном запросе считается полным отказом: кастомный экран больше не показывается.
> {: .callout .note}

---

Для поддержки уведомлений в Android 13 и выше (API level 33+) необходимо запросить разрешение на отправку уведомлений, для этого надо добавить соответствующее разрешение в манифест и вызвать метод, запрашивающий разрешение.

- [Разрешение на уведомления во время выполнения (Android Developers)](https://developer.android.com/develop/ui/views/notifications/notification-permission)
- [ActivityCompat.requestPermissions — справочник API (Android Developers)](<https://developer.android.com/reference/androidx/core/app/ActivityCompat#requestPermissions(android.app.Activity,%20java.lang.String%5B%5D,%20int)>)

---

Для Android необходимо использовать отдельную иконку, которая будет отображаться в уведомлении:

<figure class="figma-embed">
  <iframe src="https://embed.figma.com/design/FeBnHuFUJBa2mv0t68d314/Notification-icon?node-id=0-1&embed-host=share&theme=system" title="Иконка уведомлений" loading="lazy" allowfullscreen></iframe>
  <figcaption><span class="figma-logo" aria-hidden="true"></span>Иконка уведомлений · <a href="https://www.figma.com/design/FeBnHuFUJBa2mv0t68d314/Notification-icon?node-id=0-1&p=f&t=BcfG1L34x3pB1FOI-0">Открыть в Figma</a></figcaption>
</figure>

![]({{ '/assets/img/c147e697f000.png' | relative_url }})

---

Уведомления должны поддерживать картинки

![]({{ '/assets/img/e12ca734f4f5.png' | relative_url }})

![]({{ '/assets/img/e50cb8365b40.png' | relative_url }})

![]({{ '/assets/img/c98e8a076a76.png' | relative_url }})

![]({{ '/assets/img/d653094629df.png' | relative_url }})

---

> **Интеграция с FCM**
>
> Для работы уведомлений **необходимо подключать сервисные аккаунты**`marla-export@marfa-290610.iam.gserviceaccount.com` и `iosandroidpushes@iosandroidpushes.iam.gserviceaccount.com` к проекту Firebase через Google Cloud Platform с ролью `Basic → Owner`. Для этого надо:
>
> - перейти в пункт `Users and permissions` в настройках проекта Firebase
> - нажать на ссылку `Advanced permission settings` внизу страницы, чтобы перейти в Google Cloud Platform к соответствующему проекту
> - нажать кнопку `+ Add` для добавления нового пользователя
> - добавить сервисный аккаунт `marla-export@marfa-290610.iam.gserviceaccount.com` и `iosandroidpushes@iosandroidpushes.iam.gserviceaccount.com` и указать уровень доступа `Owner` в категории `Basic`
> - сохранить изменения нажатием кнопки `Save`
>   {: .callout .info}

> При необходимости заменить Firebase проект сообщите об этом менеджеру.
> **Не менять проект Firebase без согласования с менеджером** — это сломает пуши.
> {: .callout .warn}

---

> Для работы системы уведомлений необходимо отправить данные через [запрос к конфигу]({{ '/ru/config-request/' | relative_url }})
> {: .callout .warn}

---

#### Поведение при получении уведомлений

1. Настраиваем получение уведомлений в приложении с помощью соответствующих платформе методов.
2. При открытии приложения по клику на уведомление необходимо проверить `data` в `payload` уведомления на наличие ключа `url`.

   <details markdown="1"><summary>Пример структуры <code>payload</code> уведомления</summary>

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
3. При наличии непустого `url` необходимо запустить в WebView ссылку указанную в данном параметре.
4. **Эту ссылку не следует сохранять**. При следующем запуске должна запуститься ссылка, полученная из [запроса к конфигу]({{ '/ru/config-request/' | relative_url }}).

#### Колбэк открытия уведомления

При открытии приложения по клику на уведомление необходимо отправить колбэк на эндпоинт `interaction.php`. Эндпоинт расположен на том же домене, что и [запрос к конфигу]({{ '/ru/config-request/' | relative_url }}): если конфиг доступен по адресу `https://example.com/config.php`, колбэк отправляется на `https://example.com/interaction.php`.

```json
curl --request PUT \
     --url 'https://example.com/interaction.php?message_id=0%3A1500415314455276%2531bd1c9631bd1c96' \
     --header 'content-type: application/json' \
     --data '{"af_id": "1688042316289-7152592750959506765"}'
```

| Параметр | Где передаётся    | Описание                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| message_id       | Query-параметр         | Идентификатор сообщения, который Firebase присваивает каждому уведомлению при отправке (см. ниже). Передаётся как есть,**в URL-кодировке** |
| af_id            | Тело запроса (JSON) | AppsFlyer ID, тот же, что передаётся в [запросе к конфигу]({{ '/ru/config-request/'                                                                                                                                  |

##### Где взять message_id

`message_id` — параметр Firebase. В приложении он доступен под разными ключами в зависимости от платформы:

| Платформа | Где взять при открытии уведомления                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Android            | `RemoteMessage.getMessageId()` в `onMessageReceived`                                                                           |
| iOS                | `userInfo["gcm.message_id"]` в `userNotificationCenter(_:didReceive:)`                                                         |
| Flutter            | `RemoteMessage.messageId` из `FirebaseMessaging.instance.getInitialMessage()` и `FirebaseMessaging.onMessageOpenedApp`     |
| Unity              | `FirebaseMessage.MessageId` в обработчике `FirebaseMessaging.MessageReceived` при `NotificationOpened == true` |

> Формат ID задаёт Firebase, например `0:1500415314455276%31bd1c9631bd1c96`. Он содержит символы `:` и `%`, поэтому в query-параметре значение обязательно кодируется (`encodeURIComponent`, `Uri.encode`, `addingPercentEncoding` и т. п.): `message_id=0%3A1500415314455276%2531bd1c9631bd1c96`. Без кодирования `%31` будет прочитано как `1` и ID исказится.
> {: .callout .warn}

Ответы эндпоинта с ошибкой:

| Код                   | Причина                                                         |
| ------------------------ | ---------------------------------------------------------------------- |
| 400 (Bad Request)        | `message_id` отсутствует, либо `af_id` пустой |
| 405 (Method Not Allowed) | Использован метод, отличный от`PUT`        |
