---
title: "Требования к приложениям"
ref: "index"
nav_order: 1
permalink: "/ru/"
layout: home
---

Требования и сценарии для разработки и проверки приложений: запуск WebView, запрос к конфигу, push-уведомления и интеграция AppsFlyer.
{: .lead}

> **Не менять проект Firebase без согласования с менеджером** — это сломает пуши.
{: .callout .danger}

<div class="cards">
  <a class="card" href="{{ '/ru/user-flow/' | relative_url }}"><span class="card-n">01</span><strong>Сценарий пользовательского взаимодействия</strong><span>Первый запуск, режимы WebView и «фантик», поведение без интернета</span></a>
  <a class="card" href="{{ '/ru/config-request/' | relative_url }}"><span class="card-n">02</span><strong>Запрос к конфигу</strong><span>Формат запроса, данные AppsFlyer и Firebase, ответ сервера</span></a>
  <a class="card" href="{{ '/ru/notifications/' | relative_url }}"><span class="card-n">03</span><strong>Настройка и работа с уведомлениями</strong><span>Экран запроса разрешения, FCM, иконка уведомлений</span></a>
  <a class="card" href="{{ '/ru/app-requirements/' | relative_url }}"><span class="card-n">04</span><strong>Требования к приложению и проверка работы</strong><span>Трекинговые ссылки, deep linking, чек-лист перед публикацией</span></a>
</div>

## Последние изменения

> Дополнение user agent данными приложения зависит от заказа — см. [п. 11 «User agent»]({{ '/ru/app-requirements/' | relative_url }}#user-agent).
{: .callout .info}

{% assign log = site.pages | where: "parent", "changelog" | where: "lang", page.lang %}
<ul class="changes">
{%- for p in log %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a></li>
{%- endfor %}
</ul>

[Все изменения →]({{ '/ru/changelog/' | relative_url }})
