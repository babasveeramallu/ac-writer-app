import { validateInput } from '../utils/retry';
import { parseJiraError, getErrorMessage, ERROR_CODES } from '../constants/errors';

describe('Input Validation', () => {
  test('rejects empty summary', () => {
    const errors = validateInput('', '');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('required');
  });

  test('rejects short summary', () => {
    const errors = validateInput('Test', '');
    expect(errors).toContain('Ticket summary is too short (minimum 10 characters)');
  });

  test('accepts valid summary with description', () => {
    const errors = validateInput('Valid summary text', 'Description');
    expect(errors.length).toBe(0);
  });

  test('warns when summary is short and no description', () => {
    const errors = validateInput('Short summary', '');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('accepts longer summary without description', () => {
    const errors = validateInput('This is a longer summary with more details', '');
    expect(errors.length).toBe(0);
  });
});

describe('Error Parsing', () => {
  test('parses 404 as ISSUE_NOT_FOUND', () => {
    expect(parseJiraError(404)).toBe(ERROR_CODES.ISSUE_NOT_FOUND);
  });

  test('parses 403 as PERMISSION_DENIED', () => {
    expect(parseJiraError(403)).toBe(ERROR_CODES.PERMISSION_DENIED);
  });

  test('parses 429 as RATE_LIMIT', () => {
    expect(parseJiraError(429)).toBe(ERROR_CODES.RATE_LIMIT);
  });

  test('parses 408 as TIMEOUT', () => {
    expect(parseJiraError(408)).toBe(ERROR_CODES.TIMEOUT);
  });

  test('defaults to NETWORK_ERROR for unknown status', () => {
    expect(parseJiraError(500)).toBe(ERROR_CODES.NETWORK_ERROR);
  });
});

describe('Error Messages', () => {
  test('returns user-friendly message for PERMISSION_DENIED', () => {
    const msg = getErrorMessage(ERROR_CODES.PERMISSION_DENIED);
    expect(msg).toContain("don't have permission");
  });

  test('returns user-friendly message for ISSUE_NOT_FOUND', () => {
    const msg = getErrorMessage(ERROR_CODES.ISSUE_NOT_FOUND);
    expect(msg).toContain('Unable to load issue');
  });

  test('returns fallback for unknown error code', () => {
    const msg = getErrorMessage('UNKNOWN_ERROR', 'Fallback message');
    expect(msg).toBe('Fallback message');
  });

  test('returns default fallback when not provided', () => {
    const msg = getErrorMessage('UNKNOWN_ERROR');
    expect(msg).toBe('An unexpected error occurred');
  });
});
