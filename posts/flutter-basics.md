---
title: 'Flutter Basics: Building Cross-Platform Apps with Dart 3'
metaTitle: 'Flutter Basics: Building Cross-Platform Apps with Dart 3'
metaDesc: 'A practical guide to Flutter covering widgets, layouts, state management, navigation, and data fetching — using up-to-date 2026 Dart 3 syntax with Riverpod 2, GoRouter, and Material 3.'
socialImage: images/flutter.png
date: '2026-04-14'
published: true
tags:
  - Flutter
  - Dart
  - Mobile Development
  - iOS
  - Android
  - Cross-Platform
  - Material 3
  - Riverpod
  - Beginner-Friendly
---

### Intro: What Is Flutter?

Flutter is Google's open-source UI toolkit for building natively compiled apps for mobile, web, and desktop from a single Dart codebase. Unlike React Native, Flutter does not use native platform widgets — it draws every pixel itself using its own rendering engine (Impeller as of 2026), giving you pixel-perfect consistency across iOS and Android.

As of 2026, Flutter 3.27+ ships with **Dart 3**, **Material 3 on by default**, and **Impeller** as the default renderer on both platforms.

---

### Step 1: Setting Up a New Project

Install the Flutter SDK, then create a new project:

```bash
flutter create my_app --platforms=ios,android
cd my_app
flutter run
```

Your `pubspec.yaml` key dependencies:

```yaml
environment:
  sdk: ">=3.6.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.6.1
  riverpod_annotation: ^2.6.1
  go_router: ^14.0.0
  dio: ^5.7.0
  freezed_annotation: ^2.4.0
  json_annotation: ^4.9.0

dev_dependencies:
  build_runner: ^2.4.0
  freezed: ^2.5.0
  json_serializable: ^6.8.0
  riverpod_generator: ^2.6.1
```

Enable Material 3 in your app theme (it is the default, but shown here explicitly):

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Tech Blog',
      routerConfig: appRouter,
      theme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      themeMode: ThemeMode.system,
    );
  }
}
```

---

### Step 2: Widgets — The Building Blocks

Everything in Flutter is a widget. Widgets are immutable descriptions of part of the UI — Flutter rebuilds the widget tree efficiently whenever state changes.

#### `StatelessWidget` — no mutable state

```dart
import 'package:flutter/material.dart';

class GreetingCard extends StatelessWidget {
  const GreetingCard({super.key, required this.name});

  final String name;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Hello, $name!', style: theme.textTheme.headlineSmall),
            const SizedBox(height: 4),
            Text('Welcome back.', style: theme.textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }
}
```

#### `StatefulWidget` — owns mutable state

```dart
class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          '$_count',
          style: Theme.of(context).textTheme.displayLarge,
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            OutlinedButton(
              onPressed: () => setState(() => _count--),
              child: const Text('−'),
            ),
            const SizedBox(width: 16),
            FilledButton(
              onPressed: () => setState(() => _count++),
              child: const Text('+'),
            ),
          ],
        ),
        TextButton(
          onPressed: () => setState(() => _count = 0),
          child: const Text('Reset'),
        ),
      ],
    );
  }
}
```

---

### Step 3: Layouts — Column, Row, and Stack

Flutter's layout widgets mirror what you'd expect from Jetpack Compose or SwiftUI.

#### Column and Row

```dart
class ProfileHeader extends StatelessWidget {
  const ProfileHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const CircleAvatar(radius: 32, backgroundImage: NetworkImage('https://picsum.photos/64')),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Jane Doe', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 4),
              Text('Flutter Developer', style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
        IconButton(
          icon: const Icon(Icons.more_vert),
          onPressed: () {},
        ),
      ],
    );
  }
}
```

#### Stack — overlapping widgets

```dart
class BadgedAvatar extends StatelessWidget {
  const BadgedAvatar({super.key, required this.badgeCount});

  final int badgeCount;

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        const CircleAvatar(radius: 28, backgroundImage: NetworkImage('https://picsum.photos/56')),
        if (badgeCount > 0)
          Positioned(
            top: -4,
            right: -4,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
              child: Text('$badgeCount', style: const TextStyle(color: Colors.white, fontSize: 10)),
            ),
          ),
      ],
    );
  }
}
```

#### `Expanded` and `Flexible`

```dart
Row(
  children: [
    // Takes up 2/3 of available width
    Expanded(flex: 2, child: TextField(decoration: InputDecoration(hintText: 'Search…'))),
    const SizedBox(width: 8),
    // Takes up 1/3
    Expanded(child: FilledButton(onPressed: () {}, child: const Text('Go'))),
  ],
)
```

---

### Step 4: Decoration and Styling

Use `Container` with a `BoxDecoration` for custom backgrounds, borders, and shadows.

```dart
class StyledCard extends StatelessWidget {
  const StyledCard({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Text(label, style: Theme.of(context).textTheme.titleMedium),
    );
  }
}
```

> **Dart 3.6 note:** Use `.withValues(alpha:)` instead of the deprecated `.withOpacity()` for color alpha adjustments.

---

### Step 5: State Management with Riverpod 2

Riverpod is the recommended state management solution for Flutter in 2026. Use the code-generator approach with `@riverpod` annotations.

#### Simple state provider

```dart
// lib/providers/counter_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'counter_provider.g.dart';

@riverpod
class CounterNotifier extends _$CounterNotifier {
  @override
  int build() => 0;

  void increment() => state++;
  void decrement() => state--;
  void reset() => state = 0;
}
```

Run the generator once (or in watch mode during development):

```bash
dart run build_runner watch
```

#### Consuming the provider

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Extend ConsumerWidget instead of StatelessWidget
class CounterScreen extends ConsumerWidget {
  const CounterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterNotifierProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('$count', style: Theme.of(context).textTheme.displayLarge),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                OutlinedButton(
                  onPressed: () => ref.read(counterNotifierProvider.notifier).decrement(),
                  child: const Text('−'),
                ),
                const SizedBox(width: 16),
                FilledButton(
                  onPressed: () => ref.read(counterNotifierProvider.notifier).increment(),
                  child: const Text('+'),
                ),
              ],
            ),
            TextButton(
              onPressed: () => ref.read(counterNotifierProvider.notifier).reset(),
              child: const Text('Reset'),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

### Step 6: Data Models with Freezed

Use `freezed` for immutable, copyable data classes with generated `==`, `hashCode`, and `copyWith`.

```dart
// lib/models/post.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'post.freezed.dart';
part 'post.g.dart';

@freezed
class Post with _$Post {
  const factory Post({
    required int id,
    required int userId,
    required String title,
    required String body,
  }) = _Post;

  factory Post.fromJson(Map<String, dynamic> json) => _$PostFromJson(json);
}
```

---

### Step 7: Async Data Fetching with Riverpod

Riverpod's `AsyncNotifier` handles loading, error, and data states automatically.

```dart
// lib/providers/posts_provider.dart
import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/post.dart';

part 'posts_provider.g.dart';

final _dio = Dio(BaseOptions(baseUrl: 'https://jsonplaceholder.typicode.com'));

@riverpod
Future<List<Post>> posts(Ref ref) async {
  final response = await _dio.get<List>('/posts');
  return response.data!.map((e) => Post.fromJson(e as Map<String, dynamic>)).toList();
}
```

Consume the async provider — `AsyncValue` handles all three states:

```dart
class PostListScreen extends ConsumerWidget {
  const PostListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsAsync = ref.watch(postsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Posts')),
      body: postsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
        data: (posts) => ListView.builder(
          itemCount: posts.length,
          itemBuilder: (context, index) => PostTile(post: posts[index]),
        ),
      ),
    );
  }
}
```

---

### Step 8: Lists with `ListView.builder`

```dart
class PostTile extends StatelessWidget {
  const PostTile({super.key, required this.post});

  final Post post;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          post.title,
          style: Theme.of(context).textTheme.titleSmall,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            post.body,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {/* navigate */},
      ),
    );
  }
}
```

For grids, use `GridView.builder`:

```dart
GridView.builder(
  padding: const EdgeInsets.all(16),
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    crossAxisSpacing: 12,
    mainAxisSpacing: 12,
    childAspectRatio: 3 / 4,
  ),
  itemCount: posts.length,
  itemBuilder: (context, index) => PostCard(post: posts[index]),
)
```

---

### Step 9: Navigation with GoRouter

GoRouter is Flutter's officially recommended router, supporting deep links, redirects, and typed routes.

```dart
// lib/router.dart
import 'package:go_router/go_router.dart';
import 'screens/home_screen.dart';
import 'screens/post_detail_screen.dart';
import 'screens/settings_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
      routes: [
        GoRoute(
          path: 'posts/:id',
          builder: (context, state) {
            final id = int.parse(state.pathParameters['id']!);
            return PostDetailScreen(postId: id);
          },
        ),
      ],
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),
  ],
);
```

Navigate from anywhere:

```dart
// Push a new route
context.push('/posts/42');

// Replace current route
context.go('/settings');

// Go back
context.pop();
```

Pass the router to `MaterialApp.router`:

```dart
MaterialApp.router(
  routerConfig: appRouter,
  // ...
)
```

---

### Step 10: Dart 3 Features Worth Knowing

Dart 3 introduced several powerful language features that appear throughout modern Flutter codebases.

#### Records

```dart
// Return multiple values without a class
(String, int) getUserInfo() => ('Jane', 28);

final (name, age) = getUserInfo();
print('$name is $age'); // Jane is 28
```

#### Pattern Matching and Switch Expressions

```dart
sealed class NetworkState {}
class Loading extends NetworkState {}
class Success<T> extends NetworkState { final T data; Success(this.data); }
class Failure extends NetworkState { final String message; Failure(this.message); }

Widget buildFromState(NetworkState state) => switch (state) {
  Loading()        => const CircularProgressIndicator(),
  Success(:final data) => Text('$data'),
  Failure(:final message) => Text('Error: $message', style: const TextStyle(color: Colors.red)),
};
```

#### Null-aware and collection operators

```dart
final List<String> tags = ['flutter', 'dart', null, 'mobile']
    .whereType<String>()           // filter out nulls
    .map((t) => t.toUpperCase())
    .toList();

final merged = [...listA, ...?maybeListB]; // spread with null check
```

---

### Quick Reference

| Concept | API |
|---|---|
| No-state widget | `class Foo extends StatelessWidget` |
| Local mutable state | `class Foo extends StatefulWidget` + `setState()` |
| Shared state | `@riverpod` + `ConsumerWidget` + `ref.watch()` |
| Async data | `@riverpod Future<T>` + `.when(loading, error, data)` |
| Vertical layout | `Column(children: [...])` |
| Horizontal layout | `Row(children: [...])` |
| Overlapping layers | `Stack(children: [...])` |
| Fill remaining space | `Expanded(child: ...)` |
| Scrollable list | `ListView.builder(itemBuilder: ...)` |
| Grid | `GridView.builder(gridDelegate: ...)` |
| Navigation setup | `GoRouter(routes: [...])` |
| Push route | `context.push('/path')` |
| Replace route | `context.go('/path')` |
| Decoration / borders | `Container(decoration: BoxDecoration(...))` |
| Multiple return values | Dart 3 records: `(String, int)` |
| Exhaustive branching | `switch (sealedClass) { case ...: }` |
