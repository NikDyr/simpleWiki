---
title: "Настройка и работа с уведомлениями"
ref: "notifications"
nav_order: 4
---

Уведомления в приложениях реализуются с помощью [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).

> **НЕ МЕНЯТЬ ПРОЕКТ FIREBASE БЕЗ СОГЛАСОВАНИЯ С МЕНЕДЖЕРОМ  - ЭТО СЛОМАЕТ ПУШИ**

---

Если согласно Сценарий пользовательского взаимодействия запускается **WebView**, необходимо запросить у пользователя разрешение на отправку уведомлений. Для этого реализуется экран с предложением получать уведомления, который отображается перед системным запросом:

[Макет в Figma](https://embed.figma.com/design/amAQaFjDIzjYyL0W0l4KIh/Push?node-id=0-1&t=oar6I4PXQeTbu7HM-1&embed-host=notion&footer=false&theme=system)

> 🎨 Подготовленный для приложения дизайн может содержать уникальные изображения для данного экрана.
> Стиль изображений должен соответствовать тематике приложения.

**Экран запроса должен быть отображен если:**

- Разрешение ещё не получено и есть возможность его запросить
- Последний отказ был более 3 дней назад
**Кнопки:**

- **“Yes, I Want Bonuses!”** — запрашивает системное разрешение на уведомления с последующим переходом к WebView
- “Skip” — переход к WebView без запроса

---

Для поддержки уведомлений в Android 13 и выше (API level 33+) необходимо запросить разрешение на отправку уведомлений, для этого надо добавить соответствующее разрешение в манифест и вызвать метод, запрашивающий разрешение.

[Notification runtime permission  |  Views  |  Android Developers](https://developer.android.com/develop/ui/views/notifications/notification-permission)

[ActivityCompat  |  API reference  |  Android Developers](https://developer.android.com/reference/androidx/core/app/ActivityCompat#requestPermissions(android.app.Activity,%20java.lang.String%5B%5D,%20int))

---

Для Android необходимо использовать отдельную иконку, которая будет отображаться в уведомлении:

[Макет в Figma](https://embed.figma.com/design/FeBnHuFUJBa2mv0t68d314/Notification-icon?node-id=0-1&p=f&t=BcfG1L34x3pB1FOI-0&embed-host=notion&footer=false&theme=system)

![]({{ '/assets/img/c147e697f000.png' | relative_url }})

---

Уведомления должны поддерживать картинки

![]({{ '/assets/img/e12ca734f4f5.png' | relative_url }})

![]({{ '/assets/img/e50cb8365b40.png' | relative_url }})

![]({{ '/assets/img/c98e8a076a76.png' | relative_url }})

![]({{ '/assets/img/d653094629df.png' | relative_url }})

---

> 🧩
>
>
> ### Интеграция с FCM
>
> **Для работы уведомлений** **необходимо подключать сервисный аккаунт**  
> `marla-export@marfa-290610.iam.gserviceaccount.com` и `iosandroidpushes@iosandroidpushes.iam.gserviceaccount.com` к проекту Firebase через Google Cloud Platform с ролью `Basic → Owner`. Для этого надо:
>
> - перейти в пункт `Users and permissions` в настройках проекта Firebase
> - нажать на ссылку `Advanced permission settings` внизу страницы, чтобы перейти в Google Cloud Platform к соответствующему проекту
> - нажать кнопку `+ Add` для добавления нового пользователя
> - добавить сервисный аккаунт `marla-export@marfa-290610.iam.gserviceaccount.com` и `iosandroidpushes@iosandroidpushes.iam.gserviceaccount.com` и указать уровень доступа `Owner` в категории `Basic`
> - Сохранить изменения, нажатием кнопки `Save`

> ⚠️
>
> При необходимости заменить Firebase проект сообщите об этом менеджеру.
>
> > **НЕ МЕНЯТЬ ПРОЕКТ FIREBASE БЕЗ СОГЛАСОВАНИЯ С МЕНЕДЖЕРОМ  - ЭТО СЛОМАЕТ ПУШИ**

---

> ⚠️
>
> Для работы системы уведомлений необходимо отправить данные через Запрос к конфигу

---

#### Поведение при получении уведомлений

1. Настраиваем получение уведомлений в приложении с помощью соответствующих платформе методов.
1. При открытии приложения по клику на уведомление необходимо проверить `data` в `payload` уведомления на наличие ключа `url`.
<details markdown="1"><summary>Пример структуры `payload` уведомления</summary>

   ```json
   {
   	"message":{
   		"token":"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
   		"notification":{
   			"title":"Great offer!",
   			"body":"play now"
   		},
   		"data" : {
   			"url" : "[https://example.com/](https://example.com/)"
   		}
   	}
   }
   ```

</details>

1. При наличии непустого `url` необходимо запустить в WebView ссылку указанную в данном параметре.
1. **Эту ссылку не следует сохранять**. При следующем запуске должна запуститься ссылка, полученная из Запрос к конфигу .
