import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;

if (!ANTHROPIC_KEY) {
  throw new Error('ANTHROPIC_KEY is not defined in the environment');
}

if (!ANTHROPIC_KEY) {
  throw new Error('ANTHROPIC_KEY is not defined in the environment');
}

// Rest of the code...

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});

const msg = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello, Claude' }],
});
console.log(msg);
