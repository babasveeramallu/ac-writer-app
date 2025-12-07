export const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#FAFBFC',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    outline: 'none'
  },
  
  header: {
    marginBottom: '16px'
  },
  
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#172B4D',
    marginBottom: '4px'
  },
  
  subtitle: {
    fontSize: '14px',
    color: '#6B778C',
    marginBottom: '8px'
  },
  
  issueInfo: {
    padding: '12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DFE1E6',
    borderRadius: '3px',
    marginBottom: '12px',
    fontSize: '14px'
  },
  
  label: {
    fontWeight: 600,
    color: '#172B4D'
  },
  
  templateSelector: {
    marginBottom: '12px',
    width: '100%'
  },
  
  generateButton: {
    width: '100%',
    height: '40px',
    marginBottom: '16px'
  },
  
  criteriaContainer: {
    border: '1px solid #DFE1E6',
    borderRadius: '3px',
    padding: '12px',
    backgroundColor: '#FFFFFF',
    marginBottom: '12px'
  },
  
  textArea: {
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    width: '100%',
    minHeight: '200px',
    padding: '8px',
    border: '2px solid #DFE1E6',
    borderRadius: '3px',
    resize: 'vertical',
    backgroundColor: '#F4F5F7',
    transition: 'border-color 0.2s'
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '32px 16px',
    color: '#6B778C',
    fontSize: '14px'
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '12px'
  },
  
  button: {
    flex: '1',
    minWidth: '80px'
  },
  
  message: {
    padding: '8px 12px',
    borderRadius: '3px',
    marginBottom: '12px',
    fontSize: '14px'
  },
  
  successMessage: {
    backgroundColor: '#E3FCEF',
    color: '#006644',
    border: '2px solid #ABF5D1',
    fontWeight: '500'
  },
  
  errorMessage: {
    backgroundColor: '#FFEBE6',
    color: '#BF2600',
    border: '2px solid #FF8F73',
    fontWeight: '500'
  },
  
  spinner: {
    display: 'inline-block',
    marginRight: '8px'
  },
  
  copySuccess: {
    color: '#006644',
    fontSize: '12px',
    marginTop: '4px'
  }
};

export const inlineStyles = `
  * {
    box-sizing: border-box;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  button:hover {
    opacity: 0.9;
    transition: opacity 0.2s ease;
  }
  
  button:focus,
  button:focus-visible {
    outline: 2px solid #4C9AFF;
    outline-offset: 2px;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  textarea:focus {
    outline: 2px solid #4C9AFF;
    outline-offset: 2px;
    border-color: #4C9AFF;
  }
  
  select:focus {
    outline: 2px solid #4C9AFF;
    outline-offset: 2px;
    border-color: #4C9AFF;
  }
  
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  @media (max-width: 350px) {
    .button-group {
      flex-direction: column;
    }
    
    .button-group button {
      width: 100%;
    }
  }
`;
