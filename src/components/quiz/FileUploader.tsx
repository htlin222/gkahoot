import React, { useState } from 'react';
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
  const [filename, setFilename] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setIsLoading(true);

    if (!file) {
      setError('請選擇檔案');
      setIsLoading(false);
      setFilename(null);
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setError('請上傳 CSV 檔案');
      setIsLoading(false);
      setFilename(null);
      return;
    }

    setFilename(file.name);

    Papa.parse<Record<string, string>>(file, {
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error('CSV 檔案是空的');
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
            throw new Error('在 CSV 檔案中找不到有效的問題');
          }
          
          setQuestions(parsedQuestions);
          setCurrentQuestionIndex(0);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'CSV 檔案解析失敗');
        } finally {
          setIsLoading(false);
        }
      },
      error: (error) => {
        setError(`CSV 檔案解析失敗：${error.message}`);
        setIsLoading(false);
      },
      header: true,
      skipEmptyLines: true
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => document.getElementById('file-upload')?.click()}
        className="relative"
      >
        <Upload className="h-4 w-4 mr-2" />
        {filename ? filename : '上傳問題列表'}
      </Button>
      <input
        type="file"
        id="file-upload"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
