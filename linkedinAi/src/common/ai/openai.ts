import OpenAI from 'openai';
import { getStorageKey } from '../utils';
import { DEFAULT_OPENAI_MODEL } from '../constants';

export const getChat = async (system: string, message: string): Promise<string | null> => {
  const key = await getStorageKey('OPENAI_KEY');
  let model = await getStorageKey('OPENAI_MODEL');
  model = model || DEFAULT_OPENAI_MODEL;
  const baseUrl = await getStorageKey('OPENAI_BASEURL');

  if (!key) {
    alert('Please set your OpenAI key in the extension options');
  }

  const openai = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true,
    baseURL: baseUrl || undefined,
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: system,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    model: model,
    temperature: 0.8,
  });

  return chatCompletion.choices[0].message.content;
};
