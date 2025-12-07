import React from 'react';
import Button from '@forge/react/out/components/button';
import Spinner from '@forge/react/out/components/spinner';

const GenerateButton = ({ onClick, isLoading, disabled, template }) => {
  return (
    <Button
      appearance="primary"
      onClick={() => onClick(template)}
      isDisabled={disabled || isLoading}
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
};

export default GenerateButton;
