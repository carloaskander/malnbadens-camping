export const SUPPORTED_LANGUAGES = ['sv', 'en', 'no', 'de', 'fr', 'fi'];
export const DEFAULT_LANGUAGE = 'sv';
export const LANGUAGE_STORAGE_KEY = 'mbcLanguage';

const NORWEGIAN_LANGUAGE_CODES = ['nb', 'nn', 'no'];
const LANGUAGE_SEGMENT_PATTERN = /^[a-z]{2,3}(?:[-_][a-z]{2,4})?$/i;

export const normalizeLanguage = (language) => {
  if (typeof language !== 'string') {
    return null;
  }

  const baseLanguage = language.trim().toLowerCase().split(/[-_]/)[0];

  if (NORWEGIAN_LANGUAGE_CODES.includes(baseLanguage)) {
    return 'no';
  }

  return SUPPORTED_LANGUAGES.includes(baseLanguage) ? baseLanguage : null;
};

export const getRouteLanguage = (pathname = '') => {
  const routeSegment = pathname.split('/').filter(Boolean)[0];
  return normalizeLanguage(routeSegment);
};

export const getSavedLanguage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
};

export const getBrowserLanguage = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language];

  for (const language of browserLanguages) {
    const normalizedLanguage = normalizeLanguage(language);

    if (normalizedLanguage) {
      return normalizedLanguage;
    }
  }

  return null;
};

export const getPreferredLanguage = () => (
  getSavedLanguage() || getBrowserLanguage() || DEFAULT_LANGUAGE
);

export const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  return getRouteLanguage(window.location.pathname) || getPreferredLanguage();
};

export const saveLanguagePreference = (language) => {
  const normalizedLanguage = normalizeLanguage(language);

  if (typeof window !== 'undefined' && normalizedLanguage) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    } catch {
      // The selected route still works when storage is unavailable.
    }
  }
};

export const replaceRouteLanguage = (pathname, language) => {
  const normalizedLanguage = normalizeLanguage(language) || DEFAULT_LANGUAGE;
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `/${normalizedLanguage}/home`;
  }

  if (normalizeLanguage(segments[0]) || LANGUAGE_SEGMENT_PATTERN.test(segments[0])) {
    segments[0] = normalizedLanguage;
  } else {
    segments.unshift(normalizedLanguage);
  }

  return `/${segments.join('/')}`;
};

export const removeFirstPathSegment = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const remainingPath = segments.slice(1).join('/');

  return remainingPath ? `/${remainingPath}` : '/home';
};

export const getPathForLanguageRedirect = (pathname) => {
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  if (firstSegment && LANGUAGE_SEGMENT_PATTERN.test(firstSegment)) {
    return removeFirstPathSegment(pathname);
  }

  return pathname === '/' ? '/home' : pathname;
};
