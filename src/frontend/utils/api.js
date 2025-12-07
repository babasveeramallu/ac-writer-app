import { invoke } from '@forge/bridge';

let templateCache = null;

export const fetchIssueData = async (issueKey) => {
  try {
    const result = await invoke('getIssueData', { issueKey });
    
    if (!result.success || result.error) {
      return { 
        success: false, 
        data: null, 
        error: result.error?.message || 'Failed to fetch issue data' 
      };
    }
    
    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('fetchIssueData error:', error);
    return { success: false, data: null, error: 'Failed to fetch issue data' };
  }
};

export const generateAcceptanceCriteria = async (issueData, template) => {
  try {
    const result = await invoke('generateCriteria', {
      summary: issueData.summary,
      description: issueData.description,
      issueType: issueData.issueType,
      template
    });
    
    if (!result.success || result.error) {
      return { 
        success: false, 
        data: null, 
        error: result.error?.message || 'Failed to generate criteria' 
      };
    }
    
    return { success: true, data: result.criteria, error: null };
  } catch (error) {
    console.error('generateAcceptanceCriteria error:', error);
    return { 
      success: false, 
      data: null, 
      error: 'Failed to generate criteria'
    };
  }
};

export const applyToTicket = async (issueKey, criteria) => {
  try {
    const result = await invoke('updateDescription', { issueKey, criteria });
    
    if (!result.success || result.error) {
      return { 
        success: false, 
        data: null, 
        error: result.error?.message || 'Failed to update ticket' 
      };
    }
    
    return { success: true, data: result.success, error: null };
  } catch (error) {
    console.error('applyToTicket error:', error);
    return { success: false, data: null, error: 'Failed to update ticket' };
  }
};

export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true, data: true, error: null };
    }
    
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (success) {
      return { success: true, data: true, error: null };
    }
    
    throw new Error('Copy command failed');
  } catch (error) {
    console.error('copyToClipboard error:', error);
    return { success: false, data: false, error: 'Failed to copy to clipboard' };
  }
};

export const getAvailableTemplates = async () => {
  try {
    if (templateCache) {
      return { success: true, data: templateCache, error: null };
    }
    
    const result = await invoke('getTemplates');
    
    if (!result.success && result.error) {
      return { success: false, data: null, error: result.error.message };
    }
    
    const templates = Object.entries(result.templates || {}).map(([name, content]) => ({
      name,
      description: `${name} template`,
      content
    }));
    
    templateCache = templates;
    return { success: true, data: templates, error: null };
  } catch (error) {
    console.error('getAvailableTemplates error:', error);
    return { success: false, data: null, error: 'Failed to fetch templates' };
  }
};
