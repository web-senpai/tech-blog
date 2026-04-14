---
title: 'MVVM & MVI Architecture with Repository Pattern in Jetpack Compose'
metaTitle: 'MVVM & MVI Architecture with Repository Pattern in Jetpack Compose'
metaDesc: 'Learn how to structure a Jetpack Compose app using MVVM and MVI architectural patterns combined with the Repository Pattern for clean, testable, and maintainable Android code.'
socialImage: images/jetpack_compose.png
date: '2026-04-14'
published: true
tags:
  - Architecture
  - MVVM
  - MVI
  - Repository Pattern
  - Clean Architecture
  - Android
  - Jetpack Compose
  - Kotlin
  - Design Patterns
  - State Management
---

### Intro: Why Architecture Matters

As your Jetpack Compose app grows, dropping all logic into composables quickly becomes unmanageable — hard to test, hard to reason about, and impossible to maintain. Architectural patterns solve this by separating concerns into distinct layers, each with a single responsibility.

This guide covers three complementary patterns:

| Pattern | Role |
|---|---|
| **MVVM** | Separates UI state from business logic via a ViewModel |
| **MVI** | Makes state changes explicit and unidirectional |
| **Repository** | Abstracts data sources behind a clean interface |

They work together: the **Repository** handles data, the **ViewModel** (MVVM) or **Reducer** (MVI) handles business logic, and **Compose** handles the UI.

---

### The Layered Architecture

```
┌─────────────────────────┐
│       UI Layer          │  Composables observe state, emit events
├─────────────────────────┤
│    ViewModel Layer      │  Holds and transforms state
├─────────────────────────┤
│    Domain Layer         │  Use cases (optional but recommended)
├─────────────────────────┤
│     Data Layer          │  Repository + data sources (API, DB)
└─────────────────────────┘
```

Each layer only knows about the layer directly below it. The UI never talks to the data layer directly.

---

## Part 1 — Repository Pattern

### What Is the Repository Pattern?

The Repository pattern sits between your ViewModel and your data sources (REST API, local database, cache). It exposes a clean, source-agnostic interface so that the ViewModel never knows — or cares — whether data came from the network or a local cache.

**Why use it:**
- Swap a REST API for a GraphQL API without touching the ViewModel
- Add offline caching behind the same interface
- Write unit tests by substituting a fake repository

### Step 1: Define the Data Model

```kotlin
// data/model/Post.kt
data class Post(
    val id: Int,
    val userId: Int,
    val title: String,
    val body: String,
)
```

### Step 2: Define the Repository Interface

Always depend on an abstraction, not the concrete implementation. This makes the ViewModel testable.

```kotlin
// domain/repository/PostRepository.kt
interface PostRepository {
    suspend fun getPosts(): Result<List<Post>>
    suspend fun getPost(id: Int): Result<Post>
    suspend fun createPost(title: String, body: String, userId: Int): Result<Post>
    suspend fun deletePost(id: Int): Result<Unit>
}
```

### Step 3: Implement the Remote Data Source

```kotlin
// data/remote/PostApiService.kt
import retrofit2.http.*

interface PostApiService {
    @GET("posts")
    suspend fun getPosts(): List<PostDto>

    @GET("posts/{id}")
    suspend fun getPost(@Path("id") id: Int): PostDto

    @POST("posts")
    suspend fun createPost(@Body body: CreatePostRequest): PostDto

    @DELETE("posts/{id}")
    suspend fun deletePost(@Path("id") id: Int)
}

data class PostDto(val id: Int, val userId: Int, val title: String, val body: String)
data class CreatePostRequest(val title: String, val body: String, val userId: Int)

// Map DTO to domain model
fun PostDto.toDomain() = Post(id = id, userId = userId, title = title, body = body)
```

### Step 4: Implement the Repository

```kotlin
// data/repository/PostRepositoryImpl.kt
import javax.inject.Inject

class PostRepositoryImpl @Inject constructor(
    private val api: PostApiService,
) : PostRepository {

    override suspend fun getPosts(): Result<List<Post>> = runCatching {
        api.getPosts().map { it.toDomain() }
    }

    override suspend fun getPost(id: Int): Result<Post> = runCatching {
        api.getPost(id).toDomain()
    }

    override suspend fun createPost(title: String, body: String, userId: Int): Result<Post> = runCatching {
        api.createPost(CreatePostRequest(title, body, userId)).toDomain()
    }

    override suspend fun deletePost(id: Int): Result<Unit> = runCatching {
        api.deletePost(id)
    }
}
```

### Step 5: Wire Up with Hilt

```kotlin
// di/RepositoryModule.kt
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    @Singleton
    abstract fun bindPostRepository(impl: PostRepositoryImpl): PostRepository
}
```

---

## Part 2 — MVVM with Jetpack Compose

### What Is MVVM?

**Model–View–ViewModel** splits the app into three roles:

- **Model** — the data and business logic (Repository + domain models)
- **View** — the composables that render the UI
- **ViewModel** — holds `StateFlow` of UI state, calls the Repository, exposes results to the View

The View observes the ViewModel's state. The ViewModel knows nothing about the View.

### Step 6: Define the UI State

Use a sealed interface to represent every possible screen state exhaustively.

```kotlin
// ui/posts/PostsUiState.kt
sealed interface PostsUiState {
    data object Loading : PostsUiState
    data class Success(val posts: List<Post>) : PostsUiState
    data class Error(val message: String) : PostsUiState
}
```

### Step 7: Build the ViewModel

```kotlin
// ui/posts/PostsViewModel.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PostsViewModel @Inject constructor(
    private val repository: PostRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow<PostsUiState>(PostsUiState.Loading)
    val uiState: StateFlow<PostsUiState> = _uiState.asStateFlow()

    init {
        loadPosts()
    }

    fun loadPosts() {
        viewModelScope.launch {
            _uiState.value = PostsUiState.Loading
            repository.getPosts()
                .onSuccess { posts -> _uiState.value = PostsUiState.Success(posts) }
                .onFailure { error -> _uiState.value = PostsUiState.Error(error.message ?: "Unknown error") }
        }
    }

    fun deletePost(id: Int) {
        viewModelScope.launch {
            repository.deletePost(id)
                .onSuccess { loadPosts() }
                .onFailure { error -> _uiState.value = PostsUiState.Error(error.message ?: "Delete failed") }
        }
    }
}
```

### Step 8: Build the Compose Screen (MVVM)

```kotlin
// ui/posts/PostsScreen.kt
import androidx.compose.runtime.collectAsState
import androidx.hilt.navigation.compose.hiltViewModel

@Composable
fun PostsScreen(
    onPostClick: (Int) -> Unit,
    viewModel: PostsViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsState()

    PostsContent(
        uiState = uiState,
        onPostClick = onPostClick,
        onRetry = viewModel::loadPosts,
        onDelete = viewModel::deletePost,
    )
}

@Composable
private fun PostsContent(
    uiState: PostsUiState,
    onPostClick: (Int) -> Unit,
    onRetry: () -> Unit,
    onDelete: (Int) -> Unit,
) {
    when (uiState) {
        PostsUiState.Loading -> Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center,
        ) {
            CircularProgressIndicator()
        }

        is PostsUiState.Error -> Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                text = uiState.message,
                color = MaterialTheme.colorScheme.error,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(16.dp),
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = onRetry) { Text("Retry") }
        }

        is PostsUiState.Success -> LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            items(uiState.posts, key = { it.id }) { post ->
                PostCard(
                    post = post,
                    onClick = { onPostClick(post.id) },
                    onDelete = { onDelete(post.id) },
                )
            }
        }
    }
}
```

---

## Part 3 — MVI with Jetpack Compose

### What Is MVI?

**Model–View–Intent** takes MVVM further by making state mutations **explicit and unidirectional**:

```
User Action → Intent → Reducer → New State → UI renders
```

- **Intent** — a sealed class representing every possible user action
- **State** — a single immutable data class describing the entire screen
- **Reducer** — a pure function: `(State, Intent) → State`

This makes state changes predictable and easy to trace — every change has a named cause.

### Step 9: Define Intent and State

```kotlin
// ui/posts/mvi/PostsMviContract.kt

// Everything the user can do on this screen
sealed interface PostsIntent {
    data object LoadPosts : PostsIntent
    data class DeletePost(val id: Int) : PostsIntent
    data class SelectPost(val id: Int) : PostsIntent
    data object DismissError : PostsIntent
}

// The complete, immutable state of the screen
data class PostsMviState(
    val posts: List<Post> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val selectedPostId: Int? = null,
) {
    val isEmpty get() = !isLoading && posts.isEmpty() && error == null
}
```

### Step 10: Build the MVI ViewModel

```kotlin
// ui/posts/mvi/PostsMviViewModel.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PostsMviViewModel @Inject constructor(
    private val repository: PostRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(PostsMviState())
    val state: StateFlow<PostsMviState> = _state.asStateFlow()

    // One-time events (navigation, toasts) that should not persist in state
    private val _effect = MutableSharedFlow<PostsEffect>()
    val effect: SharedFlow<PostsEffect> = _effect.asSharedFlow()

    init {
        handleIntent(PostsIntent.LoadPosts)
    }

    fun handleIntent(intent: PostsIntent) {
        when (intent) {
            PostsIntent.LoadPosts -> loadPosts()
            is PostsIntent.DeletePost -> deletePost(intent.id)
            is PostsIntent.SelectPost -> reduce { copy(selectedPostId = intent.id) }
            PostsIntent.DismissError -> reduce { copy(error = null) }
        }
    }

    private fun loadPosts() {
        viewModelScope.launch {
            reduce { copy(isLoading = true, error = null) }
            repository.getPosts()
                .onSuccess { posts -> reduce { copy(isLoading = false, posts = posts) } }
                .onFailure { e -> reduce { copy(isLoading = false, error = e.message) } }
        }
    }

    private fun deletePost(id: Int) {
        viewModelScope.launch {
            repository.deletePost(id)
                .onSuccess {
                    reduce { copy(posts = posts.filterNot { it.id == id }) }
                    _effect.emit(PostsEffect.ShowSnackbar("Post deleted"))
                }
                .onFailure { e -> reduce { copy(error = e.message) } }
        }
    }

    // Convenience function to update state immutably
    private fun reduce(reducer: PostsMviState.() -> PostsMviState) {
        _state.update(reducer)
    }
}

// One-shot side effects
sealed interface PostsEffect {
    data class ShowSnackbar(val message: String) : PostsEffect
    data class NavigateTo(val postId: Int) : PostsEffect
}
```

### Step 11: Build the Compose Screen (MVI)

```kotlin
// ui/posts/mvi/PostsMviScreen.kt
@Composable
fun PostsMviScreen(
    onPostClick: (Int) -> Unit,
    viewModel: PostsMviViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }

    // Collect one-shot effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is PostsEffect.ShowSnackbar -> snackbarHostState.showSnackbar(effect.message)
                is PostsEffect.NavigateTo -> onPostClick(effect.postId)
            }
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text("Posts") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(PostsIntent.LoadPosts) }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                },
            )
        },
    ) { padding ->
        PostsMviContent(
            state = state,
            modifier = Modifier.padding(padding),
            onIntent = viewModel::handleIntent,
            onPostClick = onPostClick,
        )
    }
}

@Composable
private fun PostsMviContent(
    state: PostsMviState,
    modifier: Modifier = Modifier,
    onIntent: (PostsIntent) -> Unit,
    onPostClick: (Int) -> Unit,
) {
    Box(modifier = modifier.fillMaxSize()) {
        when {
            state.isLoading -> CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))

            state.error != null -> Column(
                modifier = Modifier.align(Alignment.Center).padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(text = state.error, color = MaterialTheme.colorScheme.error)
                Spacer(modifier = Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = { onIntent(PostsIntent.DismissError) }) { Text("Dismiss") }
                    Button(onClick = { onIntent(PostsIntent.LoadPosts) }) { Text("Retry") }
                }
            }

            state.isEmpty -> Text(
                text = "No posts found.",
                modifier = Modifier.align(Alignment.Center),
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            else -> LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                items(state.posts, key = { it.id }) { post ->
                    PostCard(
                        post = post,
                        isSelected = state.selectedPostId == post.id,
                        onClick = {
                            onIntent(PostsIntent.SelectPost(post.id))
                            onPostClick(post.id)
                        },
                        onDelete = { onIntent(PostsIntent.DeletePost(post.id)) },
                    )
                }
            }
        }
    }
}
```

---

### Step 12: Shared PostCard Composable

Both MVVM and MVI screens use the same stateless card composable.

```kotlin
// ui/components/PostCard.kt
@Composable
fun PostCard(
    post: Post,
    modifier: Modifier = Modifier,
    isSelected: Boolean = false,
    onClick: () -> Unit,
    onDelete: () -> Unit,
) {
    Card(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        border = if (isSelected) BorderStroke(2.dp, MaterialTheme.colorScheme.primary) else null,
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected)
                MaterialTheme.colorScheme.primaryContainer
            else
                MaterialTheme.colorScheme.surface,
        ),
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top,
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = post.title,
                    style = MaterialTheme.typography.titleSmall,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = post.body,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            IconButton(onClick = onDelete) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Delete post",
                    tint = MaterialTheme.colorScheme.error,
                )
            }
        }
    }
}
```

---

### MVVM vs MVI — When to Use Each

| | MVVM | MVI |
|---|---|---|
| **State model** | Multiple `StateFlow` properties | Single immutable state object |
| **Complexity** | Lower — good for most screens | Higher — pays off on complex screens |
| **Traceability** | State updates can come from many places | Every change has a named `Intent` |
| **Testing** | Test ViewModel functions directly | Test `(state, intent) → state` as pure logic |
| **Side effects** | Ad-hoc coroutine launches | Explicit `Effect` sealed class via `SharedFlow` |
| **Best for** | Simple CRUD screens, forms | Multi-step flows, undo/redo, complex user interactions |

**Rule of thumb:** Start with MVVM. Reach for MVI when your screen has many interacting user actions and you find state bugs hard to reproduce.

---

### Quick Reference

| Concept | Location | Key class/annotation |
|---|---|---|
| Data model | `data/model/` | `data class Post(...)` |
| API service | `data/remote/` | `interface PostApiService` (Retrofit) |
| Repository interface | `domain/repository/` | `interface PostRepository` |
| Repository implementation | `data/repository/` | `class PostRepositoryImpl` |
| DI binding | `di/` | `@Binds` in Hilt module |
| MVVM state | `ui/.../PostsUiState.kt` | `sealed interface PostsUiState` |
| MVVM ViewModel | `ui/.../PostsViewModel.kt` | `@HiltViewModel class PostsViewModel` |
| MVI contract | `ui/.../PostsMviContract.kt` | `sealed interface PostsIntent` + `data class PostsMviState` |
| MVI ViewModel | `ui/.../PostsMviViewModel.kt` | `handleIntent()` + `reduce {}` |
| MVI side effects | `ui/.../PostsMviViewModel.kt` | `sealed interface PostsEffect` via `SharedFlow` |
| Shared UI | `ui/components/` | Stateless composables (no ViewModel dependency) |
