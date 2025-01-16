import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronRight, Upload, Trophy, LineChart, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
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
    setIsLoading,
    calculateTotalRankings
  } = useQuizState();

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">用Google Form 做成的 Kahoot</h1>
      
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
            onClick={() => {
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
              setShowAnswer(false);
            }}
            disabled={currentQuestionIndex === 0}
          >
            回到上一題
          </Button>
          <span>
            第 {currentQuestionIndex + 1} 題，共 {questions.length} 題
          </span>
          <Button
            onClick={() => {
              setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1));
              setShowAnswer(false);
            }}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            看看下一題
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Trophy className="h-4 w-4 mr-2" />
                顯示總排名
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>總分排行榜 (前10名)</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-4">
                <div className="space-y-2">
                  {calculateTotalRankings().slice(0, 10).map((ranking, index) => (
                    <div
                      key={ranking.employeeId}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold min-w-[24px]">#{index + 1}</span>
                        <span>{ranking.employeeId}</span>
                      </div>
                      <span className="font-semibold text-primary">
                        {ranking.totalPoints} 分
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Current Question Display */}
      {currentQuestion && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>第 {currentQuestion.index} 題</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">正確答案：</span>
                <Button
                  variant={showAnswer ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={`min-w-[100px] transition-all duration-300 ${
                    showAnswer ? 'bg-green-500/10 text-green-600 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-green-500/20 hover:text-green-700' : ''
                  }`}
                >
                  {showAnswer ? currentQuestion.ans : '顯示答案'}
                </Button>
                <Button
                  onClick={calculateQuestionScores}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                  className="text-sm px-3 py-1 h-8"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      計算中...稍安勿躁
                    </>
                  ) : (
                    '統計本題答題狀況'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Display */}
      {currentStats.loaded && (
        <QuizStats stats={currentStats} isLoading={isLoading} />
      )}
      <div className="text-center text-sm text-gray-500 mt-8">
        Ⓒ林協霆 made with ❤️
      </div>
    </div>
  );
};

export default QuizApp;