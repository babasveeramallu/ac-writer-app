# AC Writer Assistant - Testing Plan

## Manual Test Cases

### 1. Happy Path Test
**Objective:** Verify complete workflow from generation to application

**Steps:**
1. Create new Jira issue with summary: "User can reset password via email"
2. Open issue in Jira
3. Locate "AC Writer" panel in right sidebar
4. Click "Generate Acceptance Criteria" button
5. Wait for generation to complete
6. Review generated Gherkin format criteria
7. Click "Apply to Ticket" button
8. Refresh issue and check description field

**Expected Results:**
- ✓ AC generated with proper Given/When/Then format
- ✓ 2-4 scenarios included (happy path + edge cases)
- ✓ Success message displayed
- ✓ Issue description updated with AC
- ✓ Original description preserved (if existed)

---

### 2. Template Selection Test
**Objective:** Verify all templates generate appropriate scenarios

**Steps:**
1. Open any Jira issue
2. Select "Login/Authentication" from template dropdown
3. Click "Generate"
4. Verify login-specific scenarios
5. Repeat for: CRUD Operations, Payment Processing, Search & Filter, Form Validation

**Expected Results:**
- ✓ Each template generates relevant scenarios
- ✓ Login template includes authentication flows
- ✓ CRUD template includes create/read/update/delete
- ✓ Payment template includes transaction scenarios
- ✓ Search template includes filter/sort scenarios
- ✓ Form template includes validation scenarios

---

### 3. Vague Summary Test
**Objective:** Handle unclear requirements gracefully

**Steps:**
1. Create issue with vague summary: "Fix bug"
2. Select "Auto-detect" template
3. Click "Generate"

**Expected Results:**
- ✓ Agent generates generic criteria OR
- ✓ Agent requests clarification
- ✓ No errors thrown
- ✓ User receives actionable feedback

---

### 4. Long Summary Test
**Objective:** Handle lengthy input without truncation

**Steps:**
1. Create issue with 200+ character summary
2. Generate AC
3. Verify all content processed

**Expected Results:**
- ✓ Full summary processed
- ✓ No truncation errors
- ✓ Relevant criteria generated
- ✓ No character limit warnings

---

### 5. Empty Description Test
**Objective:** Generate AC from summary alone

**Steps:**
1. Create issue with only summary, leave description empty
2. Generate AC

**Expected Results:**
- ✓ Generation succeeds using summary
- ✓ Relevant scenarios created
- ✓ No "missing description" errors

---

### 6. Existing Description Test
**Objective:** Preserve original content when applying AC

**Steps:**
1. Create issue with existing description: "This is the original content"
2. Generate AC
3. Click "Apply to Ticket"
4. Check issue description

**Expected Results:**
- ✓ Original content preserved
- ✓ AC appended with separator (---)
- ✓ Both sections visible
- ✓ No content overwritten

---

### 7. Permission Error Test
**Objective:** Handle insufficient permissions gracefully

**Steps:**
1. Login with read-only account
2. Open issue
3. Generate AC
4. Try to apply AC

**Expected Results:**
- ✓ Generation works (read permission)
- ✓ Apply fails with clear error message
- ✓ Error: "You don't have permission to update this issue"
- ✓ No partial updates made

---

### 8. Regenerate Test
**Objective:** Allow multiple generation attempts

**Steps:**
1. Generate AC
2. Review results
3. Click "Regenerate" button
4. Compare new results

**Expected Results:**
- ✓ New criteria generated
- ✓ May differ from first attempt
- ✓ No errors
- ✓ Previous criteria replaced in UI

---

### 9. Copy to Clipboard Test
**Objective:** Verify clipboard functionality

**Steps:**
1. Generate AC
2. Click "Copy" button
3. Open text editor
4. Paste (Ctrl+V)

**Expected Results:**
- ✓ Success notification shown
- ✓ Full formatted text copied
- ✓ Gherkin formatting preserved
- ✓ Works in different browsers

---

### 10. Error Recovery Test
**Objective:** Handle network failures gracefully

**Steps:**
1. Disconnect network/WiFi
2. Try to generate AC
3. Observe error message
4. Reconnect network
5. Try again

**Expected Results:**
- ✓ Clear error: "Network error. Check your connection."
- ✓ No app crash
- ✓ Works after reconnection
- ✓ Retry succeeds

---

## Edge Cases

### Issue Type Variations
**Test:** Epic, Sub-task, Bug, Task, Story
**Expected:** All types supported, appropriate scenarios generated

### Very Short Summary
**Test:** Summary with 5 characters: "Login"
**Expected:** Validation error or generic criteria

### Special Characters
**Test:** Summary with emojis: "🔐 User authentication"
**Expected:** Processes correctly, no encoding errors

### Unicode Characters
**Test:** Summary with non-English: "用户登录功能"
**Expected:** Handles international characters

### Multiple Concurrent Requests
**Test:** Click "Generate" multiple times rapidly
**Expected:** Only one request processes, others ignored or queued

### Browser Refresh During Generation
**Test:** Refresh page while generating
**Expected:** Generation cancelled, no corrupted state

### Character Limit Edge Case
**Test:** Apply AC that would exceed 32,767 character limit
**Expected:** Error message about character limit

### Empty Template Selection
**Test:** Select template then switch to "Auto-detect"
**Expected:** Uses AI generation instead of template

---

## Automated Test Suite

### Unit Tests (src/__tests__/utils.test.js)

```javascript
import { validateInput } from '../utils/retry';
import { parseJiraError, getErrorMessage } from '../constants/errors';

describe('Input Validation', () => {
  test('rejects empty summary', () => {
    const errors = validateInput('', '');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects short summary', () => {
    const errors = validateInput('Test', '');
    expect(errors).toContain('Ticket summary is too short (minimum 10 characters)');
  });

  test('accepts valid summary', () => {
    const errors = validateInput('Valid summary text', 'Description');
    expect(errors.length).toBe(0);
  });
});

describe('Error Parsing', () => {
  test('parses 404 as ISSUE_NOT_FOUND', () => {
    expect(parseJiraError(404)).toBe('ISSUE_NOT_FOUND');
  });

  test('parses 403 as PERMISSION_DENIED', () => {
    expect(parseJiraError(403)).toBe('PERMISSION_DENIED');
  });

  test('returns user-friendly message', () => {
    const msg = getErrorMessage('PERMISSION_DENIED');
    expect(msg).toContain("don't have permission");
  });
});
```

### Integration Tests (src/__tests__/resolver.test.js)

```javascript
import { handler } from '../index';

describe('Resolver Integration', () => {
  test('getIssueData returns structured data', async () => {
    const req = {
      context: { extension: { issue: { key: 'TEST-123' } } }
    };
    const result = await handler.getIssueData(req);
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('summary');
  });

  test('generateCriteria validates input', async () => {
    const req = {
      payload: { summary: '', description: '', issueType: 'Story' }
    };
    const result = await handler.generateCriteria(req);
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('INVALID_INPUT');
  });
});
```

---

## Performance Tests

### Load Test
- Generate AC for 10 issues consecutively
- Expected: Each completes within 30 seconds
- No memory leaks

### Stress Test
- Generate AC with 500+ character summary
- Expected: Completes without timeout

---

## Browser Compatibility

Test in:
- ✓ Chrome (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Edge (latest)

---

## Accessibility Tests

- ✓ Keyboard navigation works
- ✓ Focus indicators visible
- ✓ Screen reader compatible
- ✓ ARIA labels present
- ✓ Color contrast meets WCAG AA

---

## Security Tests

- ✓ No credentials exposed in logs
- ✓ No PII leaked in error messages
- ✓ XSS protection (special chars escaped)
- ✓ CSRF tokens validated
- ✓ Rate limiting respected

---

## Regression Checklist

Before each release:
- [ ] All 10 manual tests pass
- [ ] Edge cases handled
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Error messages user-friendly
- [ ] Templates load correctly
- [ ] Clipboard works
- [ ] Apply to ticket works
- [ ] Permissions respected
- [ ] Network errors handled
