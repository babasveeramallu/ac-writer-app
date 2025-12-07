export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const isRetryable = error.status === 429 || error.status === 503 || error.status === 504;
      if (!isRetryable) {
        throw error;
      }
      
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      console.log(`Retry attempt ${attempt}/${maxRetries} after ${backoffDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
};

export const validateInput = (summary, description) => {
  const errors = [];
  
  if (!summary || summary.trim().length === 0) {
    errors.push('Ticket summary is required');
  } else if (summary.trim().length < 10) {
    errors.push('Ticket summary is too short (minimum 10 characters)');
  }
  
  if (!description && summary && summary.trim().length < 20) {
    errors.push('Please provide more details in the summary or add a description');
  }
  
  return errors;
};
