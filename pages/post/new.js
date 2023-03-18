import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../../components/AppLayout'
import { useState } from 'react'

export default function NewPost() {
  const [post, setPost] = useState('')
  const handleClick = async () => {
    const response = await fetch('/api/generatePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    console.log(json.post.postContent)
    setPost(json.post.postContent)
  }

  return (
    <div>
      <h1>New Post Page</h1>
      <button className="btn" onClick={handleClick}>
        Generate
      </button>
      <div
        dangerouslySetInnerHTML={{ __html: post }}
        className="max-w-screen-sm p-10"
      ></div>
    </div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  }
})
