import { useChromeStorageSync } from 'use-chrome-storage';
import {
  DEFAULT_LINKEDIN_REPLY_PROMPT,
  DEFAULT_OPENAI_MODEL,
  DEFAULT_TWEET_PROMPT,
  DEFAULT_TWEET_REPLY_PROMPT,
} from '../common/constants';
import { useState } from 'react';

export const Popup = () => {
  const link = 'https://github.com/xinecraft/postmasterai';
  const [openAiKey, setOpenAiKey] = useChromeStorageSync('OPENAI_KEY', '');
  const [openAiBaseUrl, setOpenAiBaseUrl] = useChromeStorageSync('OPENAI_BASEURL', '');
  const [openAiModel, setOpenAiModel] = useChromeStorageSync('OPENAI_MODEL', DEFAULT_OPENAI_MODEL);
  const [postCategory, setPostCategory] = useChromeStorageSync('POST_CATEGORY', '');
  const [language, setLanguage] = useChromeStorageSync('LANGUAGE', 'English');
  const [tweetPrompt, setTweetPrompt] = useChromeStorageSync('TWEET_PROMPT', DEFAULT_TWEET_PROMPT);
  const [tweetReplyPrompt, setTweetReplyPrompt] = useChromeStorageSync(
    'TWEET_REPLY_PROMPT',
    DEFAULT_TWEET_REPLY_PROMPT,
  );
  const [linkedinReplyPrompt, setLinkedinReplyPrompt] = useChromeStorageSync(
    'LINKEDIN_REPLY_PROMPT',
    DEFAULT_LINKEDIN_REPLY_PROMPT,
  );
  const [viewAdvanced, setViewAdvanced] = useState<boolean>(false);

  return (
    <main className="bg-white container p-3">
      <h3 className="text-center text-orange-500 text-lg font-bold">PostMasterAI</h3>

      <div className="grid grid-cols-1 gap-6">
        <label className="block">
          <span className="text-gray-700">OpenAI Secret Key</span>
          <input
            className="mt-1 block w-full"
            placeholder="sk-KaBmyzCtrKxhe3EyEM..."
            id="openai-key"
            type="text"
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Post Category</span>
          <input
            className="mt-1 block w-full"
            placeholder="Eg: Inspirational Quotes"
            id="post-category"
            type="text"
            value={postCategory}
            onChange={(e) => setPostCategory(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Language</span>
          <input
            className="mt-1 block w-full"
            placeholder="Eg: English"
            id="language"
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </label>

        <div className="flex justify-end">
          <button className="text-xs text-gray-500" onClick={() => setViewAdvanced(!viewAdvanced)}>
            {viewAdvanced ? 'Hide' : 'Show'} Advanced Config
          </button>
        </div>
        {viewAdvanced && (
          <>
            <label className="block">
              <span className="text-gray-700">OpenAI Base URL</span>
              <input
                className="mt-1 block w-full"
                placeholder="Eg: https://api.deepseek.com/v1"
                id="openai-baseurl"
                type="text"
                value={openAiBaseUrl}
                onChange={(e) => setOpenAiBaseUrl(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">OpenAI Model</span>
              <input
                className="mt-1 block w-full"
                placeholder="Eg: gpt-3.5-turbo"
                id="openai-model"
                type="text"
                value={openAiModel}
                onChange={(e) => setOpenAiModel(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">New Tweet Prompt</span>
              <textarea
                className="mt-1 block w-full"
                rows={3}
                value={tweetPrompt}
                onChange={(e) => setTweetPrompt(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Tweet Reply Prompt</span>
              <textarea
                className="mt-1 block w-full"
                rows={3}
                value={tweetReplyPrompt}
                onChange={(e) => setTweetReplyPrompt(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">LinkedIn Reply Prompt</span>
              <textarea
                className="mt-1 block w-full"
                rows={3}
                value={linkedinReplyPrompt}
                onChange={(e) => setLinkedinReplyPrompt(e.target.value)}
              />
            </label>
          </>
        )}
      </div>

      <div className="mt-8 flex justify-center items-center">
        <a className="text-xs text-gray-500" href={link} target="_blank">
          Give a ⭐ on GitHub
        </a>
      </div>
    </main>
  );
};

export default Popup;
