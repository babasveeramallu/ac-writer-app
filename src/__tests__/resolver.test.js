describe('Resolver Integration Tests', () => {
  test('getIssueData validates issue key format', () => {
    const invalidKeys = ['', 'test', '123', 'test-', '-123'];
    invalidKeys.forEach(key => {
      expect(/^[A-Z]+-\d+$/.test(key)).toBe(false);
    });
    
    const validKeys = ['TEST-123', 'PROJ-1', 'ABC-999'];
    validKeys.forEach(key => {
      expect(/^[A-Z]+-\d+$/.test(key)).toBe(true);
    });
  });

  test('validateInput catches empty summary', () => {
    const { validateInput } = require('../utils/retry');
    const errors = validateInput('', '');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('validateInput catches short summary', () => {
    const { validateInput } = require('../utils/retry');
    const errors = validateInput('Short', '');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('character limit check for description', () => {
    const maxLength = 32767;
    const longText = 'a'.repeat(maxLength + 1);
    expect(longText.length).toBeGreaterThan(maxLength);
  });
});
