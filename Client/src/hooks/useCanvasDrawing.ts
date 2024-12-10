import { useState, useCallback } from 'react';
import type { Point, DrawingPath } from '../types/annotation';

interface UseCanvasDrawingProps {
  initialPaths: DrawingPath[];
  onPathsChange: (paths: DrawingPath[]) => void;
}

export function useCanvasDrawing({ initialPaths, onPathsChange }: UseCanvasDrawingProps) {
  const [paths, setPaths] = useState<DrawingPath[]>(initialPaths);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    const newPath: DrawingPath = {
      id: Date.now().toString(),
      points: [point],
      color: '#FF0000', // Default red color
    };
    setCurrentPath(newPath);
  }, []);

  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !currentPath) return;
    
    setCurrentPath(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, point],
      };
    });
  }, [isDrawing, currentPath]);

  const endDrawing = useCallback(() => {
    if (currentPath) {
      const newPaths = [...paths, currentPath];
      setPaths(newPaths);
      onPathsChange(newPaths);
    }
    setCurrentPath(null);
    setIsDrawing(false);
  }, [currentPath, paths, onPathsChange]);

  return {
    paths,
    currentPath,
    isDrawing,
    startDrawing,
    continueDrawing,
    endDrawing,
  };
}