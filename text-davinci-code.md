```js
const response = await openai.createCompletion({
  model: 'text-davinci-003',
  temperature: 0,
  max_tokens: 3600,
  prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords ${keywords}.
    The content should be formatted in SEO-friendly HTML.
    The response must also include appropriate HTML title and meta description content.
    The return format must ben stringified JSON in the following format:
    {
      "postContent": post content here,
      "title": title goes here,
      "metaDescription": meta description goes here
    }`,
})

const data = JSON.parse(response.data.choices[0]?.text.split('\n').join(''))
```
