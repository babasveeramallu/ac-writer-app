import React from 'react';
import { Select } from '@forge/react';

const TemplateSelector = ({ value, onChange, templates }) => {
  const options = [
    { label: 'Auto-detect', value: 'auto' },
    { label: 'Login/Authentication', value: 'Login/Authentication' },
    { label: 'CRUD Operations', value: 'CRUD Operations' },
    { label: 'Payment Processing', value: 'Payment Processing' },
    { label: 'Search & Filter', value: 'Search & Filter' },
    { label: 'Form Validation', value: 'Form Validation' },
    ...Object.keys(templates || {}).map(key => ({ label: key, value: key }))
  ];

  return (
    <Select
      label="Template"
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TemplateSelector;
