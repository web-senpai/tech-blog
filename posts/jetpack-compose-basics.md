---
title: 'Jetpack Compose Basics: Building Modern Android UIs'
metaTitle: 'Jetpack Compose Basics: Building Modern Android UIs'
metaDesc: 'A practical guide to Jetpack Compose covering composables, state management, layouts, navigation, and Material 3 — using up-to-date Kotlin and Compose syntax.'
socialImage: images/jetpack_compose.png
date: '2026-04-14'
published: true
tags:
  - Android
  - Jetpack Compose
  - Kotlin
  - Mobile Development
  - Material 3
  - UI
  - Beginner-Friendly
---

### Intro: What Is Jetpack Compose?

Jetpack Compose is Android's modern declarative UI toolkit. Instead of building layouts with XML, you describe your UI in Kotlin using composable functions. The framework handles re-rendering whenever your state changes — no more `findViewById`, `ViewBinding`, or manual view updates.

As of 2026, Compose is the default recommended UI toolkit for all new Android projects, with full Material 3 (Material You) support baked in.

---

### Step 1: Setting Up a New Project

Create a new Android project in Android Studio Meerkat (or later) and choose the **Empty Activity** template — it scaffolds a Compose-ready project automatically.

Your `build.gradle.kts` (app level) will look similar to:

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler) // Compose compiler plugin (separate since Kotlin 2.0)
}

android {
    compileSdk = 35

    defaultConfig {
        minSdk = 24
        targetSdk = 35
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2025.04.00")
    implementation(composeBom)

    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.10.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.9.0")
    implementation("androidx.navigation:navigation-compose:2.9.0")

    debugImplementation("androidx.compose.ui:ui-tooling")
}
```

> **Note:** Since Kotlin 2.0, the Compose compiler ships as a separate Gradle plugin (`libs.plugins.compose.compiler`) instead of being bundled in the Kotlin compiler extension. Always keep the BOM version pinned for consistent dependency resolution.

---

### Step 2: Your First Composable

A composable is just a Kotlin function annotated with `@Composable`. Think of it like a component in React.

```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview

@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Greeting(name = "Compose")
}
```

Composables are ordinary functions — they can accept parameters, call other composables, and be previewed directly in Android Studio without running a device.

---

### Step 3: Layouts — Column, Row, and Box

Compose provides three core layout composables to position children on screen.

#### Column — vertical stack

```kotlin
@Composable
fun ProfileCard() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(text = "Jane Doe", style = MaterialTheme.typography.headlineSmall)
        Text(text = "Android Developer", style = MaterialTheme.typography.bodyMedium)
    }
}
```

#### Row — horizontal stack

```kotlin
@Composable
fun IconWithLabel(icon: ImageVector, label: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Icon(imageVector = icon, contentDescription = label)
        Text(text = label)
    }
}
```

#### Box — overlapping layers

```kotlin
@Composable
fun BadgedAvatar(badgeCount: Int) {
    Box(contentAlignment = Alignment.TopEnd) {
        Image(
            painter = painterResource(id = R.drawable.avatar),
            contentDescription = "User avatar",
            modifier = Modifier.size(56.dp).clip(CircleShape)
        )
        if (badgeCount > 0) {
            Badge { Text(text = badgeCount.toString()) }
        }
    }
}
```

---

### Step 4: Modifiers

Modifiers let you decorate or configure any composable — size, padding, background, click handling, and more. They chain like a builder pattern and order matters.

```kotlin
@Composable
fun StyledCard() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp)
            .padding(horizontal = 16.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .clickable { /* handle click */ }
            .padding(16.dp),         // inner padding applied after background
        contentAlignment = Alignment.CenterStart
    ) {
        Text(text = "Tap me", style = MaterialTheme.typography.titleMedium)
    }
}
```

---

### Step 5: State Management with `remember` and `mutableStateOf`

Compose re-composes (re-renders) a composable automatically when its state changes. Use `remember` to survive recompositions, and `mutableStateOf` to make a value observable.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.displaySmall
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

For state that needs to survive configuration changes (device rotation), hoist it into a `ViewModel`.

---

### Step 6: ViewModel + StateFlow Integration

```kotlin
// CounterViewModel.kt
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class CounterViewModel : ViewModel() {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count.asStateFlow()

    fun increment() { _count.value++ }
    fun decrement() { _count.value-- }
    fun reset() { _count.value = 0 }
}
```

```kotlin
// CounterScreen.kt
import androidx.compose.runtime.collectAsState
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun CounterScreen(vm: CounterViewModel = viewModel()) {
    val count by vm.count.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "$count", style = MaterialTheme.typography.displayLarge)
        Spacer(modifier = Modifier.height(24.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedButton(onClick = vm::decrement) { Text("-") }
            Button(onClick = vm::increment) { Text("+") }
        }
        TextButton(onClick = vm::reset) { Text("Reset") }
    }
}
```

---

### Step 7: Lists with LazyColumn

For long or dynamic lists use `LazyColumn` (equivalent to `RecyclerView`). It only composes items currently visible on screen.

```kotlin
data class Post(val id: Int, val title: String, val snippet: String)

@Composable
fun PostList(posts: List<Post>, onPostClick: (Post) -> Unit) {
    LazyColumn(
        contentPadding = PaddingValues(vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(posts, key = { it.id }) { post ->
            PostCard(post = post, onClick = { onPostClick(post) })
        }
    }
}

@Composable
fun PostCard(post: Post, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = post.title, style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = post.snippet,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}
```

---

### Step 8: Navigation with Navigation Compose

```kotlin
// AppNavigation.kt
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import kotlinx.serialization.Serializable

// Type-safe routes (Navigation 2.9+ with kotlinx.serialization)
@Serializable object HomeRoute
@Serializable data class DetailRoute(val postId: Int)

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = HomeRoute) {
        composable<HomeRoute> {
            HomeScreen(onPostClick = { postId ->
                navController.navigate(DetailRoute(postId))
            })
        }
        composable<DetailRoute> { backStackEntry ->
            val route = backStackEntry.toRoute<DetailRoute>()
            DetailScreen(postId = route.postId)
        }
    }
}
```

> **2026 update:** Navigation Compose 2.9+ uses fully type-safe, serializable routes instead of string-based route definitions. Add `androidx.navigation:navigation-compose` and the `kotlinx-serialization-json` plugin to your project.

---

### Step 9: Material 3 Components

Compose ships with a full Material 3 component library out of the box.

```kotlin
@Composable
fun SampleForm() {
    var text by remember { mutableStateOf("") }
    var checked by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("Your name") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Switch(checked = checked, onCheckedChange = { checked = it })
            Text(text = if (checked) "Notifications on" else "Notifications off")
        }

        FilledTonalButton(
            onClick = { /* submit */ },
            modifier = Modifier.fillMaxWidth(),
            enabled = text.isNotBlank()
        ) {
            Text("Submit")
        }
    }
}
```

---

### Step 10: Side Effects with `LaunchedEffect`

Use `LaunchedEffect` when you need to run a coroutine scoped to a composable's lifecycle — fetching data when a screen loads, for example.

```kotlin
@Composable
fun PostDetailScreen(postId: Int, vm: PostViewModel = viewModel()) {
    val post by vm.post.collectAsState()

    LaunchedEffect(postId) {
        // Runs once when postId changes (or when first composed)
        vm.loadPost(postId)
    }

    when (val current = post) {
        null -> CircularProgressIndicator(modifier = Modifier.fillMaxSize().wrapContentSize())
        else -> Column(modifier = Modifier.padding(16.dp)) {
            Text(text = current.title, style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = current.body)
        }
    }
}
```

---

### Quick Reference

| Concept | API |
|---|---|
| Declare a composable | `@Composable fun MyUi() {}` |
| Local surviving state | `var x by remember { mutableStateOf(...) }` |
| Config-change safe state | `ViewModel` + `StateFlow` + `collectAsState()` |
| Vertical list | `LazyColumn { items(list) { ... } }` |
| Horizontal list | `LazyRow { items(list) { ... } }` |
| Spacing / size | `Modifier.padding()`, `.fillMaxWidth()`, `.size()` |
| Navigation | `NavHost` + type-safe `@Serializable` routes |
| Coroutine side effect | `LaunchedEffect(key) { ... }` |
| Material 3 theme | `MaterialTheme.colorScheme`, `MaterialTheme.typography` |
