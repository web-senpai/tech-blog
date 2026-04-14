---
title: 'React Native Basics: Building Cross-Platform Apps'
metaTitle: 'React Native Basics: Building Cross-Platform Apps'
metaDesc: 'A practical guide to React Native covering components, layouts, state, navigation, and data fetching — using up-to-date syntax with the New Architecture, Expo SDK 53, and React Navigation v7.'
socialImage: images/react_native.png
date: '2026-04-14'
published: true
tags:
  - React Native
  - React
  - JavaScript
  - TypeScript
  - Mobile Development
  - iOS
  - Android
  - Expo
  - Cross-Platform
  - Beginner-Friendly
---

### Intro: What Is React Native?

React Native lets you build native iOS and Android apps using React and TypeScript. Unlike a web view wrapper, React Native renders real native components — a `<View>` becomes a `UIView` on iOS and an `android.view.View` on Android.

As of 2026, React Native's **New Architecture** (Fabric renderer + TurboModules) is enabled by default in all new projects, delivering significantly better performance and synchronous native interop. The recommended way to start is with **Expo SDK 53**, which ships with the New Architecture on.

---

### Step 1: Creating a New Project

```bash
npx create-expo-app@latest MyApp --template blank-typescript
cd MyApp
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone, or press `i` / `a` to open an iOS simulator or Android emulator.

Your `package.json` key dependencies will look like:

```json
{
  "dependencies": {
    "expo": "~53.0.0",
    "react": "19.0.0",
    "react-native": "0.77.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-safe-area-context": "^5.0.0",
    "react-native-screens": "^4.0.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

---

### Step 2: Core Components

React Native ships with a set of built-in components that map to native views. These are the ones you'll use every day.

```tsx
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function CoreComponents() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* View is the fundamental layout box (like a div) */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://picsum.photos/200' }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.title}>Jane Doe</Text>
        <Text style={styles.subtitle}>React Native Developer</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Search…"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  card: { alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#6366f1', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
```

---

### Step 3: Layouts with Flexbox

React Native uses **Flexbox** for all layouts, with a few differences from CSS: `flexDirection` defaults to `'column'`, and there are no block or inline elements.

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function FlexLayout() {
  return (
    <View style={styles.screen}>
      {/* Row of evenly spaced items */}
      <View style={styles.row}>
        <StatBox label="Posts" value="128" />
        <StatBox label="Followers" value="4.2k" />
        <StatBox label="Following" value="310" />
      </View>

      {/* Item that grows to fill remaining space */}
      <View style={styles.feed}>
        <Text style={styles.feedLabel}>Your Feed</Text>
      </View>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  feed: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16 },
  feedLabel: { fontSize: 18, fontWeight: '600' },
});
```

---

### Step 4: State with `useState` and `useReducer`

React Native uses the same React hooks you know from the web.

#### Simple state with `useState`

```tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => setCount(c => c - 1)}>
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => setCount(c => c + 1)}>
          <Text style={[styles.btnText, styles.btnTextPrimary]}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setCount(0)}>
        <Text style={styles.reset}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 },
  count: { fontSize: 80, fontWeight: '800' },
  row: { flexDirection: 'row', gap: 16 },
  btn: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#6366f1', justifyContent: 'center', alignItems: 'center' },
  btnPrimary: { backgroundColor: '#6366f1' },
  btnText: { fontSize: 28, color: '#6366f1', lineHeight: 32 },
  btnTextPrimary: { color: '#fff' },
  reset: { color: '#e11d48', fontSize: 16 },
});
```

#### Complex state with `useReducer`

```tsx
import { useReducer } from 'react';

type CartItem = { id: number; name: string; qty: number };
type CartState = { items: CartItem[]; total: number };
type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [...state.items, action.item], total: state.total + action.item.qty };
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'CLEAR':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

export function useCart() {
  return useReducer(cartReducer, { items: [], total: 0 });
}
```

---

### Step 5: Custom Hooks

Extract reusable stateful logic into custom hooks just like you would in a React web app.

```tsx
import { useState, useCallback } from 'react';

interface FormField<T> {
  value: T;
  onChange: (value: T) => void;
  reset: () => void;
}

function useField<T>(initial: T): FormField<T> {
  const [value, setValue] = useState<T>(initial);
  const reset = useCallback(() => setValue(initial), [initial]);
  return { value, onChange: setValue, reset };
}

// Usage in a component
export default function LoginForm() {
  const email = useField('');
  const password = useField('');

  const handleSubmit = () => {
    console.log(email.value, password.value);
    email.reset();
    password.reset();
  };

  // ... render TextInputs bound to email.value / email.onChange
}
```

---

### Step 6: Lists with `FlatList`

`FlatList` is the performant list component for React Native. It only renders items currently visible on screen.

```tsx
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Post = { id: number; title: string; body: string };

interface PostListProps {
  posts: Post[];
  onPress: (post: Post) => void;
}

export default function PostList({ posts, onPress }: PostListProps) {
  return (
    <FlatList
      data={posts}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={<Text style={styles.empty}>No posts yet.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.body} numberOfLines={3}>{item.body}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 8 },
  separator: { height: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  body: { fontSize: 14, color: '#666', lineHeight: 20 },
  empty: { textAlign: 'center', marginTop: 60, color: '#aaa' },
});
```

---

### Step 7: Navigation with React Navigation v7

Install the required packages:

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

#### Define a typed navigator

```tsx
// navigation/types.ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  PostDetail: { postId: number };
  Settings: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type PostDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;
```

#### Set up the navigator

```tsx
// navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Posts' }} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

#### Navigate between screens

```tsx
// screens/HomeScreen.tsx
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <PostList
      posts={posts}
      onPress={post => navigation.navigate('PostDetail', { postId: post.id })}
    />
  );
}
```

```tsx
// screens/PostDetailScreen.tsx
import { useRoute } from '@react-navigation/native';
import type { PostDetailScreenProps } from '../navigation/types';

export default function PostDetailScreen() {
  const { params } = useRoute<PostDetailScreenProps['route']>();
  // params.postId is fully typed
}
```

---

### Step 8: Data Fetching with TanStack Query v5

TanStack Query (formerly React Query) is the recommended data-fetching solution for React Native in 2026.

```bash
npx expo install @tanstack/react-query
```

#### Set up the provider

```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 }, // 5 minutes
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
```

#### Create a typed query hook

```tsx
// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Post = { id: number; title: string; body: string; userId: number };

const API = 'https://jsonplaceholder.typicode.com';

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${API}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

async function deletePost(id: number): Promise<void> {
  await fetch(`${API}/posts/${id}`, { method: 'DELETE' });
}

export function usePosts() {
  return useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}
```

#### Use in a screen

```tsx
import { ActivityIndicator, Text, View } from 'react-native';
import { usePosts, useDeletePost } from '../hooks/usePosts';
import PostList from '../components/PostList';

export default function HomeScreen() {
  const { data: posts, isLoading, isError } = usePosts();
  const { mutate: deletePost } = useDeletePost();

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (isError) return <Text>Something went wrong.</Text>;

  return (
    <PostList
      posts={posts ?? []}
      onPress={post => deletePost(post.id)}
    />
  );
}
```

---

### Step 9: Platform-Specific Code

React Native gives you escape hatches when you need different behaviour on iOS vs Android.

```tsx
import { Platform, StyleSheet, Text, View } from 'react-native';

// Inline platform check
const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  android: {
    elevation: 4,
  },
});

// Platform-specific file — create Header.ios.tsx and Header.android.tsx
// React Native automatically picks the right one at build time
export { default } from './Header.ios'; // just for illustration

// Conditional rendering
export function StatusBarSpacer() {
  return Platform.OS === 'ios' ? <View style={{ height: 44 }} /> : null;
}
```

---

### Step 10: Safe Area and Keyboard Handling

Always wrap screens with `SafeAreaView` so content doesn't hide behind notches or home indicators.

```tsx
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommentForm() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* form content */}
          <TextInput
            style={styles.input}
            placeholder="Write a comment…"
            multiline
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { padding: 16, gap: 12 },
  input: { minHeight: 100, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, textAlignVertical: 'top' },
});
```

---

### Quick Reference

| Concept | API |
|---|---|
| Layout box | `<View>` |
| Text display | `<Text>` |
| Scrollable container | `<ScrollView>` |
| Performant long list | `<FlatList keyExtractor renderItem>` |
| Tappable area | `<TouchableOpacity>` / `<Pressable>` |
| Styles | `StyleSheet.create({})` |
| Local state | `useState`, `useReducer` |
| Data fetching | TanStack Query `useQuery` / `useMutation` |
| Navigation setup | `NavigationContainer` + `createNativeStackNavigator` |
| Navigate to screen | `navigation.navigate('Screen', { params })` |
| Platform branch | `Platform.OS === 'ios'` / `Platform.select({})` |
| Notch / home indicator | `SafeAreaView` from `react-native-safe-area-context` |
| Keyboard push-up | `KeyboardAvoidingView behavior="padding"` |
