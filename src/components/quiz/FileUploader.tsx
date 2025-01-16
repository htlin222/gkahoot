import React from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Question } from '../../types';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  setQuestions: (questions: Question[]) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentQuestionIndex: (index: number) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  setQuestions,
  setError,
  setIsLoading,
  setCurrentQuestionIndex,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setIsLoading(true);

    if (!file) {
      setError('Please select a file');
      setIsLoading(false);
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setIsLoading(false);
      return;
    }

    Papa.parse<Record<string, string>>(file, {
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error('CSV file is empty');
          }

          const parsedQuestions = results.data
            .filter(row => row.index && row.link && row.ans)
            .map(row => ({
              index: parseInt(row.index),
              link: row.link.trim(),
              ans: row.ans.trim().toUpperCase()
            }))
            .sort((a, b) => a.index - b.index);

          if (parsedQuestions.length === 0) {
            throw new Error('No valid questions found in the CSV file');
          }
          
          setQuestions(parsedQuestions);
          setCurrentQuestionIndex(0);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
        } finally {
          setIsLoading(false);
        }
      },
      error: (error) => {
        setError(`Failed to parse CSV file: ${error.message}`);
        setIsLoading(false);
      },
      header: true,
      skipEmptyLines: true
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" className="w-full" asChild>
        <label className="cursor-pointer flex items-center justify-center gap-2">
          <Upload size={16} />
          Upload Question List
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </Button>
    </div>
  );
};
