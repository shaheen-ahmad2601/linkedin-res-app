import { generateNewTweet, generateReplyForTweet } from '../common/twitter';
import { getStorageKey } from '../common/utils';

function showLoadingSpinner() {
  const loadingSVG = document.createElement('div');
  loadingSVG.id = 'postmasterai-spinner';
  loadingSVG.className = 'loading-spinner';
  loadingSVG.style.marginRight = '15px';
  loadingSVG.style.marginTop = '5px';
  loadingSVG.innerHTML = `
    <svg
      id="loading-spinner"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      class="loading-svg"
      height="20" width="20"
      >
        <circle cx="50" cy="50" fill="none" stroke="#f0721d" stroke-width="12" r="40" stroke-dasharray="188.49555921538757 64.83185307179586">
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          ></animateTransform>
        </circle>
    </svg>
  `;

  const targetElement = document.querySelector('#postmasterai-button');
  targetElement?.parentNode?.insertBefore(loadingSVG, targetElement);

  const magicButton = document.querySelector('#postmasterai-button')! as HTMLButtonElement;
  magicButton.style.display = 'none';
}

function hideLoadingSpinner() {
  const element = document.querySelector('#postmasterai-spinner')!;
  element.remove();

  const magicButton = document.querySelector('#postmasterai-button')! as HTMLButtonElement;
  magicButton.style.display = 'block';
}

function findClosestTwitterInputElement(el: Element | null): Element | null {
  if (!el) {
    return null;
  }

  const inputEl = el.querySelector('div[data-testid^="tweetTextarea_"][role="textbox"]');
  if (inputEl) {
    return inputEl;
  }
  if (!el.parentElement) {
    return null;
  } else {
    return findClosestTwitterInputElement(el.parentElement);
  }
}

const setInputForReplyOrTweet = async (element: HTMLElement, text: string): Promise<void> => {
  element.focus();

  // Clear existing text in the element
  if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
    (element as HTMLInputElement | HTMLTextAreaElement).select(); // Selects existing text in input or textarea elements
  } else if (element.contentEditable === 'true') {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  await navigator.clipboard.writeText(text);

  const pasteEvent = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    clipboardData: new DataTransfer(),
  });
  pasteEvent.clipboardData?.setData('text/plain', text);
  element.dispatchEvent(pasteEvent);

  await navigator.clipboard.writeText('');
};

async function generateTweetReply(): Promise<void> {
  const tweetTextDiv = document.querySelector('div[data-testid="tweetText"]');
  const tweet = tweetTextDiv?.innerHTML;
  if (!tweet) {
    alert('Failed to detect reply text.');
    return;
  }

  const displayName = document.querySelector('[data-testid="tweet"] [data-testid="User-Name"]')
    ?.children[0].children[0].children[0].children[0].children[0].children[0].innerHTML;
  const userName = document.querySelector('[data-testid="tweet"] [data-testid="User-Name"]')
    ?.children[1].children[0].children[0].children[0].children[0].innerHTML;
  const user = `${displayName} (@${userName})`;

  try {
    showLoadingSpinner();
    const inputDiv = findClosestTwitterInputElement(tweetTextDiv);
    const created = await generateReplyForTweet({ text: tweet, user: user ?? '' });

    if (inputDiv) {
      await setInputForReplyOrTweet(inputDiv as HTMLElement, created);
    }
  } catch (e) {
    alert(e);
  } finally {
    hideLoadingSpinner();
  }
}

async function injectTwitterReplyButton(): Promise<void> {
  await new Promise((r) => setTimeout(r, 100));

  const targetElement = document.querySelector('div[data-testid="tweetButton"');

  const innerText = targetElement?.children[0]?.children[0]?.children[0]?.innerHTML;
  if (innerText === 'Post') {
    return;
  }

  const button = document.createElement('button');
  button.id = 'postmasterai-button';
  button.innerHTML = `
    <svg
    fill="currentColor" class="artdeco-button__icon" height="20" width="20"
    viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h256v256H0z"/><path fill="none" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 128v48M192 152h48M84 40v40M64 60h40M168 184v32M152 200h32"/><rect fill="none" height="45.25" rx="8" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" transform="rotate(-45 128.01 127.977)" width="226.3" x="14.9" y="105.4"/><path fill="none" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m144 80 32 32"/></svg>
  `;
  button.style.borderRadius = '50px';
  button.style.border = 'None';
  button.style.color = '#f0721d';
  button.style.background = 'transparent';
  button.style.cursor = 'pointer';
  button.style.fontWeight = '600';
  button.style.marginRight = '10px';

  button.addEventListener('click', generateTweetReply);
  targetElement?.parentNode?.insertBefore(button, targetElement);
}

const generateTweet = async () => {
  const tweetTextDiv = document.querySelector('div[data-testid="tweetTextarea_0"]');

  try {
    showLoadingSpinner();
    const context = await getStorageKey('POST_CATEGORY');
    const created = await generateNewTweet(context ?? null);
    const inputDiv = findClosestTwitterInputElement(tweetTextDiv);
    if (inputDiv && created) {
      await setInputForReplyOrTweet(inputDiv as HTMLElement, created);
    }
  } catch (e) {
    alert(e);
  } finally {
    hideLoadingSpinner();
  }
};

async function injectTwitterPostButton(): Promise<void> {
  const postButtonInjected = document.getElementById('postmasterai-button');
  if (postButtonInjected) {
    return;
  }

  await new Promise((r) => setTimeout(r, 100));

  let targetElement = document.querySelector('div[data-testid="tweetButtonInline"]');
  const innerText = targetElement?.children[0]?.children[0]?.children[0]?.innerHTML;
  if (innerText != 'Post') {
    return;
  }

  const countdownCircleElement = document.querySelector('div[data-testid="countdown-circle"]');
  if (countdownCircleElement) {
    targetElement = countdownCircleElement;
  }

  const div = document.createElement('div');
  div.id = 'postmasterai-container';

  const button = document.createElement('button');
  button.id = 'postmasterai-button';
  button.innerHTML = `
    <svg
    fill="currentColor" class="artdeco-button__icon" height="20" width="20"
    viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h256v256H0z"/><path fill="none" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 128v48M192 152h48M84 40v40M64 60h40M168 184v32M152 200h32"/><rect fill="none" height="45.25" rx="8" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" transform="rotate(-45 128.01 127.977)" width="226.3" x="14.9" y="105.4"/><path fill="none" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m144 80 32 32"/></svg>
  `;
  button.style.borderRadius = '50px';
  button.style.border = 'None';
  button.style.color = '#f0721d';
  button.style.background = 'transparent';
  button.style.cursor = 'pointer';
  button.style.fontWeight = '600';
  button.style.marginRight = '10px';

  button.addEventListener('click', generateTweet);
  div.appendChild(button);
  targetElement?.parentNode?.insertBefore(div, targetElement);
}
injectTwitterPostButton();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'tabUpdated') {
    if (
      window.location.href.includes('https://twitter.com/compose/post') ||
      window.location.href.includes('https://pro.twitter.com/compose/post')
    ) {
      injectTwitterReplyButton();
    } else if (window.location.href.includes('https://twitter.com')) {
      injectTwitterPostButton();
    }
  }
});
