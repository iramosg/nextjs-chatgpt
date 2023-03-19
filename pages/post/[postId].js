import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../../components/AppLayout'
import { getSession } from '@auth0/nextjs-auth0'
import { ObjectId } from 'mongodb'
import clientPromise from '../../lib/mongodb'

export default function Post(props) {
  console.log(props)
  return <div>My page Post</div>
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx, session) {
    const userSession = await getSession(ctx.req, ctx.res)
    const client = await clientPromise
    const db = client.db('blogstandard')
    const user = await db
      .collection('users')
      .findOne({ auth0Id: userSession.user.sub })

    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    })

    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false,
        },
      }
    }

    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        topic: post.topic,
      },
    }
  },
})
