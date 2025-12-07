import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Stack, Heading } from '@forge/react';
import { invoke } from '@forge/bridge';
import GenerateButton from './components/GenerateButton';
import CriteriaDisplay from './components/CriteriaDisplay';
import TemplateSelector from './components/TemplateSelector';
import { styles } from './styles';

const App = () => {
  const [issueData, setIssueData] = useState(null);
  const [generatedCriteria, setGeneratedCriteria] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('auto');
  const [templates, setTemplates] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issue, templatesData] = await Promise.all([
          invoke('getIssueData'),
          invoke('getTemplates')
        ]);
        
        if (!issue.success || issue.error) {
          setError(issue.error?.message || 'Failed to load issue data');
        } else {
          setIssueData(issue);
        }
        
        if (templatesData.success && templatesData.templates) {
          setTemplates(templatesData.templates);
        }
      } catch (err) {
        console.error('Fetch data error:', err);
        setError('Failed to load issue data. Please refresh the page.');
      }
    };
    
    fetchData();
  }, []);

  const handleGenerate = async (template) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      let criteria;
      
      if (template === 'auto') {
        const result = await invoke('generateCriteria', {
          summary: issueData.summary,
          description: issueData.description,
          issueType: issueData.issueType
        });
        
        if (!result.success || result.error) {
          throw new Error(result.error?.message || 'Failed to generate criteria');
        }
        
        criteria = result.criteria;
      } else {
        criteria = templates[template];
      }
      
      if (!criteria) {
        throw new Error('No criteria generated');
      }
      
      setGeneratedCriteria(criteria);
      setSuccessMessage('Acceptance criteria generated successfully!');
    } catch (err) {
      console.error('Generate error:', err);
      setError(err.message || 'Failed to generate criteria. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    setSuccessMessage('Copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleApply = async (criteria) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      const result = await invoke('updateDescription', {
        criteria,
        existingDescription: issueData.description
      });
      
      if (!result.success || result.error) {
        throw new Error(result.error?.message || 'Failed to update ticket');
      }
      
      setSuccessMessage('Applied to ticket successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Apply error:', err);
      setError(err.message || 'Failed to update ticket. Check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate(selectedTemplate);
  };

  return (
    <div style={styles.container}>
      <Stack space="medium">
        <div style={styles.header}>
          <div style={styles.title}>AC Writer Assistant</div>
          <div style={styles.subtitle}>Generate acceptance criteria with AI</div>
        </div>
        
        {error && <div style={{...styles.message, ...styles.errorMessage}}>{error}</div>}
        {successMessage && <div style={{...styles.message, ...styles.successMessage}}>{successMessage}</div>}
      
        {issueData && (
          <div style={styles.issueInfo}>
            <div><span style={styles.label}>Issue:</span> {issueData.summary}</div>
            <div><span style={styles.label}>Type:</span> {issueData.issueType}</div>
          </div>
        )}
      
        <div style={styles.templateSelector}>
          <TemplateSelector
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            templates={templates}
          />
        </div>
        
        <div style={styles.generateButton}>
          <GenerateButton
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={!issueData}
            template={selectedTemplate}
          />
        </div>
        
        <CriteriaDisplay
          criteria={generatedCriteria}
          onCopy={handleCopy}
          onApply={handleApply}
          onRegenerate={handleRegenerate}
          editable={true}
        />
      </Stack>
    </div>
  );
};

ForgeReconciler.render(<App />);
