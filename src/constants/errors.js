export const ERROR_CODES = {
  ISSUE_NOT_FOUND: 'ISSUE_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  GENERATION_FAILED: 'GENERATION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  TIMEOUT: 'TIMEOUT',
  INVALID_INPUT: 'INVALID_INPUT',
  UPDATE_FAILED: 'UPDATE_FAILED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED'
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.ISSUE_NOT_FOUND]: 'Unable to load issue. Please refresh and try again.',
  [ERROR_CODES.PERMISSION_DENIED]: "You don't have permission to update this issue.",
  [ERROR_CODES.GENERATION_FAILED]: 'Failed to generate criteria. Please try again.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Check your connection.',
  [ERROR_CODES.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
  [ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input. Please check your data.',
  [ERROR_CODES.UPDATE_FAILED]: 'Failed to update issue. Please try again.',
  [ERROR_CODES.QUOTA_EXCEEDED]: 'API quota exceeded. Please try again later.'
};

export const getErrorMessage = (code, fallback = 'An unexpected error occurred') => {
  return ERROR_MESSAGES[code] || fallback;
};

export const parseJiraError = (status) => {
  switch (status) {
    case 404:
      return ERROR_CODES.ISSUE_NOT_FOUND;
    case 403:
      return ERROR_CODES.PERMISSION_DENIED;
    case 429:
      return ERROR_CODES.RATE_LIMIT;
    case 408:
    case 504:
      return ERROR_CODES.TIMEOUT;
    default:
      return ERROR_CODES.NETWORK_ERROR;
  }
};
