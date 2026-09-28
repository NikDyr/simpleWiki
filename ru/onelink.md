---
title: "Создание новой OneLink ссылки"
ref: "onelink"
parent: "app-requirements"
---

1. Сперва необходимо создать новый OneLink template в выделенном под приложение AppsFlyer аккаунте.
   ![]({{ '/assets/img/d5f9504e05b0.png' | relative_url }})

1. Перейдите в раздел OneLink Management и нажмите Get started
   ![]({{ '/assets/img/c631c7e7bc3f.png' | relative_url }})

1. Выберите свое приложение из выпадающего списка, введите произвольный subdomain
   ![]({{ '/assets/img/d56bb145cb37.png' | relative_url }})

1. Затем остается создать новый шаблон
   ![]({{ '/assets/img/d623d36c5ae9.png' | relative_url }})

1. **Скопируйте полученную ссылку и внесите её в карточку приложения.**
1. Далее необходимо настроить параметры ссылки
   ![]({{ '/assets/img/cf0d3f8448f9.png' | relative_url }})

1. Включите Retargeting
   ![]({{ '/assets/img/cc0a2be784ee.png' | relative_url }})

1. В контекстном меню выбрать раздел Edit link
   ![]({{ '/assets/img/dad4b7210e80.png' | relative_url }})

1. Перейти в раздел Deep linking & redirection и заполнить поля deep link value и additional deep link value
   ![]({{ '/assets/img/f6a9c2d917ec.png' | relative_url }})

1. Если всё заполнено верно, в правой части отразятся введенные значения
   ![]({{ '/assets/img/c46a2f7ec3f7.png' | relative_url }})

1. После этого нажать Update link

> Для имитации неорганической установки OneLink ссылку требуется дополнить параметром `is_retargeting=true`
>
> В противном случае только самая первая установка будет отражена как неорганическая.
{: .callout .note}
