import { getChat } from './ai/openai';
import { TWEET_SYSTEM_PROMPT, DEFAULT_TWEET_PROMPT, DEFAULT_TWEET_REPLY_PROMPT } from './constants';
import { getStorageKey, trimQuotes } from './utils';

interface Tweet {
  text: string;
  user: string;
}

type ReplyEmotion = 'agree' | 'disagree' | 'neutral' | null;

export const generateReplyForTweet = async (tweet: Tweet, emotion: ReplyEmotion = null) => {
  const prompt = (await getStorageKey('TWEET_REPLY_PROMPT')) || DEFAULT_TWEET_REPLY_PROMPT;
  const language = (await getStorageKey('LANGUAGE')) || 'English';
  const finalPrompt = prompt
    .replace(/\{user\}/gi, tweet.user)
    .replace(/\{tweet\}/gi, tweet.text)
    .replace(/\{language\}/gi, language);

  const chat = await getChat(TWEET_SYSTEM_PROMPT, finalPrompt);

  return trimQuotes(chat);
};

export const generateNewTweet = async (context: string | null = null) => {
  const prompt = (await getStorageKey('TWEET_PROMPT')) || DEFAULT_TWEET_PROMPT;
  const language = await getStorageKey('LANGUAGE');
  let finalPrompt = context ? prompt + ', with context: ' + context : prompt;
  finalPrompt = language ? `In ${language} language (very important), ${finalPrompt}` : finalPrompt;

  const chat = await getChat(TWEET_SYSTEM_PROMPT, finalPrompt);

  return trimQuotes(chat);
};
