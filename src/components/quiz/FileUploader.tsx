import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Question } from '../../types';
import { Upload, Download, Check, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useExplainImages } from '@/hooks/useExplainImages';

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
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const explainImages = useExplainImages();

  useEffect(() => {
    if (downloadSuccess) {
      const timer = setTimeout(() => {
        setDownloadSuccess(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [downloadSuccess]);

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

  const handleDownloadTemplate = () => {
    const headers = ['index', 'link', 'ans'];
    const sampleData = ['1', 'https://example.com/image=csv', 'A'];
    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quiz_template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    setDownloadSuccess(true);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => document.getElementById('file-upload')?.click()}
        className="relative hover:bg-gray-100"
      >
        <Upload className="h-4 w-4 mr-2" />
        {filename ? filename : '上傳問題清單'}
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="mr-2"
            >
              {downloadSuccess ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {downloadSuccess ? '已下載' : '下載範本'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>下載 CSV 範本檔案，包含問題索引、線上csv連結和答案欄位</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            說明
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80%] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>如何使用</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-grow">
            <Carousel 
              className="w-full h-[70vh]"
              opts={{
                align: "center",
                loop: true,
                dragFree: true,
                containScroll: "trimSnaps"
              }}
            >
              <CarouselContent className="cursor-grab active:cursor-grabbing h-full">
                {explainImages.length > 0 ? (
                  explainImages.map((image, index) => (
                    <CarouselItem key={index} className="basis-full h-full pt-0">
                      <div className="h-full w-full flex items-center justify-center">
                        <img 
                          src={`/explain/${image}`} 
                          alt={`Step ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                          draggable="false"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="basis-full h-full pt-0">
                    <div className="h-full w-full flex items-center justify-center text-gray-500">
                      No explanation images found
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>

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
