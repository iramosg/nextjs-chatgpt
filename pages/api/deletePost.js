import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const {
      user: { sub },
    } = await getSession(req, res)
    const client = await clientPromise
    const db = client.db('blogstandard')
    const userProfile = await db.collection('users').findOne({
      auth0Id: sub,
    })

    const { postId } = req.body
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(postId),
    })

    // if (post.userId !== userProfile._id) {
    //   res
    //     .status(403)
    //     .json({ error: 'You are not authorized to delete this post.' })
    //   return
    // }

    await db.collection('posts').deleteOne({
      userId: userProfile._id,
      _id: new ObjectId(postId),
    })

    res.status(200).json({ success: true })
  } catch (e) {
    console.log('ERROR: ', e)
  }

  return
})
