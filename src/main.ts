import OpenAI from 'openai';
import { AtpAgent } from '@atproto/api';

import dotenv from 'dotenv';
dotenv.config();

const OPENAI_BASEURL = process.env.OPENAI_BASEURL;
const OPENAI_MODEL = process.env.OPENAI_MODEL;
const BLUESKY_USER = process.env.BLUESKY_USER;
const BLUEKSY_PWD = process.env.BLUEKSY_PWD;
const BLUESKY_SVC = process.env.BLUESKY_SVC;

const client = new OpenAI({
  baseURL: OPENAI_BASEURL,
  apiKey: 'sk-1234',
});

const agent = new AtpAgent({ service: BLUESKY_SVC });

await agent.login({
  identifier: BLUESKY_USER,
  password: BLUEKSY_PWD,
});

async function main(): Promise<void> {
  const did = agent.did;
  const getPosts = await agent.getAuthorFeed({ actor: did });

  const all_chat_styles = getPosts.data.feed
    .filter(({ post }) => {
      return (
        post.record['$type'] === 'app.bsky.feed.post' && post.author.did === did
      );
    })
    .map(({ post }) => {
      return post.record;
    })
    .map((post: any) => post.text);

  const chat = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a social media manager. The user below will enter in the entire post history of an individual. Do not include hashtags. Keep the character count under 300. Do not add whitespace. Generate the next post.',
      },
      { role: 'user', content: all_chat_styles.join(',') },
    ],
  });

  console.log(chat.choices[0].message.content);

  await agent.post({
    // created at plus minus hour
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    text: chat.choices[0].message.content + ': TEST POST',
  });
}

main().catch(console.error);
