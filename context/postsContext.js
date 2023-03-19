import React, { useCallback } from 'react'

const PostsContext = React.createContext({})

export default PostsContext

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = React.useState([])

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    setPosts(postsFromSSR)
  }, [])

  const getPosts = useCallback(async ({ lastPostDate }) => {
    const result = await fetch('/api/getPosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lastPostDate,
      }),
    })

    const json = await result.json()
    const postsResult = json.posts || []
    console.log(postsResult)

    setPosts((value) => {
      const newPosts = [...value]
      postsResult.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id)
        if (!exists) {
          newPosts.push(post)
        }
      })
      return newPosts
    })
  }, [])

  return (
    <PostsContext.Provider value={{ posts, setPostsFromSSR, getPosts }}>
      {children}
    </PostsContext.Provider>
  )
}
