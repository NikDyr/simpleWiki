---
title: "App Requirements and Testing"
ref: "app-requirements"
nav_order: 5
---

> **Do not change the Firebase project without the manager's approval** — it will break push notifications.
{: .callout .danger}

---

1. **Tracking link**
   To test the app before release, open the tracking link right before the test install, after appending the `&advertising_id={GAID/IDFA}` parameter to it.  
   The GAID/IDFA of the test device must be added to the Test Devices list of the linked AppsFlyer account.

   ```
   https://app.appsflyer.com/com.example.app?pid=Test%20Source&c=testsub_testsub2_testsub_testsub_testsub_testsub_testsub_testsub1%20%23extra&siteid=test&adset=testsub&af_adset=testsub3&af_c_id=testsub4&agency=Test%20Agency&af_sub1=testextra2&af_sub2=testextra3&af_sub3=testextra4&af_sub4=testextra5&af_sub5=testextra6&is_retargeting=true
   ```

1. **Testing deep linking parameters**  
   To test that deep linking parameters are passed, create a [OneLink](https://support.appsflyer.com/hc/en-us/articles/115005248543-OneLink-guide) link, then do a [test install via that link](https://support.appsflyer.com/hc/en-us/articles/360001559405-Testing-the-SDK-integration-for-marketers).  
   The link must be created in the dedicated AppsFlyer account.
   - [Creating a new OneLink link]({{ '/en/onelink/' | relative_url }})
1. **Test offer**
   [https://web.team-s.club/](https://web.team-s.club)

   This resource is used to partially test the WebView and the app logic.

   Besides the scenarios described here and on the resource, check the overall user experience, including WebView smoothness, loading times, image quality, whether the app behaves as users expect, and so on.

1. **The app size must not exceed 100 MB**
1. **Store Privacy Policy requirements**  
   The app must provide access to the privacy policy (link/text) as required by the [App Store](https://developer.apple.com/app-store/review/guidelines/#5.1.1) and [Google Play](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en-GB).
1. **Minimum API requirements**  
   Minimum system API levels should be as low as the current store policy and the SDKs used allow.
   - Android target API level 35 / min API level 30
   - iOS 18
1. **Adaptive icon**  
   The image used as the app icon must fit the icon exactly, with no margins and no cropped content.
   <details markdown="1"><summary>More</summary>

   - [Google Play: icon design specifications](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
   - [Apple HIG: App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
   - [Adaptive icon tester](https://adaptive-icon-tester.nabettu.com/)

   </details>

1. **Loading screen**
   - The app's loading screen must reflect the app design and have an *animated* loading indicator.
   - *The loading screen must adapt to portrait and landscape orientation.*
   - The first and subsequent loads must not take long. On a normal internet connection, loading must not exceed 10 seconds.
1. **Notification permission request**  
   The app must show a custom screen offering notifications before launching the WebView.  
   *The custom prompt screen must adapt to portrait and landscape orientation.*  
   Agreeing must lead to the system notification permission prompt.  
   Declining on the custom screen postpones the next display of this screen by 3 days.  
   Declining in the system prompt makes it impossible to show that prompt again.
   All three scenarios must be tested:

   - agreeing to notifications on first launch
   - agreeing to notifications three days later
   - declining notifications completely

   > **Do not change the Firebase project without the manager's approval** — it will break push notifications.
   {: .callout .danger}

1. **WebView loading**  
   The WebView must load when certain conditions are met, as described in [User Flow]({{ '/en/user-flow/' | relative_url }}).  
   Test scenario for launching the WebView: `"af_status":"Non-organic"` in the conversion data. All described scenarios must be tested.
1. <span id="user-agent"></span>**User agent**
   <div class="variant" data-variant="basic" data-label="Basic user agent" markdown="1">

   - must not indicate that a WebView is used
   - must reflect up-to-date device information

   ```
   Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148
   ```

   </div>
   <div class="variant" data-variant="appended" data-label="Appended user agent" markdown="1">

   - must not indicate that a WebView is used
   - must reflect up-to-date device information
   - **is extended with the app ID and app name** at the end of the string: `appid/<app ID> appname/<app name>`

   ```
   Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 appid/6759667623 appname/ApplicationNaming
   ```

   </div>

1. **WebView size**  
   The WebView must be displayed within the Safe Area (the screen area where content is guaranteed not to be covered by bezels, the camera, etc.) in any screen orientation, and also after locking and unlocking the device.
1. **Screen rotation**  
   The app must let the user rotate the screen with standard system controls, or support auto-rotation based on device sensors. This includes the manual rotation button on Android.  
   If device orientation is recorded while rotation is locked (as on recent iOS versions), forced rotation does not need to be implemented.  
   *All loading screens and the WebView must adapt to the screen orientation.*
1. **Going back**  
   The WebView must support going back to the previous page using the buttons or gestures standard for the operating system.  
   The same action on the site's first page must not close the WebView.
1. **Multiple redirects**  
   The app must handle a large number of redirects without errors. If an `ERR_TOO_MANY_REDIRECTS` error occurs, the app **must continue** loading the page at the last address.
   <details markdown="1"><summary>Example solutions:</summary>

   ```swift
   func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
   let nsError = error as NSError
   if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorHTTPTooManyRedirects {
       if let url = lastRedirectURL {
           let request = URLRequest(url: url)
           webView.load(request)
       }
   }
   }
   ```

   ```c#
   mainWebView.OnLoadingErrorReceived += (webView, code, message, payload) =>
       {
           if (code is -1007 or -9 or 0 &&
               payload.Extra != null &&
               payload.Extra.TryGetValue(UniWebViewNativeResultPayload.ExtraFailingURLKey, out var value))
           {
               webView.Load((string)value);
           }
       };
   ```

   </details>

1. **The app must support JavaScript on websites**
1. **The app must support cookies on websites**
1. **The app must support sessions on websites**
1. **Inline autoplay video support**  
   The WebView must support autoplaying video on websites without expanding it to full screen and without requiring the user to start it manually.
1. **Automatic protected content permission**  
   The WebView must automatically grant access to **Protected Media ID** for requests on the page. (Enabled by default in most browsers.)
   <details markdown="1"><summary>UniWebView</summary>

   `uniWebView.RegisterOnRequestMediaCapturePermission(permission => UniWebViewMediaCapturePermissionDecision.Grant);`

   </details>

1. **Passing parameters**  
   The app must pass a number of parameters into the link, as described in [Config Request]({{ '/en/config-request/' | relative_url }}).
1. **File uploads**  
   The WebView must support uploading files to websites without requesting access to the device file system.  
   The test resource also checks uploading images using the camera and gallery.
1. **Opening the on-screen keyboard must not cover the active input field**
1. **The app must be set up to receive notifications**  
   Details: [Notifications Setup]({{ '/en/notifications/' | relative_url }})
   - The notification must contain an image and a custom icon (Android only)
   - Tapping the notification must launch the app and load the WebView with the link from the notification. This link is single-use; it must not be used on the next app launch.

   > **Do not change the Firebase project without the manager's approval** — it will break push notifications.
   {: .callout .danger}

1. **Following deep links (to another app)**  
   The app must handle deep links inside the WebView correctly.  
   If the WebView does not support deep links natively, intercept them and pass them to the system, for example with `new Intent` or `Application.OpenURL`. The user must also be returned to the previous page so they do not see an error when coming back to the app.
