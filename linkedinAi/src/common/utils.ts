export const getStorageKey = async (key: string): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key]);
    });
  });
};

export const setStorageKey = async (key: string, value: any) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve(value);
    });
  });
};

export const trimQuotes = (str: string | null): string => {
  if (!str) {
    return '';
  }

  if (['"', "'"].includes(str.charAt(0)) && ['"', "'"].includes(str.charAt(str.length - 1))) {
    return str.substring(1, str.length - 1);
  }
  return str;
};
