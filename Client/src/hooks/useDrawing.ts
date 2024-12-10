import { useState, useCallback } from 'react';
import type { Point, DrawingPath } from '../types/annotation';

export function useDrawing(paths: DrawingPath[], onPathsChange: (paths: DrawingPath[]) => void) {
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);

  const startDrawing = useCallback((point: Point) => {
    const newPath: DrawingPath = {
      id: Date.now().toString(),
      points: [point],
      color: '#FF0000', // Default red color
    };
    setCurrentPath(newPath);
  }, []);

  const continueDrawing = useCallback((point: Point) => {
    if (!currentPath) return;
    
    setCurrentPath(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, point],
      };
    });
  }, [currentPath]);

  const endDrawing = useCallback(() => {
    if (currentPath) {
      onPathsChange([...paths, currentPath]);
      setCurrentPath(null);
    }
  }, [currentPath, paths, onPathsChange]);

  return {
    currentPath,
    startDrawing,
    continueDrawing,
    endDrawing,
  };
}