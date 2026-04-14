---
title: 'SwiftUI Basics: Building Modern iOS Apps with Swift 6'
metaTitle: 'SwiftUI Basics: Building Modern iOS Apps with Swift 6'
metaDesc: 'A practical guide to SwiftUI covering views, layouts, state management, navigation, and async data loading — using up-to-date Swift 6 syntax including the @Observable macro and typed NavigationStack.'
socialImage: images/swift.png
date: '2026-04-14'
published: true
tags:
  - iOS
  - SwiftUI
  - Swift
  - Mobile Development
  - Apple
  - UI
  - Beginner-Friendly
---

### Intro: What Is SwiftUI?

SwiftUI is Apple's declarative UI framework for building apps across iOS, macOS, watchOS, and tvOS from a single codebase. Like Jetpack Compose on Android, you describe *what* the UI should look like for a given state and SwiftUI handles the rendering and updates.

As of 2026, SwiftUI is built on Swift 6 with strict concurrency enabled by default, and the `@Observable` macro has fully replaced the older `ObservableObject` / `@Published` pattern.

---

### Step 1: Creating a New Project

Open Xcode 16+ and create a new **iOS App** project. Make sure the interface is set to **SwiftUI** and the language to **Swift**. Swift 6 strict concurrency is on by default — embrace it rather than suppressing it.

Your project entry point will look like this:

```swift
// TechBlogApp.swift
import SwiftUI

@main
struct TechBlogApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

`@main` marks the app entry point. `WindowGroup` is the scene container for document-based or single-window apps.

---

### Step 2: Your First View

A SwiftUI view is any struct that conforms to the `View` protocol and provides a `body` property.

```swift
import SwiftUI

struct GreetingView: View {
    let name: String

    var body: some View {
        Text("Hello, \(name)!")
            .font(.title)
            .foregroundStyle(.primary)
    }
}

#Preview {
    GreetingView(name: "SwiftUI")
}
```

`#Preview` (introduced in Xcode 15) replaces `PreviewProvider` — it is cleaner and supports multiple previews in the same file without a separate struct.

---

### Step 3: Layouts — VStack, HStack, and ZStack

SwiftUI uses three container views for layout, mirroring Compose's `Column`, `Row`, and `Box`.

#### VStack — vertical stack

```swift
struct ProfileCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Jane Doe")
                .font(.headline)
            Text("iOS Developer")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
```

#### HStack — horizontal stack

```swift
struct IconLabel: View {
    let systemImage: String
    let label: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: systemImage)
            Text(label)
        }
    }
}
```

#### ZStack — overlapping layers

```swift
struct BadgedAvatar: View {
    let badgeCount: Int

    var body: some View {
        ZStack(alignment: .topTrailing) {
            Image(systemName: "person.crop.circle.fill")
                .resizable()
                .frame(width: 56, height: 56)
                .foregroundStyle(.blue)

            if badgeCount > 0 {
                Text("\(badgeCount)")
                    .font(.caption2.bold())
                    .foregroundStyle(.white)
                    .padding(4)
                    .background(.red, in: Circle())
                    .offset(x: 4, y: -4)
            }
        }
    }
}
```

---

### Step 4: Modifiers

Modifiers transform or decorate a view and return a new view. Like Compose modifiers, order matters — modifiers are applied inside-out.

```swift
struct StyledCard: View {
    var body: some View {
        Text("Tap me")
            .font(.title3.weight(.semibold))
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding()
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
            .padding(.horizontal)
            .onTapGesture {
                print("tapped")
            }
    }
}
```

`.background(.regularMaterial)` applies the system frosted-glass material that adapts automatically to light and dark mode.

---

### Step 5: State with `@State` and `@Binding`

Use `@State` for private, local view state. SwiftUI re-renders the view automatically whenever the value changes.

```swift
struct Counter: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 16) {
            Text("\(count)")
                .font(.system(size: 72, weight: .bold, design: .rounded))

            HStack(spacing: 20) {
                Button("−") { count -= 1 }
                    .buttonStyle(.bordered)
                Button("+") { count += 1 }
                    .buttonStyle(.borderedProminent)
            }

            Button("Reset", role: .destructive) { count = 0 }
        }
    }
}
```

Use `@Binding` to pass a two-way reference to a child view so it can read and write the parent's state without owning it.

```swift
struct ToggleRow: View {
    let label: String
    @Binding var isOn: Bool

    var body: some View {
        Toggle(label, isOn: $isOn)
    }
}

struct SettingsView: View {
    @State private var notificationsEnabled = false

    var body: some View {
        ToggleRow(label: "Notifications", isOn: $notificationsEnabled)
            .padding()
    }
}
```

---

### Step 6: The `@Observable` Macro (Swift 5.9+)

`@Observable` replaces the older `ObservableObject` + `@Published` pattern. Any stored property is automatically observable — no annotations needed on individual properties.

```swift
// PostStore.swift
import Observation

@Observable
final class PostStore {
    var posts: [Post] = []
    var isLoading = false
    var errorMessage: String?

    func loadPosts() async {
        isLoading = true
        defer { isLoading = false }

        do {
            let url = URL(string: "https://jsonplaceholder.typicode.com/posts")!
            let (data, _) = try await URLSession.shared.data(from: url)
            posts = try JSONDecoder().decode([Post].self, from: data)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

```swift
// Post.swift
struct Post: Identifiable, Decodable {
    let id: Int
    let title: String
    let body: String
}
```

In a view, inject the store via the environment or pass it directly:

```swift
struct PostListView: View {
    @State private var store = PostStore()

    var body: some View {
        PostListContent(store: store)
            .task { await store.loadPosts() }
    }
}
```

> **Swift 6 note:** `@Observable` classes are safe to use across actor boundaries without triggering strict-concurrency warnings, unlike the old `ObservableObject`. Mark async work with `@MainActor` if you update UI state from a background task.

---

### Step 7: Lists with `List` and `ForEach`

`List` is SwiftUI's performant scrolling container, equivalent to `LazyColumn`.

```swift
struct PostListContent: View {
    let store: PostStore

    var body: some View {
        Group {
            if store.isLoading {
                ProgressView("Loading posts…")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let error = store.errorMessage {
                ContentUnavailableView(
                    "Failed to load",
                    systemImage: "exclamationmark.triangle",
                    description: Text(error)
                )
            } else {
                List(store.posts) { post in
                    PostRow(post: post)
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                }
                .listStyle(.plain)
            }
        }
    }
}

struct PostRow: View {
    let post: Post

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(post.title.capitalized)
                .font(.headline)
            Text(post.body)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .lineLimit(2)
        }
        .padding(.vertical, 4)
    }
}
```

`ContentUnavailableView` (iOS 17+) is the idiomatic empty/error state component.

---

### Step 8: Navigation with `NavigationStack`

`NavigationStack` with typed destinations is the modern navigation API (iOS 16+). It replaces `NavigationView`.

```swift
struct RootView: View {
    @State private var store = PostStore()
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            PostListContent(store: store)
                .navigationTitle("Posts")
                .navigationBarTitleDisplayMode(.large)
                .navigationDestination(for: Post.self) { post in
                    PostDetailView(post: post)
                }
                .toolbar {
                    ToolbarItem(placement: .primaryAction) {
                        Button("Refresh") {
                            Task { await store.loadPosts() }
                        }
                    }
                }
        }
        .task { await store.loadPosts() }
    }
}
```

```swift
struct PostDetailView: View {
    let post: Post

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text(post.title.capitalized)
                    .font(.title2.bold())
                Text(post.body)
                    .font(.body)
                    .foregroundStyle(.secondary)
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .navigationTitle("Post #\(post.id)")
        .navigationBarTitleDisplayMode(.inline)
    }
}
```

Navigate programmatically by appending to the path:

```swift
path.append(selectedPost) // pushes PostDetailView
path.removeLast()         // pops one level
path = NavigationPath()   // pops to root
```

---

### Step 9: Async Data Loading with `.task`

The `.task` modifier attaches a Swift concurrency task to a view's lifetime — it starts when the view appears and is automatically cancelled when it disappears.

```swift
struct UserProfileView: View {
    let userId: Int
    @State private var user: User?

    var body: some View {
        Group {
            if let user {
                VStack(spacing: 8) {
                    Text(user.name).font(.title2.bold())
                    Text(user.email).foregroundStyle(.secondary)
                }
            } else {
                ProgressView()
            }
        }
        .task(id: userId) {
            // Re-runs automatically when userId changes
            user = await fetchUser(id: userId)
        }
    }

    private func fetchUser(id: Int) async -> User? {
        guard let url = URL(string: "https://jsonplaceholder.typicode.com/users/\(id)") else { return nil }
        let (data, _) = try? await URLSession.shared.data(from: url) ?? (Data(), URLResponse())
        return try? JSONDecoder().decode(User.self, from: data ?? Data())
    }
}
```

---

### Step 10: Forms and User Input

SwiftUI's `Form` container automatically styles controls to match the platform.

```swift
struct SettingsForm: View {
    @State private var username = ""
    @State private var notificationsOn = true
    @State private var selectedTheme = "System"

    private let themes = ["System", "Light", "Dark"]

    var body: some View {
        Form {
            Section("Profile") {
                TextField("Username", text: $username)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
            }

            Section("Preferences") {
                Toggle("Push Notifications", isOn: $notificationsOn)
                Picker("Theme", selection: $selectedTheme) {
                    ForEach(themes, id: \.self) { Text($0) }
                }
            }

            Section {
                Button("Save Changes") {
                    // persist settings
                }
                .frame(maxWidth: .infinity)
                .disabled(username.isEmpty)
            }
        }
        .navigationTitle("Settings")
    }
}
```

---

### Quick Reference

| Concept | API |
|---|---|
| Declare a view | `struct MyView: View { var body: some View { ... } }` |
| Preview | `#Preview { MyView() }` |
| Local state | `@State private var x = value` |
| Two-way child binding | `@Binding var x: T` — pass with `$x` |
| Shared observable model | `@Observable final class Store {}` |
| Vertical layout | `VStack(spacing:) { ... }` |
| Horizontal layout | `HStack(spacing:) { ... }` |
| Overlapping layers | `ZStack(alignment:) { ... }` |
| Scrollable list | `List(items) { item in ... }` |
| Lifecycle-aware async task | `.task(id:) { await ... }` |
| Navigation container | `NavigationStack(path:) { ... }` |
| Typed destination | `.navigationDestination(for: T.self) { ... }` |
| Empty / error state | `ContentUnavailableView(...)` |
