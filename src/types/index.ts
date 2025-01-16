export interface Question {
  index: number;
  link: string;
  ans: string;
}

export interface Submission {
  時間戳記: string;
  您的員工編號: number;
  本題答案: string;
}

export interface Score {
  employeeId: number;
  points: number;
  timestamp: string;
}

export interface Stats {
  scores: Score[];
  totalSubmissions: number;
  correctSubmissions: number;
  averageScore: number;
  loaded: boolean;
}
