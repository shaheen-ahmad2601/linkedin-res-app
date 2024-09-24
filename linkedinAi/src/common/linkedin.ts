import { getChat } from './ai/openai';
import { LINKEDIN_SYSTEM_PROMPT, DEFAULT_LINKEDIN_REPLY_PROMPT } from './constants';
import { getStorageKey, trimQuotes } from './utils';

interface Post {
  text: string;
  user: string;
}

type ReplyEmotion = 'agree' | 'disagree' | 'neutral' | null;

export const generateReplyForPost = async (post: Post, emotion: ReplyEmotion = null) => {
  const prompt = (await getStorageKey('LINKEDIN_REPLY_PROMPT')) || DEFAULT_LINKEDIN_REPLY_PROMPT;
  const language = (await getStorageKey('LANGUAGE')) || 'English';
  const finalPrompt = prompt
    .replace(/\{user\}/gi, post.user)
    .replace(/\{post\}/gi, post.text)
    .replace(/\{language\}/gi, language);

  const chat = await getChat(LINKEDIN_SYSTEM_PROMPT, finalPrompt);

  return trimQuotes(chat);
};
