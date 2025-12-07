import Resolver from '@forge/resolver';
import api, { route, storage } from '@forge/api';
import { ERROR_CODES, getErrorMessage, parseJiraError } from './constants/errors';
import { retryWithBackoff, validateInput, queueRequest } from './utils/retry';
import { getCached, setCache } from './utils/cache';

const resolver = new Resolver();

const TEMPLATES = {
  'Login/Authentication': `**Scenario 1: Successful Login**
**Given** the user is on the login page
**And** they have valid credentials
**When** they enter username and password
**And** click "Login"
**Then** they should be redirected to the dashboard
**And** see a welcome message

**Scenario 2: Invalid Credentials**
**Given** the user is on the login page
**When** they enter incorrect credentials
**And** click "Login"
**Then** they should see error "Invalid username or password"
**And** remain on the login page`,

  'CRUD Operations': `**Scenario 1: Create New Record**
**Given** the user has create permissions
**When** they fill in all required fields
**And** click "Save"
**Then** the record should be created
**And** they should see success message

**Scenario 2: Update Existing Record**
**Given** the user has edit permissions
**When** they modify field values
**And** click "Update"
**Then** changes should be saved
**And** updated timestamp should reflect

**Scenario 3: Delete Record**
**Given** the user has delete permissions
**When** they click "Delete"
**And** confirm the action
**Then** the record should be removed
**And** they should see confirmation`,

  'Payment Processing': `**Scenario 1: Successful Payment**
**Given** the user has items in cart
**And** they have valid payment method
**When** they enter payment details
**And** click "Pay Now"
**Then** payment should be processed
**And** they should receive confirmation email

**Scenario 2: Payment Declined**
**Given** the user enters invalid card details
**When** they submit payment
**Then** they should see error "Payment declined"
**And** no charge should be made`,

  'Search & Filter': `**Scenario 1: Basic Search**
**Given** the user is on the search page
**When** they enter search term
**And** click "Search"
**Then** matching results should display
**And** show result count

**Scenario 2: No Results Found**
**Given** the user enters non-existent term
**When** they perform search
**Then** they should see "No results found"
**And** see suggestions for refining search`,

  'Form Validation': `**Scenario 1: Valid Form Submission**
**Given** the user is on the form
**When** they fill all required fields correctly
**And** click "Submit"
**Then** form should be submitted
**And** they should see success message

**Scenario 2: Missing Required Fields**
**Given** the user leaves required fields empty
**When** they click "Submit"
**Then** they should see validation errors
**And** form should not submit`
};

resolver.define('getIssueData', async (req) => {
  try {
    const issueKey = req.context.extension.issue.key;
    
    if (!issueKey || !/^[A-Z]+-\d+$/.test(issueKey)) {
      return {
        success: false,
        error: {
          message: getErrorMessage(ERROR_CODES.INVALID_INPUT),
          code: ERROR_CODES.INVALID_INPUT,
          details: 'Invalid issue key format'
        }
      };
    }

    const cacheKey = `issue-${issueKey}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    
    const response = await queueRequest(() => retryWithBackoff(async () => {
      const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
      if (!res.ok) {
        const error = new Error(`HTTP ${res.status}`);
        error.status = res.status;
        throw error;
      }
      return res;
    }));
    
    const data = await response.json();
    const result = {
      success: true,
      summary: data.fields.summary,
      description: data.fields.description?.content?.[0]?.content?.[0]?.text || '',
      issueType: data.fields.issuetype.name,
      projectKey: data.fields.project.key
    };
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('getIssueData error:', error);
    const errorCode = error.status ? parseJiraError(error.status) : ERROR_CODES.NETWORK_ERROR;
    return {
      success: false,
      error: {
        message: getErrorMessage(errorCode),
        code: errorCode,
        details: error.message
      }
    };
  }
});

resolver.define('generateCriteria', async (req) => {
  try {
    const { summary, description, issueType, template } = req.payload;
    
    if (template && template !== 'auto' && TEMPLATES[template]) {
      return { success: true, criteria: TEMPLATES[template] };
    }
    
    const validationErrors = validateInput(summary, description);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: {
          message: validationErrors.join('. '),
          code: ERROR_CODES.INVALID_INPUT,
          details: validationErrors
        }
      };
    }
    
    const criteria = generateGherkinCriteria(summary, description, issueType);
    return { success: true, criteria };
    
  } catch (error) {
    console.error('generateCriteria error:', error);
    return {
      success: false,
      error: {
        message: getErrorMessage(ERROR_CODES.GENERATION_FAILED),
        code: ERROR_CODES.GENERATION_FAILED,
        details: error.message
      }
    };
  }
});

function generateGherkinCriteria(summary, description, issueType) {
  const context = description ? `${summary} - ${description}` : summary;
  const scenarios = [];
  
  scenarios.push(`**Scenario 1: Successful ${extractAction(summary)}**
**Given** the user has necessary permissions
**And** all required data is available
**When** they perform the action
**And** submit the request
**Then** the operation should complete successfully
**And** they should see a confirmation message`);
  
  scenarios.push(`**Scenario 2: Validation Error**
**Given** the user attempts the operation
**When** they provide invalid or missing data
**Then** they should see a clear error message
**And** be guided on how to correct the issue
**And** no partial changes should be saved`);
  
  if (issueType === 'Bug') {
    scenarios.push(`**Scenario 3: Bug Prevention**
**Given** the conditions that caused the original bug
**When** the user performs the same actions
**Then** the bug should not occur
**And** the system should handle the case gracefully`);
  }
  
  return `## Acceptance Criteria\n\n${scenarios.join('\n\n')}`;
}

function extractAction(summary) {
  const words = summary.toLowerCase().split(' ');
  const actionWords = ['create', 'update', 'delete', 'login', 'register', 'search', 'view', 'edit', 'add', 'remove', 'modify'];
  const action = words.find(w => actionWords.includes(w));
  return action ? action.charAt(0).toUpperCase() + action.slice(1) : 'Operation';
}

resolver.define('updateDescription', async (req) => {
  try {
    const issueKey = req.context.extension.issue.key;
    const { criteria, existingDescription } = req.payload;
    
    if (!criteria || criteria.trim().length === 0) {
      return {
        success: false,
        error: {
          message: 'No criteria to apply',
          code: ERROR_CODES.INVALID_INPUT,
          details: 'Criteria is empty'
        }
      };
    }
    
    const newContent = existingDescription 
      ? `${existingDescription}\n\n---\n\n${criteria}`
      : criteria;
    
    if (newContent.length > 32767) {
      return {
        success: false,
        error: {
          message: 'Content exceeds Jira character limit',
          code: ERROR_CODES.INVALID_INPUT,
          details: 'Description too long'
        }
      };
    }
    
    const response = await retryWithBackoff(async () => {
      const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            description: {
              type: 'doc',
              version: 1,
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: newContent }]
              }]
            }
          }
        })
      });
      
      if (!res.ok) {
        const error = new Error(`HTTP ${res.status}`);
        error.status = res.status;
        throw error;
      }
      return res;
    });
    
    return { success: true };
  } catch (error) {
    console.error('updateDescription error:', error);
    const errorCode = error.status ? parseJiraError(error.status) : ERROR_CODES.UPDATE_FAILED;
    return {
      success: false,
      error: {
        message: getErrorMessage(errorCode),
        code: errorCode,
        details: error.message
      }
    };
  }
});

resolver.define('getTemplates', async () => {
  try {
    const cached = getCached('templates');
    if (cached) return cached;

    const customTemplates = await storage.get('customTemplates') || {};
    const result = { success: true, templates: { ...TEMPLATES, ...customTemplates } };
    setCache('templates', result);
    return result;
  } catch (error) {
    console.error('getTemplates error:', error);
    return { success: true, templates: TEMPLATES };
  }
});

resolver.define('saveTemplate', async (req) => {
  try {
    const { name, content } = req.payload;
    
    if (!name || !content) {
      return {
        success: false,
        error: {
          message: 'Template name and content are required',
          code: ERROR_CODES.INVALID_INPUT,
          details: 'Missing required fields'
        }
      };
    }
    
    const customTemplates = await storage.get('customTemplates') || {};
    customTemplates[name] = content;
    await storage.set('customTemplates', customTemplates);
    return { success: true };
  } catch (error) {
    console.error('saveTemplate error:', error);
    return {
      success: false,
      error: {
        message: 'Failed to save template',
        code: ERROR_CODES.UPDATE_FAILED,
        details: error.message
      }
    };
  }
});

export const handler = resolver.getDefinitions();

export async function generateCriteriaForRovo(payload, context) {
  try {
    console.log('Rovo action called with payload:', payload);
    
    const issueKey = context?.jira?.issueKey;
    
    if (!issueKey) {
      return {
        success: false,
        error: 'No Jira issue context found. Please use this action from a Jira issue page.'
      };
    }
    
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch issue: HTTP ${response.status}`
      };
    }
    
    const data = await response.json();
    const summary = data.fields.summary;
    const description = data.fields.description?.content?.[0]?.content?.[0]?.text || '';
    const issueType = data.fields.issuetype.name;
    
    const template = payload?.template || 'auto';
    
    if (template !== 'auto' && TEMPLATES[template]) {
      return {
        success: true,
        criteria: TEMPLATES[template],
        message: `Generated acceptance criteria using ${template} template for ${issueKey}`
      };
    }
    
    const criteria = generateGherkinCriteria(summary, description, issueType);
    
    return {
      success: true,
      criteria: criteria,
      message: `Generated acceptance criteria for ${issueKey}: ${summary}`
    };
    
  } catch (error) {
    console.error('generateCriteriaForRovo error:', error);
    return {
      success: false,
      error: `Failed to generate criteria: ${error.message}`
    };
  }
}
