import api, { route } from '@forge/api';

export async function fetchIssueDetails(req) {
  const { issueKey } = req.payload;
  
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
  const data = await response.json();
  
  return {
    summary: data.fields.summary,
    description: data.fields.description || '',
    issueType: data.fields.issuetype.name
  };
}

export async function generateCriteria(req) {
  const { summary, description, issueType } = req.payload;
  
  const prompt = `
Issue Type: ${issueType}
Summary: ${summary}
Description: ${description}

Generate Gherkin acceptance criteria with 2-4 scenarios including happy path and edge cases.
`;
  
  return { criteria: prompt };
}

export async function updateIssueDescription(req) {
  const { issueKey, criteria } = req.payload;
  
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        description: {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: criteria }]
          }]
        }
      }
    })
  });
  
  return { success: response.ok };
}
