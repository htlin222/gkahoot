import { useState } from 'react';
import { Question, Stats } from '../types';
import { useCSVFetcher } from './useCSVFetcher';

const initialStats: Stats = {
  scores: [],
  totalSubmissions: 0,
  correctSubmissions: 0,
  averageScore: 0,
  loaded: false
};

export const useQuizState = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStats, setQuestionStats] = useState<Map<number, Stats>>(new Map());
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

      // Filter out duplicate employee IDs, keeping only the first submission
      const seenEmployeeIds = new Set<string>();
      const uniqueCorrectSubmissions = correctSubmissions.filter(sub => {
        const empId = sub['您的員工編號'].toString();
        if (seenEmployeeIds.has(empId)) {
          return false;
        }
        seenEmployeeIds.add(empId);
        return true;
      });

      const scores = uniqueCorrectSubmissions.map((submission, index) => ({
        employeeId: submission['您的員工編號'].toString(),
        points: Math.max(130 - index * 2, 100),
        timestamp: submission['時間戳記']
      }));

      const newStats: Stats = {
        scores,
        totalSubmissions: submissions.length,
        correctSubmissions: uniqueCorrectSubmissions.length,
        averageScore: scores.length > 0 
          ? scores.reduce((acc, curr) => acc + curr.points, 0) / scores.length 
          : 0,
        loaded: true
      };

      setQuestionStats(prev => {
        const newMap = new Map(prev);
        newMap.set(currentQuestion.index, newStats);
        return newMap;
      });
    } catch (error) {
      setError(`Failed to process submissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStats = (): Stats => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return initialStats;
    return questionStats.get(currentQuestion.index) || initialStats;
  };

  const calculateTotalRankings = () => {
    const totalScores = new Map<string, number>();
    
    // Aggregate scores from all questions
    questionStats.forEach((stats) => {
      stats.scores.forEach((score) => {
        const currentTotal = totalScores.get(score.employeeId) || 0;
        totalScores.set(score.employeeId, currentTotal + score.points);
      });
    });

    // Convert to array and sort by total score
    const rankings = Array.from(totalScores.entries())
      .map(([employeeId, totalPoints]) => ({
        employeeId,
        totalPoints
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return rankings;
  };

  return {
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentStats: getCurrentStats(),
    error,
    setError,
    isLoading,
    setIsLoading,
    showAnswer,
    setShowAnswer,
    calculateQuestionScores,
    calculateTotalRankings
  };
};
