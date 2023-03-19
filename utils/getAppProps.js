import { getSession } from '@auth0/nextjs-auth0'
import clientPromise from '../lib/mongodb'

export const getAppProps = async (ctx) => {
  const userSession = await getSession(ctx.req, ctx.res)
  const client = await clientPromise
  const db = client.db('blogstandard')
  const user = await db
    .collection('users')
    .findOne({ auth0Id: userSession.user.sub })

  if (!user) {
    return {
      avaliableTokens: 0,
      posts: [],
    }
  }

  const posts = await db
    .collection('posts')
    .find({
      userId: user._id,
    })
    .sort({ created: -1 })
    .toArray()

  return {
    avaliableTokens: user.avaliableTokens,
    posts: posts.map(({ created, _id, userId, ...rest }) => ({
      _id: _id.toString(),
      created: created.toString(),
      ...rest,
    })),
    postId: ctx.params?.postId || null,
  }
}