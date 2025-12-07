import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import ForgeReconciler, { Text, Stack, Heading } from '@forge/react';
import { invoke } from '@forge/bridge';
import GenerateButton from './components/GenerateButton';
import TemplateSelector from './components/TemplateSelector';
import SkeletonLoader from './components/SkeletonLoader';
import { useRequestDedup } from './hooks/useRequestDedup';
import { styles } from './styles';

const CriteriaDisplay = lazy(() => import('./components/CriteriaDisplay'));

const App = () => {
  const [issueData, setIssueData] = useState(null);
  const [generatedCriteria, setGeneratedCriteria] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('auto');
  const [templates, setTemplates] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const dedupedRequest = useRequestDedup();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issue, templatesData] = await dedupedRequest('init', () => 
          Promise.all([
            invoke('getIssueData'),
            invoke('getTemplates')
          ])
        );
        
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
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, [dedupedRequest]);

  const handleGenerate = useCallback(async (template) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      let criteria;
      
      if (template === 'auto') {
        const result = await dedupedRequest(`generate-${template}`, () =>
          invoke('generateCriteria', {
            summary: issueData.summary,
            description: issueData.description,
            issueType: issueData.issueType
          })
        );
        
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
  }, [issueData, templates, dedupedRequest]);

  const handleCopy = useCallback(() => {
    setSuccessMessage('Copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 2000);
  }, []);

  const handleApply = useCallback(async (criteria) => {
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
  }, [issueData]);

  const handleRegenerate = useCallback(() => {
    handleGenerate(selectedTemplate);
  }, [handleGenerate, selectedTemplate]);

  if (initialLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div style={styles.container} role="main" aria-label="AC Writer Assistant">
      <Stack space="medium">
        <header style={styles.header}>
          <h1 style={styles.title}>AC Writer Assistant</h1>
          <p style={styles.subtitle}>Generate acceptance criteria with AI</p>
        </header>
        
        {error && (
          <div 
            style={{...styles.message, ...styles.errorMessage}} 
            role="alert" 
            aria-live="assertive"
            tabIndex={-1}
          >
            {error}
          </div>
        )}
        {successMessage && (
          <div 
            style={{...styles.message, ...styles.successMessage}} 
            role="status" 
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}
      
        {issueData && (
          <section style={styles.issueInfo} aria-label="Issue information">
            <div><span style={styles.label}>Issue:</span> {issueData.summary}</div>
            <div><span style={styles.label}>Type:</span> {issueData.issueType}</div>
          </section>
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
        
        <Suspense fallback={<SkeletonLoader />}>
          <CriteriaDisplay
            criteria={generatedCriteria}
            onCopy={handleCopy}
            onApply={handleApply}
            onRegenerate={handleRegenerate}
            editable={true}
          />
        </Suspense>
      </Stack>
    </div>
  );
};

ForgeReconciler.render(<App />);
