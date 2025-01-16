import { useEffect, useState } from 'react';

/**
 * Hook to manage explanation images for the quiz interface
 * 
 * Instructions for adding new explanation images:
 * 1. Place your PNG image files in the '/public/explain/' directory
 * 2. Name your files with a 'stepX.png' format where X is the step number (e.g., step1.png, step2.png)
 * 3. Add the filename to the imageFiles array below in the order you want them to appear
 * 
 * File Location: /public/explain/
 * Naming Convention: stepX.png (where X is the step number)
 * Supported Format: PNG files only
 * 
 * Example:
 * public/
 *   explain/
 *     step1.png  - First step
 *     step2.png  - Second step
 *     step3.png  - Third step
 */
export const useExplainImages = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Add your image filenames here in the order you want them to appear
    const imageFiles = [
      'step1.png',  // First step
      'step2.png',  // Second step
      'step3.png'   // Third step
    ];
    setImages(imageFiles);
  }, []);

  return images;
};
