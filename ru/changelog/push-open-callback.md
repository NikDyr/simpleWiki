---
title: "Требуется отправлять колбэк при открытии уведомления"
ref: "changelog/push-open-callback"
parent: "changelog"
date: 2026-09-29 16:07:00 +0300
---

При открытии приложения по клику на уведомление необходимо отправлять `PUT`-запрос на эндпоинт `interaction.php` с `message_id` уведомления и `af_id`.

Подробнее: [Настройка и работа с уведомлениями]({{ '/ru/notifications/' | relative_url }})
