import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../../components/AppLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function NewPost() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch('/api/generatePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        keywords,
      }),
    })

    const json = await response.json()
    if (json?.postId) {
      router.push(`/post/${json.postId}`)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
          />
        </div>
        <button className="btn">Generate</button>
      </form>
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
