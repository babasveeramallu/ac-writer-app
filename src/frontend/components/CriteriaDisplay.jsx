import React, { useState } from 'react';
import { Text, TextArea, Button, ButtonGroup, Stack } from '@forge/react';
import { styles } from '../styles';

const CriteriaDisplay = ({ criteria, onCopy, onApply, onRegenerate, editable }) => {
  const [editedCriteria, setEditedCriteria] = useState(criteria);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedCriteria);
      setCopySuccess(true);
      onCopy();
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = editedCriteria;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (!criteria) {
    return (
      <div style={styles.emptyState}>Click Generate to create acceptance criteria</div>
    );
  }

  return (
    <div style={styles.criteriaContainer}>
      <Stack space="medium">
        <textarea
          style={styles.textArea}
          value={editedCriteria}
          onChange={(e) => setEditedCriteria(e.target.value)}
          readOnly={!editable}
          placeholder="Generated criteria will appear here..."
        />
        
        {copySuccess && <div style={styles.copySuccess}>✓ Copied to clipboard!</div>}
        
        <div style={styles.buttonGroup}>
          <Button style={styles.button} onClick={handleCopy}>Copy</Button>
          <Button style={styles.button} appearance="primary" onClick={() => onApply(editedCriteria)}>
            Apply to Ticket
          </Button>
          <Button style={styles.button} appearance="subtle" onClick={onRegenerate}>
            Regenerate
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default CriteriaDisplay;
