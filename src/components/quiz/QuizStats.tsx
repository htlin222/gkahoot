import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { Stats } from '../../types';

interface QuizStatsProps {
  stats: Stats;
  isLoading: boolean;
}

export const QuizStats: React.FC<QuizStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return <div>載入統計資料中...</div>;
  }

  const top10Scores = stats.scores.slice(0, 10);

  const formatTime = (timestamp: string) => {
    // Assuming timestamp is in format "yyyy/m/d 上午/下午 h:mm:ss"
    try {
      const [datePart, ampm, timePart] = timestamp.split(' ');
      const [year, month, day] = datePart.split('/');
      const [hour, minute, second] = timePart.split(':');
      
      let hourNum = parseInt(hour);
      if (ampm === '下午' && hourNum !== 12) {
        hourNum += 12;
      } else if (ampm === '上午' && hourNum === 12) {
        hourNum = 0;
      }
      
      return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')} ${hourNum.toString().padStart(2, '0')}:${minute}:${second}`;
    } catch (error) {
      console.error('Error parsing timestamp:', timestamp);
      return timestamp;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Card className="flex-1 min-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總提交次數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">正確提交次數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.correctSubmissions}</div>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">正確率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSubmissions > 0
                ? ((stats.correctSubmissions / stats.totalSubmissions) * 100).toFixed(1)
                : '0'}%
            </div>
          </CardContent>
        </Card>
      </div>

      {top10Scores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top 10 排行榜
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">排名</TableHead>
                  <TableHead>員工編號</TableHead>
                  <TableHead>分數</TableHead>
                  <TableHead>時間</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top10Scores.map((score, index) => (
                  <TableRow key={score.employeeId}>
                    <TableCell className="font-medium">
                      {index === 0 ? '🥇 1' : 
                       index === 1 ? '🥈 2' : 
                       index === 2 ? '🥉 3' : 
                       index + 1}
                    </TableCell>
                    <TableCell>{score.employeeId}</TableCell>
                    <TableCell>{score.points}</TableCell>
                    <TableCell>{formatTime(score.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
