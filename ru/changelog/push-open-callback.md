---
title: "Требуется отправлять колбэк при открытии уведомления"
ref: "changelog/push-open-callback"
parent: "changelog"
date: 2026-09-29 16:07:00 +0300
---

При открытии приложения по клику на уведомление необходимо отправлять `PUT`-запрос на эндпоинт `interaction.php` с идентификатором сообщения Firebase (`message_id`) и `af_id`. `message_id` — стандартный параметр Firebase, на каждой платформе он доступен под своим ключом (на Android — `google.message_id`, на iOS — `gcm.message_id`).

Подробнее: [Настройка и работа с уведомлениями]({{ '/ru/notifications/' | relative_url }})
