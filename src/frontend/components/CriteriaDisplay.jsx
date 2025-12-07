import React, { useState, useEffect, memo, useRef } from 'react';
import { Text, TextArea, Button, ButtonGroup, Stack } from '@forge/react';
import { styles } from '../styles';
import { useDebounce } from '../hooks/useDebounce';

const CriteriaDisplay = memo(({ criteria, onCopy, onApply, onRegenerate, editable }) => {
  const [editedCriteria, setEditedCriteria] = useState(criteria);
  const [copySuccess, setCopySuccess] = useState(false);
  const textareaRef = useRef(null);
  const debouncedCriteria = useDebounce(editedCriteria, 300);

  useEffect(() => {
    setEditedCriteria(criteria);
  }, [criteria]);

  const handleCopy = async () => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = editedCriteria;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopySuccess(true);
        onCopy();
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        throw new Error('Copy failed');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Please manually select and copy the text');
    }
  };

  if (!criteria) {
    return (
      <div style={styles.emptyState} role="status" aria-live="polite">
        Click Generate to create acceptance criteria
      </div>
    );
  }

  return (
    <div style={styles.criteriaContainer}>
      <Stack space="medium">
        <textarea
          ref={textareaRef}
          style={styles.textArea}
          value={editedCriteria}
          onChange={(e) => setEditedCriteria(e.target.value)}
          readOnly={!editable}
          placeholder="Generated criteria will appear here..."
          aria-label="Acceptance criteria text area"
          aria-describedby="criteria-help"
          rows={10}
        />
        <span id="criteria-help" style={{ fontSize: '12px', color: '#6B778C' }}>
          Edit the generated criteria before applying to ticket
        </span>
        
        {copySuccess && (
          <div style={styles.copySuccess} role="status" aria-live="polite">
            ✓ Copied to clipboard!
          </div>
        )}
        
        <div style={styles.buttonGroup} role="group" aria-label="Criteria actions">
          <Button 
            style={styles.button} 
            onClick={handleCopy}
            aria-label="Copy criteria to clipboard"
          >
            Copy
          </Button>
          <Button 
            style={styles.button} 
            appearance="primary" 
            onClick={() => onApply(debouncedCriteria)}
            aria-label="Apply criteria to Jira ticket"
          >
            Apply to Ticket
          </Button>
          <Button 
            style={styles.button} 
            appearance="subtle" 
            onClick={onRegenerate}
            aria-label="Regenerate acceptance criteria"
          >
            Regenerate
          </Button>
        </div>
      </Stack>
    </div>
  );
});

export default CriteriaDisplay;
