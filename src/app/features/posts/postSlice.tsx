import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit'
import { sub } from 'date-fns'
import { RootState } from '../../store';
import { apiSlice } from '../api/apiSlice'


const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const commentsAdapter = createEntityAdapter<Comment>({
  sortComparer: (a, b) => b.name.localeCompare(a.name)
})

export interface PostReactions {
  thumbsUp: number,
  hooray: number,
  heart: number,
  rocket: number,
  coffee: number,
}

export interface Post {
  id: number,
  user_id: number,
  user: string,
  title: string,
  body: string,
  date: string,
  reactions: PostReactions
}

export interface Comment {
  id: number,
  post_id: number,
  name: string,
  email: string,
  body: string
}

export interface PostRequest {
  status: string, error: any, count: number
}

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
  count: 0
})

const initialStateComments = commentsAdapter.getInitialState({
  status: 'idle',
  error: null,
  count: 0
})

type PostResponse = Post[]

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query<EntityState<Post>, void>({
      query: () => '/posts',
      transformResponse: (responseData: Post[], meta) => {
        let min = 1;
        const loadedPosts = responseData.map(post => {
          if(!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString()
          if(!post?.reactions) post.reactions = {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }

          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      providesTags: ( result ) => 
        result
          ? [
              ...result.ids.map(id => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
      
    }),
    getPostByUserId: builder.query<EntityState<Post>, number>({
      query: id => `/posts/?userId=${id}`,
      transformResponse: (responseData: Post[]) => {
        let min = 1
        const loadedPosts = responseData.map(post => {
          if(!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString()
          if(!post?.reactions) post.reactions = {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }

          return post;
        })
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      providesTags: ( result ) => 
        result
          ? [
              ...result.ids.map(id => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    /*addNewPost: builder.mutation({
      query: initialState => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialState,
          userId: Number(initialState.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }
        }
      })
    }),*/
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: `users/${initialPost.user_id}/posts`,
        method: 'POST',
        body: {
          ...initialPost,
          userId: Number(initialPost.user_id),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post' as const, id: arg.id }
      ]
    }),
    updatePost: builder.mutation({
      query: initialPost => ({
        url: `/posts/${initialPost.id}`,
        method: 'PUT',
        body: {
          ...initialPost,
          date: new Date().toISOString()
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post' as const, id: arg.id }
      ]
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ]
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        body: { reactions }
      }),
      async onQueryStarted({ postId, reactions }, {dispatch, queryFulfilled}) {
        
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {

            const post = draft.entities[postId]
            if (post) post.reactions = reactions
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    }),
    getPostComments: builder.query<EntityState<Comment>, number>({
      query: id => `/posts/${id}/comments`,
      transformResponse: (responseData: Comment[]) => {
        let min = 1
        const loadedComments = responseData
        return commentsAdapter.setAll(initialStateComments, loadedComments)
      },
      providesTags: ( result ) => 
        result
          ? [
              ...result.ids.map(id => ({ type: 'Comment' as const, id })),
              { type: 'Comment', id: 'LIST' },
            ]
          : [{ type: 'Comment', id: 'LIST' }],
    }),
    addComment: builder.mutation({
      query: initialStateComments => ({
        url: `/posts/${initialStateComments.post_id}/comments`,
        method: 'POST',
        body: initialStateComments
      })
    })
  })
})

export const {
  useGetPostsQuery,
  useGetPostByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
  useGetPostCommentsQuery,
  useLazyGetPostCommentsQuery,
  useAddCommentMutation
} = extendedApiSlice

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

const selectPostsData = createSelector(
  selectPostsResult,
  postsResult => postsResult.data
)



export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors<RootState>(state => selectPostsData(state) ?? initialState)