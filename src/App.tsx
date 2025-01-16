import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronRight, Upload, Trophy, LineChart, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUploader } from './components/quiz/FileUploader';
import { QuizStats } from './components/quiz/QuizStats';
import { useQuizState } from './hooks/useQuizState';

const QuizApp: React.FC = () => {
  const {
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentStats,
    error,
    isLoading,
    showAnswer,
    setShowAnswer,
    calculateQuestionScores,
    setError,
    setIsLoading
  } = useQuizState();

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Statistics Dashboard</h1>
      
      {/* File Upload Section */}
      <FileUploader
        setQuestions={setQuestions}
        setError={setError}
        setIsLoading={setIsLoading}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Question Navigation */}
      {questions.length > 0 && (
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <Button
            onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Current Question Display */}
      {currentQuestion && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Question {currentQuestion.index}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Answer:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  {showAnswer ? currentQuestion.ans : 'Show Answer'}
                </Button>
              </div>
              <Button
                onClick={calculateQuestionScores}
                disabled={isLoading}
                className="w-full"
              >
                Calculate Scores
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Display */}
      {currentStats.loaded && (
        <QuizStats stats={currentStats} isLoading={isLoading} />
      )}
    </div>
  );
};

export default QuizApp;