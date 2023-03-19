import { Configuration, OpenAIApi } from 'openai'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { getSession } from '@auth0/nextjs-auth0'
import clientPromise from '../../lib/mongodb'

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res)
  const client = await clientPromise
  const db = client.db('blogstandard')
  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub,
  })

  if (!userProfile?.avaliableTokens) {
    res.status(403).json({
      error: 'You do not have enough tokens to generate a post.',
    })
    return
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(config)

  const { topic, keywords } = req.body

  if (!topic || !keywords) {
    res.status(422).json({
      error: 'You must provide a topic and keywords.',
    })
    return
  }

  if (topic.length > 80 || keywords.length > 80) {
    res.status(422).json({
      error: 'The topic and keywords must be less than 80 characters.',
    })
    return
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    max_tokens: 3600,
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'You are a blog post generator.',
      },
      {
        role: 'user',
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords ${keywords}.
        The content should be formatted in SEO-friendly HTML.
        The response must also include appropriate HTML title and meta description content.
        The return format must ben stringified JSON in the following format:
        {
          "postContent": post content here,
          "title": title goes here,
          "metaDescription": meta description goes here
        }`,
      },
    ],
  })

  const data = JSON.parse(response.data?.choices[0]?.message.content)

  await db.collection('users').updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        avaliableTokens: -1,
      },
    }
  )

  const post = await db.collection('posts').insertOne({
    postContent: data?.postContent,
    title: data?.title,
    metaDescription: data?.metaDescription,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  })

  res.status(200).json({
    postId: post?.insertedId,
  })
})
