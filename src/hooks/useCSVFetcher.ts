import Papa from 'papaparse';
import { Submission } from '../types';

export const useCSVFetcher = () => {
  const fetchCSVFromURL = async (url: string): Promise<Submission[]> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const submissions = results.data
              .filter((row: any) => 
                row['時間戳記'] && 
                row['您的員工編號'] && 
                row['本題答案']
              )
              .map((row: any) => ({
                時間戳記: row['時間戳記'],
                您的員工編號: parseInt(row['您的員工編號']),
                本題答案: row['本題答案'].trim().toUpperCase()
              }));
            resolve(submissions);
          },
          error: (error) => {
            reject(new Error(`Failed to parse CSV data: ${error.message}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to fetch or parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return { fetchCSVFromURL };
};
