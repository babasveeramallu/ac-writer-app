import React, { memo } from 'react';
import { Button, Spinner } from '@forge/react';

const GenerateButton = memo(({ onClick, isLoading, disabled, template }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !disabled && !isLoading) {
      onClick(template);
    }
  };

  return (
    <Button
      appearance="primary"
      onClick={() => onClick(template)}
      isDisabled={disabled || isLoading}
      onKeyDown={handleKeyDown}
      aria-label={isLoading ? 'Generating acceptance criteria' : 'Generate acceptance criteria'}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner size="small" /> Generating...
        </>
      ) : (
        'Generate Acceptance Criteria'
      )}
    </Button>
  );
});

export default GenerateButton;
