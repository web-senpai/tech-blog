---
title: 'Redux api calling with RTK Query'
metaTitle: 'Redux api calling with RTK Query'
metaDesc: 'We will learn how to connect server with react client using redux and rtk'
socialImage: images/redux.jpg
date: '2022-10-24'
tags:
  - react
  - redux
  - RTK query
---
## Configure Store.js

```
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from '../features/api/apiSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

setupListeners(store.dispatch)

```
## Configure ApiSlice
```
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/",
  }),
  tagTypes: [
    "InventoryCount",
    "InventoryItem",
    "Snapshot",
    "Employees",
    "Grades",
    "Inventories",
    "InventoryItems",
    "SnapshotItems",
  ],
  endpoints: (builder) => ({
    getInventoryCount: builder.query({
      query: () => "inventory-counts/",
      providesTags: ["InventoryCount"],
    }),
    getInventoryCountItems: builder.query({
      query: (inventoryId) => `inventory-item/${inventoryId}`,
    }),
    getReadyDevices: builder.query({
      query: (inventoryId) => `inventory-item/devices/${inventoryId}`,
    }),
    getSnapshots: builder.query({
      query: () => "snapshot/",
      providesTags: ["Snapshot"],
    }),
    getEmployees: builder.query({
      query: () => "snapshot/employees",
      providesTags: ["Employees"],
    }),
    getGrades: builder.query({
      query: () => "snapshot/grades",
      providesTags: ["Grades"],
    }),
    getSections: builder.query({
      query: () => "snapshot/sections",
      providesTags: ["Sections"],
    }),
    getInventories: builder.query({
      query: () => "snapshot/inventories",
      providesTags: ["Inventories"],
    }),
    getInventoryItems: builder.query({
      query: (id) => `snapshot/inventory-items/${id}`,
      providesTags: ["InventoryItems"],
    }),
    getSnapshotInventoryItems: builder.query({
      query: (id) => `snapshot/snapshot-items/${id}`,
      providesTags: ["SnapshotItems"],
    }),
    createNewInventoryCount: builder.mutation({
      query: (payload) => ({
        url: "inventory-counts/",
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["InventoryCount"],
    }),
    createNewSnapshot: builder.mutation({
      query: (payload) => ({
        url: "snapshot/",
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Snapshot"],
    }),
    updateInventoryCount: builder.mutation({
      query: (payload) => {
        console.log(payload);
        const { id, ...body } = payload;
        return {
          url: `inventory-counts/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["InventoryCount"],
    }),
    deleteSnapshot: builder.mutation({
      query: (id) => ({
        url: `snapshot/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Snapshot"],
    }),
  }),
});

export const {
  useGetSnapshotsQuery,
  useGetEmployeesQuery,
  useGetGradesQuery,
  useGetSectionsQuery,
  useGetInventoriesQuery,
  useGetInventoryItemsQuery,
  useGetSnapshotInventoryItemsQuery,
  useGetInventoryCountQuery,
  useGetInventoryCountItemsQuery,
  useGetReadyDevicesQuery,
  useCreateNewInventoryCountMutation,
  useCreateNewSnapshotMutation,
  useDeleteSnapshotMutation,
  useUpdateInventoryCountMutation,
} = apiSlice;

```

## Call created api's in file

### Getting queries

```
import React from 'react'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

import { useGetPostsQuery } from '../api/apiSlice'

let PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery()

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = posts.map(post => <PostExcerpt key={post.id} post={post} />)
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
```

### Getting Single things
```
import React from 'react'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { useGetPostQuery } from '../api/apiSlice'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  let content
  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    )
  }

  return <section>{content}</section>
}
```

### Creating new things query

```
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Spinner } from '../../components/Spinner'
import { useAddNewPostMutation } from '../api/apiSlice'
import { selectAllUsers } from '../users/usersSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const [addNewPost, { isLoading }] = useAddNewPostMutation()
  const users = useSelector(selectAllUsers)

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUserId(e.target.value)

  const canSave = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await addNewPost({ title, content, user: userId }).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      }
    }
  }

  // omit rendering logic
}
```