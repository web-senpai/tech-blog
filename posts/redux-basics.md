---
title: 'Modernizing Redux: The Bits and Pieces You Need for Beginner-Friendly Development'
metaTitle: 'Simplifying Redux Development: Essential Tips for Beginners'
metaDesc: 'Learn how to modernize your Redux development approach with essential bits and pieces to simplify and streamline your code. Perfect for beginners, this guide offers practical tips and best practices for building robust and maintainable Redux applications.'
socialImage: images/redux.jpg
date: '2022-10-24'
published: true
tags:
  - React
  - Redux
  - State Management
  - JavaScript
  - Beginner-Friendly
  - Development
  - Best Practices
  - Tips and Tricks
  - Code Optimization
  - Frontend Development
---

### Intro : RTK Query

RTK Query is a powerful library that simplifies data fetching and state management in React and Redux applications. With RTK Query, you can define a single endpoint definition that encapsulates the entire data fetching logic for a particular API endpoint, including caching, polling, and error handling. This allows you to eliminate much of the boilerplate code associated with data fetching and focus on the core logic of your application. Additionally, RTK Query automatically generates Redux actions and selectors for you, making it easy to integrate with your existing Redux store. Overall, RTK Query can significantly reduce the amount of code you need to write and improve the performance and maintainability of your React and Redux applications.

### Comparison With Other Options

RTK Query, React Query, and SWR are all popular data fetching libraries for React applications, and each has its own strengths and weaknesses.

React Query is focused on providing an intuitive API and powerful caching capabilities. It offers a clean, declarative API that makes it easy to handle complex data fetching scenarios such as pagination, infinite scrolling, and optimistic updates. However, React Query does not have built-in support for Redux, so integrating it with an existing Redux store can be more challenging.

SWR, on the other hand, is optimized for performance and offers a simple, lightweight API. It uses a unique approach to caching that leverages stale-while-revalidate to provide fast updates without sacrificing data accuracy. However, SWR does not offer the same level of customization and flexibility as RTK Query and React Query.

RTK Query, meanwhile, offers a powerful combination of simplicity, performance, and flexibility. Its API is designed to be easy to use and easy to integrate with existing Redux stores, and it provides advanced features such as automatic polling and efficient batch updates. RTK Query also provides a built-in mechanism for handling mutations, which can simplify the process of updating data in your backend. Additionally, RTK Query is part of the Redux Toolkit, a comprehensive library for building Redux applications, which provides a cohesive set of tools and best practices for building robust and maintainable Redux applications.

Overall, while each library has its own strengths, RTK Query stands out for its combination of ease of use, performance, and flexibility, making it a great choice for many React and Redux applications.

### Step 1: Install the Required Dependencies

First, you need to install the required dependencies for RTK Query. Open your project's terminal and run the following command:

```js
npm install @reduxjs/toolkit react-redux @reduxjs/toolkit/query @reduxjs/toolkit/query/react
```

### Step 2: Create a Service

Next, you need to create a service that defines your API endpoints. A service is a plain JavaScript object that contains a set of functions that return the API endpoints. Each endpoint is defined using the endpoint function provided by RTK Query.

Here's an example service that defines a set of endpoints for a sample REST API:

```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const sampleApi = createApi({
  reducerPath: 'sampleApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
    }),
    getPost: builder.query({
      query: (id) => `/posts/${id}`,
    }),
    addPost: builder.mutation({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
    }),
    updatePost: builder.mutation({
      query: ({ id, ...post }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: post,
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = sampleApi;
```

In this example, we define five endpoints using the builder.query and builder.mutation functions provided by RTK Query. The query function defines the endpoint's URL and method, while the mutation function defines the endpoint's URL, method, and body.

### Step 3: Use the Service in Your Component

Once you have defined your service, you can use it in your React component using the hooks provided by RTK Query. Here's an example of how to use the useGetPostsQuery hook to fetch a list of posts from the API:

#### Read data

```js
import { useGetPostsQuery } from './sampleApi';

function PostList() {
  const { data, error, isLoading } = useGetPostsQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

In this example, we use the useGetPostsQuery hook to fetch a list of posts from the API. The hook returns an object that contains the data, error, and isLoading properties. We use these properties to display the data in the component.

### Step 4: Use Other Hooks for CRUD Operations

Similarly, you can use the other hooks provided by RTK Query to perform CRUD operations. Here are some examples:

- useGetPostQuery: Fetch a single post by ID.
- useAddPostMutation: Add a new post.
- useUpdatePostMutation: Update a post by ID.
- useDeletePostMutation: Delete a post by ID.

Here's an example of how to use the useAddPostMutation, useDeletePostMutation and useUpdatePostMutation hooks to add and update a post:

```js
import { useState } from 'react';
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  usePostsQuery,
} from './sampleApi';

function PostList() {
  const { data: posts = [], isFetching } = usePostsQuery();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const handleCreate = () => {
    createPost({ title, body });
    setTitle('');
    setBody('');
  };

  const handleUpdate = () => {
    updatePost({ id: selectedPost.id, title, body });
    setSelectedPost(null);
    setTitle('');
    setBody('');
  };

  const handleDelete = (postId) => {
    deletePost(postId);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setBody(post.body);
  };

  if (isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>Create Post</h2>
      <div>
        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
        <button type='button' onClick={handleCreate} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create'}
        </button>
        {selectedPost && (
          <button type='button' onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        )}
      </div>

      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button type='button' onClick={() => handleEdit(post)} disabled={isUpdating}>
              {isUpdating && selectedPost.id === post.id ? 'Updating...' : 'Edit'}
            </button>
            <button type='button' onClick={() => handleDelete(post.id)} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

In this example, we define all three mutations (useCreatePostMutation, useUpdatePostMutation, and useDeletePostMutation) and use them in the PostList component. We also define state variables for title, body, and selectedPost.

We use the handleCreate function to create a new post when the "Create" button is clicked, and the handleUpdate function to update an existing post when the "Update" button is clicked. The handleDelete function is used to delete a post by ID.

The handleEdit function is used to populate the form fields with the data of the post being edited. We conditionally render the "Update" button only when a post is being edited, and disable the "Edit" and "Delete" buttons while the corresponding mutation is in progress.
