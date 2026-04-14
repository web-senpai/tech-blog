---
title: 'Firebase Push Notifications, Analytics & Crashlytics in Jetpack Compose'
metaTitle: 'Firebase FCM, Analytics & Crashlytics in Jetpack Compose'
metaDesc: 'Learn what Firebase Cloud Messaging, Analytics, and Crashlytics are, why you need them, and how to wire all three into a Jetpack Compose Android app using up-to-date 2026 Kotlin syntax.'
socialImage: images/firebase.png
date: '2026-04-14'
published: true
tags:
  - Firebase
  - Android
  - Jetpack Compose
  - Kotlin
  - Push Notifications
  - FCM
  - Analytics
  - Crashlytics
  - Mobile Development
---

### Intro: Why Firebase?

Firebase is Google's mobile Backend-as-a-Service (BaaS) platform. Rather than building your own infrastructure for common app needs — sending push notifications, tracking user behaviour, or catching crashes — Firebase gives you production-ready services you can wire up in an afternoon.

This guide covers the three services every production Android app should have:

| Service | Purpose |
|---|---|
| **Firebase Cloud Messaging (FCM)** | Send push notifications to users |
| **Firebase Analytics** | Understand how users interact with your app |
| **Firebase Crashlytics** | Detect, prioritise, and fix crashes in real time |

---

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com) and click **Add project**.
2. Give your project a name and follow the setup wizard.
3. Once created, click **Add app** → choose **Android**.
4. Enter your app's **package name** (e.g. `com.example.myapp`). It must match the `applicationId` in your `build.gradle.kts`.
5. Download the generated `google-services.json` file and place it in your app's **`app/`** directory.

---

### Step 2: Configure Gradle

#### Project-level `build.gradle.kts`

```kotlin
plugins {
    alias(libs.plugins.google.services) apply false
    alias(libs.plugins.firebase.crashlytics) apply false
}
```

#### `libs.versions.toml` (version catalog)

```toml
[versions]
firebaseBom = "33.12.0"
googleServices = "4.4.2"
firebaseCrashlytics = "3.0.3"

[plugins]
google-services = { id = "com.google.gms.google-services", version.ref = "googleServices" }
firebase-crashlytics = { id = "com.google.firebase.crashlytics", version.ref = "firebaseCrashlytics" }
```

#### App-level `build.gradle.kts`

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.google.services)        // processes google-services.json
    alias(libs.plugins.firebase.crashlytics)   // enables crash reporting uploads
}

dependencies {
    // Firebase BOM — pins all Firebase library versions together
    val firebaseBom = platform("com.google.firebase:firebase-bom:33.12.0")
    implementation(firebaseBom)

    implementation("com.google.firebase:firebase-messaging-ktx")
    implementation("com.google.firebase:firebase-analytics-ktx")
    implementation("com.google.firebase:firebase-crashlytics-ktx")
}
```

> The **BOM** (Bill of Materials) ensures all Firebase libraries are version-compatible. You never need to specify individual version numbers when the BOM is declared.

---

## Part 1 — Firebase Cloud Messaging (FCM)

### What Is FCM?

Firebase Cloud Messaging is a free, cross-platform messaging service that lets your server (or the Firebase Console) send push notifications and data messages to Android, iOS, and web clients.

**Why you need it:**
- Re-engage users with personalised alerts (new message, sale, reminder)
- Deliver silent data payloads to trigger background syncs
- Send topic-based broadcasts (e.g. all users subscribed to "breaking-news")
- Target a specific device, user segment, or your entire user base

### How FCM Works

```
Your server / Firebase Console
        │
        ▼  (HTTPS API call with device token)
  FCM Servers (Google)
        │
        ▼  (persistent connection)
  Android Device
        │
        ▼
  Your app receives the message
```

Each device gets a unique **FCM registration token**. You save this token on your server to send targeted notifications, or subscribe the device to topics for group messaging.

### Step 3: Create a Notification Channel

Android 8+ requires notification channels. Create them at app startup.

```kotlin
// NotificationChannels.kt
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context

object NotificationChannels {
    const val GENERAL = "general"
    const val PROMOTIONS = "promotions"
    const val ALERTS = "alerts"

    fun createAll(context: Context) {
        val manager = context.getSystemService(NotificationManager::class.java)
        listOf(
            NotificationChannel(GENERAL, "General", NotificationManager.IMPORTANCE_DEFAULT)
                .apply { description = "General app notifications" },
            NotificationChannel(PROMOTIONS, "Promotions", NotificationManager.IMPORTANCE_LOW)
                .apply { description = "Offers and promotions" },
            NotificationChannel(ALERTS, "Alerts", NotificationManager.IMPORTANCE_HIGH)
                .apply { description = "Time-sensitive alerts" },
        ).forEach(manager::createNotificationChannel)
    }
}
```

Call this in your `Application` class:

```kotlin
// MyApp.kt
import android.app.Application

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        NotificationChannels.createAll(this)
    }
}
```

Register it in `AndroidManifest.xml`:

```xml
<application
    android:name=".MyApp"
    ...>
```

### Step 4: Create a Firebase Messaging Service

```kotlin
// MyFirebaseMessagingService.kt
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    // Called when a new FCM token is generated (first launch or token refresh)
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // TODO: send this token to your backend server so you can
        // target this device for push notifications
        sendTokenToServer(token)
    }

    // Called when a message is received while the app is in the FOREGROUND
    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)

        // Data payload (always delivered, app must build the notification)
        val title = message.data["title"] ?: message.notification?.title ?: return
        val body  = message.data["body"]  ?: message.notification?.body  ?: return

        showNotification(title, body)
    }

    private fun showNotification(title: String, body: String) {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val notification = NotificationCompat.Builder(this, NotificationChannels.GENERAL)
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.drawable.ic_notification)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        getSystemService(NotificationManager::class.java)
            .notify(System.currentTimeMillis().toInt(), notification)
    }

    private fun sendTokenToServer(token: String) {
        // Make an API call to your backend with the token
    }
}
```

Register the service in `AndroidManifest.xml`:

```xml
<service
    android:name=".MyFirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>

<!-- Default notification channel for system-delivered notifications -->
<meta-data
    android:name="com.google.firebase.messaging.default_notification_channel_id"
    android:value="general" />
```

### Step 5: Request Notification Permission and Get the Token

Android 13+ requires you to request `POST_NOTIFICATIONS` at runtime. Do this from your Compose UI.

```kotlin
// NotificationPermission.kt
import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.*
import androidx.compose.material3.*
import com.google.firebase.messaging.ktx.messaging
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.tasks.await

@Composable
fun RequestNotificationPermission() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return

    var showRationale by remember { mutableStateOf(false) }

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (!granted) showRationale = true
    }

    LaunchedEffect(Unit) {
        launcher.launch(Manifest.permission.POST_NOTIFICATIONS)
    }

    if (showRationale) {
        AlertDialog(
            onDismissRequest = { showRationale = false },
            title = { Text("Notifications Disabled") },
            text = { Text("Enable notifications in Settings to receive important updates.") },
            confirmButton = { TextButton(onClick = { showRationale = false }) { Text("OK") } }
        )
    }
}

// Get the current FCM token (call once after permission is granted)
suspend fun getFcmToken(): String? = runCatching {
    Firebase.messaging.token.await()
}.getOrNull()
```

### Step 6: Subscribe to Topics

Topics let you broadcast to groups of users without managing individual tokens.

```kotlin
import com.google.firebase.messaging.ktx.messaging
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.tasks.await

suspend fun subscribeToTopic(topic: String) {
    Firebase.messaging.subscribeToTopic(topic).await()
}

suspend fun unsubscribeFromTopic(topic: String) {
    Firebase.messaging.unsubscribeFromTopic(topic).await()
}

// Example — subscribe to "breaking-news" when user toggles a preference
LaunchedEffect(newsEnabled) {
    if (newsEnabled) subscribeToTopic("breaking-news")
    else unsubscribeFromTopic("breaking-news")
}
```

---

## Part 2 — Firebase Analytics

### What Is Firebase Analytics?

Firebase Analytics (Google Analytics for Firebase) is a free, unlimited event tracking service. It automatically logs over 30 standard events (app opens, screen views, first opens, in-app purchases) and lets you log custom events for anything your app-specific.

**Why you need it:**
- See which screens users visit and how long they stay
- Track conversions — sign-ups, purchases, feature activations
- Build user segments (audiences) to target with FCM or Remote Config
- Understand the user journey that leads to churn or retention
- All data feeds into the Firebase Console and Google Analytics dashboards

### Step 7: Automatic Screen Tracking in Compose

Analytics logs screen views automatically for Activities, but in a single-Activity Compose app you need to log them manually when the current route changes.

```kotlin
// AnalyticsExtensions.kt
import androidx.compose.runtime.*
import androidx.navigation.NavController
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.analytics.ktx.logEvent
import com.google.firebase.ktx.Firebase

@Composable
fun TrackScreenViews(navController: NavController) {
    val analytics = remember { Firebase.analytics }

    DisposableEffect(navController) {
        val listener = NavController.OnDestinationChangedListener { _, destination, _ ->
            analytics.logEvent(FirebaseAnalytics.Event.SCREEN_VIEW) {
                param(FirebaseAnalytics.Param.SCREEN_NAME, destination.route ?: "unknown")
                param(FirebaseAnalytics.Param.SCREEN_CLASS, destination.route ?: "unknown")
            }
        }
        navController.addOnDestinationChangedListener(listener)
        onDispose { navController.removeOnDestinationChangedListener(listener) }
    }
}
```

Call it once at the root of your navigation:

```kotlin
@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    // Automatically tracks every screen transition
    TrackScreenViews(navController = navController)

    NavHost(navController = navController, startDestination = HomeRoute) {
        composable<HomeRoute> { HomeScreen() }
        composable<DetailRoute> { DetailScreen() }
    }
}
```

### Step 8: Log Custom Events

```kotlin
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.analytics.ktx.logEvent
import com.google.firebase.ktx.Firebase

object Analytics {
    private val analytics get() = Firebase.analytics

    // Log when a user views a post
    fun logPostViewed(postId: Int, postTitle: String) {
        analytics.logEvent("post_viewed") {
            param("post_id", postId.toLong())
            param("post_title", postTitle)
        }
    }

    // Log a sign-up conversion
    fun logSignUp(method: String) {
        analytics.logEvent(FirebaseAnalytics.Event.SIGN_UP) {
            param(FirebaseAnalytics.Param.METHOD, method)
        }
    }

    // Log a share action
    fun logShare(contentType: String, itemId: String) {
        analytics.logEvent(FirebaseAnalytics.Event.SHARE) {
            param(FirebaseAnalytics.Param.CONTENT_TYPE, contentType)
            param(FirebaseAnalytics.Param.ITEM_ID, itemId)
        }
    }

    // Set persistent user properties (segmentation)
    fun setUserPlan(plan: String) {
        analytics.setUserProperty("subscription_plan", plan)
    }

    fun setUserId(userId: String) {
        analytics.setUserId(userId)
    }
}
```

Use it directly in your Compose event handlers:

```kotlin
FilledButton(
    onClick = {
        Analytics.logPostViewed(post.id, post.title)
        navController.navigate(DetailRoute(post.id))
    }
) {
    Text("Read Post")
}
```

---

## Part 3 — Firebase Crashlytics

### What Is Crashlytics?

Firebase Crashlytics is a real-time crash reporting service. Every unhandled exception and ANR (Application Not Responding) event in your app is captured, grouped by root cause, and surfaced in the Firebase Console — with the full stack trace, device info, and the breadcrumb trail of events that led to the crash.

**Why you need it:**
- Know about crashes before your users leave a 1-star review
- See exactly which line of code caused the crash
- Group crashes by issue so you can prioritise the most impactful ones
- Track whether a crash was introduced or fixed by a specific release
- Attach custom keys and log messages to give crashes more context

### Step 9: Automatic Crash Reporting

Once the dependency and Gradle plugin are added, **Crashlytics works automatically** — no extra code is needed to capture unhandled exceptions.

To verify it is working, you can force a test crash (remove this before shipping):

```kotlin
// Only for testing — remove before production release
Button(onClick = { throw RuntimeException("Test crash from Crashlytics") }) {
    Text("Force Crash")
}
```

Open the Firebase Console → Crashlytics. The crash will appear within a few minutes.

### Step 10: Enrich Crashes with Custom Context

The real power of Crashlytics is the context you attach to each crash report.

```kotlin
// CrashlyticsUtils.kt
import com.google.firebase.crashlytics.ktx.crashlytics
import com.google.firebase.ktx.Firebase

object CrashlyticsUtils {

    // Identify the logged-in user so you can reach out after a crash
    fun setUser(userId: String, email: String, plan: String) {
        Firebase.crashlytics.setUserId(userId)
        Firebase.crashlytics.setCustomKey("user_email", email)
        Firebase.crashlytics.setCustomKey("subscription_plan", plan)
    }

    // Leave breadcrumbs that appear in the crash report timeline
    fun log(message: String) {
        Firebase.crashlytics.log(message)
    }

    // Report a caught exception without crashing the app
    fun recordException(throwable: Throwable) {
        Firebase.crashlytics.recordException(throwable)
    }

    // Tag the active screen so you know where the crash happened
    fun setCurrentScreen(screen: String) {
        Firebase.crashlytics.setCustomKey("current_screen", screen)
    }
}
```

#### Log breadcrumbs through navigation

```kotlin
@Composable
fun TrackScreensForCrashlytics(navController: NavController) {
    DisposableEffect(navController) {
        val listener = NavController.OnDestinationChangedListener { _, destination, _ ->
            val route = destination.route ?: "unknown"
            CrashlyticsUtils.setCurrentScreen(route)
            CrashlyticsUtils.log("Navigated to: $route")
        }
        navController.addOnDestinationChangedListener(listener)
        onDispose { navController.removeOnDestinationChangedListener(listener) }
    }
}
```

#### Safely catch and report exceptions

```kotlin
// In a ViewModel
class PostViewModel : ViewModel() {
    private val _posts = MutableStateFlow<List<Post>>(emptyList())
    val posts = _posts.asStateFlow()

    fun loadPosts() {
        viewModelScope.launch {
            CrashlyticsUtils.log("Loading posts")
            runCatching {
                _posts.value = repository.fetchPosts()
            }.onFailure { error ->
                // Report to Crashlytics but don't crash the app
                CrashlyticsUtils.recordException(error)
                CrashlyticsUtils.log("Failed to load posts: ${error.message}")
            }
        }
    }
}
```

---

### Step 11: Putting It All Together

Here is how a real `MainActivity` and root composable wires all three services together.

```kotlin
// MainActivity.kt
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.ktx.Firebase

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyAppTheme {
                AppRoot()
            }
        }
    }
}
```

```kotlin
// AppRoot.kt
@Composable
fun AppRoot() {
    val navController = rememberNavController()

    // Wire up Analytics screen tracking
    TrackScreenViews(navController = navController)

    // Wire up Crashlytics screen tracking
    TrackScreensForCrashlytics(navController = navController)

    // Request notification permission on first launch
    RequestNotificationPermission()

    NavHost(navController = navController, startDestination = HomeRoute) {
        composable<HomeRoute> {
            HomeScreen(navController = navController)
        }
        composable<DetailRoute> { backStackEntry ->
            val route = backStackEntry.toRoute<DetailRoute>()
            DetailScreen(postId = route.postId)
        }
    }
}
```

---

### Step 12: Disabling Collection in Debug Builds

You don't want test data polluting your Analytics dashboards or Crashlytics issue list during development.

```kotlin
// MyApp.kt
import android.app.Application
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.crashlytics.ktx.crashlytics
import com.google.firebase.ktx.Firebase

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        NotificationChannels.createAll(this)

        val isDebug = BuildConfig.DEBUG
        Firebase.analytics.setAnalyticsCollectionEnabled(!isDebug)
        Firebase.crashlytics.setCrashlyticsCollectionEnabled(!isDebug)
    }
}
```

---

### Quick Reference

| Service | What it captures | Key API |
|---|---|---|
| **FCM** | Device token, incoming messages | `FirebaseMessagingService`, `onNewToken`, `onMessageReceived` |
| **FCM Topics** | Group subscriptions | `Firebase.messaging.subscribeToTopic()` |
| **Analytics** | Events, screen views, user properties | `Firebase.analytics.logEvent {}` |
| **Analytics — User** | Identity for segmentation | `analytics.setUserId()`, `analytics.setUserProperty()` |
| **Crashlytics** | Unhandled crashes, ANRs | Automatic — no code needed |
| **Crashlytics — Context** | Breadcrumbs and keys | `crashlytics.log()`, `crashlytics.setCustomKey()` |
| **Crashlytics — Non-fatal** | Caught exceptions | `crashlytics.recordException(throwable)` |
| **Debug guard** | Prevent test data in dashboards | `setAnalyticsCollectionEnabled(false)` |

### Common Pitfalls

- **`google-services.json` in the wrong folder** — it must be in `app/` not the project root.
- **Missing notification channel** — on Android 8+ notifications are silently dropped without a valid channel ID.
- **Not requesting `POST_NOTIFICATIONS`** — on Android 13+ users never see your notifications if you skip the runtime permission.
- **Sending tokens to your server** — FCM tokens rotate. Always call `onNewToken` to refresh the stored token, not just the first-launch token.
- **Debug data in Analytics** — always gate collection with `BuildConfig.DEBUG` so development sessions don't skew your reports.
