import { generateReplyForPost } from '../common/linkedin';
import { getStorageKey } from '../common/utils';

const linkedInObserver: MutationObserver = new MutationObserver(async function (
  mutationsList: MutationRecord[],
) {
  for (let index: number = 0; index < mutationsList.length; index++) {
    const mutation: MutationRecord = mutationsList[index];
    if (mutation.type === 'childList') {
      let added: boolean = await injectLinkedInReplyButton();
      if (added) {
        break;
      }
    }
  }
});

function showLoadingSpinner(button: HTMLElement) {
  button.innerHTML = `
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
}

function hideLoadingSpinner(button: HTMLElement) {
  button.innerHTML = `
    <svg
    fill="currentColor" class="artdeco-button__icon" height="24" width="24"
    viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h256v256H0z"/><path fill="none" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 128v48M192 152h48M84 40v40M64 60h40M168 184v32M152 200h32"/><rect fill="none" height="45.25" rx="8" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" transform="rotate(-45 128.01 127.977)" width="226.3" x="14.9" y="105.4"/><path fill="none" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m144 80 32 32"/></svg>
  `;
}

async function injectLinkedInReplyButton(): Promise<boolean> {
  linkedInObserver.disconnect();

  await new Promise((r) => setTimeout(r, 100));

  var targetElements: NodeListOf<SVGSVGElement> = document.querySelectorAll(
    'svg[data-test-icon="emoji-medium"]',
  );

  for (let i: number = 0; i < targetElements.length; i++) {
    var targetElement: SVGSVGElement = targetElements[i];

    var parentBox: HTMLElement | null | undefined =
      targetElement.parentElement?.parentElement?.parentElement?.parentElement;

    if (parentBox?.children && parentBox.children.length < 3) {
      const postmasterButton: HTMLDivElement = document.createElement('div');
      postmasterButton.id = 'postmasterai-button';
      postmasterButton.className =
        'comments-comment-box__detour-icons artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view';
      postmasterButton.innerHTML = `
    <svg
    fill="currentColor" class="artdeco-button__icon" height="24" width="24"
    viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h256v256H0z"/><path fill="none" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 128v48M192 152h48M84 40v40M64 60h40M168 184v32M152 200h32"/><rect fill="none" height="45.25" rx="8" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" transform="rotate(-45 128.01 127.977)" width="226.3" x="14.9" y="105.4"/><path fill="none" stroke="#f0721d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m144 80 32 32"/></svg>
  `;
      postmasterButton.style.color = '#f0721d';

      postmasterButton.addEventListener('click', generateLinkedInReply);

      parentBox.insertBefore(
        postmasterButton,
        targetElement.parentElement?.parentElement?.parentElement!,
      );
    }
  }
  linkedInObserver.observe(document.body, { childList: true, subtree: true });

  return true;
}

const findClosestInputLinkedIn = (
  el: HTMLElement | null | undefined,
): HTMLElement | null | undefined => {
  const inputEl: HTMLElement | null | undefined = el?.querySelector(
    'div.ql-editor[role="textbox"]',
  );
  if (inputEl) {
    return inputEl;
  }
  if (!el?.parentElement) {
    return null;
  } else {
    return findClosestInputLinkedIn(el.parentElement);
  }
};

const findClosestPostLinkedIn = (el: Element | null): HTMLElement | null | undefined => {
  const target: HTMLElement | null | undefined = el?.querySelector(
    'div[class~="feed-shared-update-v2__description-wrapper"]',
  );
  if (target) {
    return target;
  }
  if (!el?.parentElement) {
    return null;
  } else {
    return findClosestPostLinkedIn(el.parentElement);
  }
};

function findClosestPostmasterButton(
  el: HTMLElement | null | undefined,
): HTMLElement | null | undefined {
  const target: HTMLElement | null | undefined = el?.querySelector('#postmasterai-button');
  if (target) {
    return target;
  }
  if (!el?.parentElement) {
    return null;
  } else {
    return findClosestPostmasterButton(el.parentElement);
  }
}

function findClosestLinkedInUser(
  el: HTMLElement | null | undefined,
): HTMLElement | null | undefined {
  const target: HTMLElement | null | undefined = el?.querySelector(
    'span[class~="update-components-actor__name"]',
  );
  if (target) {
    return target;
  }
  if (!el?.parentElement) {
    return null;
  } else {
    return findClosestLinkedInUser(el.parentElement);
  }
}

async function generateLinkedInReply(event: MouseEvent) {
  const post: HTMLElement | null | undefined = findClosestPostLinkedIn(event.target as Element);
  let content: string = post ? (post.children[0].children[0] as HTMLElement).innerText : '';

  const user: string | undefined =
    findClosestLinkedInUser(post)?.children[0]?.children[0]?.innerHTML;
  var postmasterButton: HTMLElement | null | undefined = findClosestPostmasterButton(post);
  if (postmasterButton instanceof HTMLDivElement) {
    showLoadingSpinner(postmasterButton);

    try {
      showLoadingSpinner(postmasterButton);
      const context: string | null = await getStorageKey('POST_CATEGORY');
      const created: string = await generateReplyForPost({ text: content, user: user ?? '' });
      var input: HTMLElement | null | undefined = findClosestInputLinkedIn(post);
      if (input instanceof HTMLElement) {
        input.innerHTML = '<p>' + created + '</p>';
      }
    } catch (e) {
      alert(e);
    } finally {
      hideLoadingSpinner(postmasterButton);
    }
  }
}

chrome.runtime.onMessage.addListener(function (request: { action: string }, sender, sendResponse) {
  if (request.action === 'tabUpdated') {
    if (window.location.href.includes('https://www.linkedin.com')) {
      linkedInObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
});
