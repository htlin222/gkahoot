import { useState } from 'react';
import { Question, Stats, Submission } from '../types';
import { useCSVFetcher } from './useCSVFetcher';

export const useQuizState = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStats, setCurrentStats] = useState<Stats>({
    scores: [],
    totalSubmissions: 0,
    correctSubmissions: 0,
    averageScore: 0,
    loaded: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const { fetchCSVFromURL } = useCSVFetcher();

  const calculateQuestionScores = async () => {
    setIsLoading(true);
    setError(null);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      setError('No question selected');
      setIsLoading(false);
      return;
    }

    try {
      const submissions = await fetchCSVFromURL(currentQuestion.link);
      
      if (!Array.isArray(submissions) || submissions.length === 0) {
        throw new Error('No valid submissions found in the response');
      }

      const correctSubmissions = submissions
        .filter(sub => {
          if (!sub['時間戳記'] || !sub['您的員工編號'] || !sub['本題答案']) {
            console.warn('Invalid submission data:', sub);
            return false;
          }
          return sub['本題答案'] === currentQuestion.ans;
        })
        .sort((a, b) => new Date(a['時間戳記']).getTime() - new Date(b['時間戳記']).getTime());

      const scores = correctSubmissions.map((submission, index) => ({
        employeeId: submission['您的員工編號'],
        points: Math.max(130 - index * 2, 100),
        timestamp: submission['時間戳記']
      }));

      setCurrentStats({
        scores,
        totalSubmissions: submissions.length,
        correctSubmissions: correctSubmissions.length,
        averageScore: scores.length > 0 
          ? scores.reduce((acc, curr) => acc + curr.points, 0) / scores.length 
          : 0,
        loaded: true
      });
    } catch (error) {
      setError(`Failed to process submissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCurrentStats({
        scores: [],
        totalSubmissions: 0,
        correctSubmissions: 0,
        averageScore: 0,
        loaded: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentStats,
    error,
    setError,
    isLoading,
    setIsLoading,
    showAnswer,
    setShowAnswer,
    calculateQuestionScores
  };
};
