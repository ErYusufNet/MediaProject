import React, { useRef, useEffect, useState } from 'react';
import type { Point, DrawingPath, CanvasData } from '../types/annotation';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';

interface CanvasProps {
    imageUrl: string;
    data?: CanvasData;
    onChange: (data: CanvasData) => void;
}

export function Canvas({ imageUrl, data, onChange }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const {
        paths,
        currentPath,
        isDrawing,
        startDrawing,
        continueDrawing,
        endDrawing
    } = useCanvasDrawing({
        initialPaths: data?.paths || [],
        onPathsChange: (newPaths) => {
            onChange({
                imageUrl,
                paths: newPaths
            });
        }
    });

    useEffect(() => {
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            setCanvasSize({ width: image.width, height: image.height });
            setImageLoaded(true);
        };
    }, [imageUrl]);

    useEffect(() => {
        if (!canvasRef.current || !imageLoaded) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawCanvas = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw image
            const image = new Image();
            image.src = imageUrl;
            ctx.drawImage(image, 0, 0);

            // Draw all completed paths
            paths.forEach(path => {
                if (path.points.length < 2) return;

                ctx.beginPath();
                ctx.strokeStyle = path.color;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                ctx.moveTo(path.points[0].x, path.points[0].y);
                path.points.slice(1).forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            });

            // Draw current path
            if (currentPath && currentPath.points.length > 0) {
                ctx.beginPath();
                ctx.strokeStyle = currentPath.color;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                ctx.moveTo(currentPath.points[0].x, currentPath.points[0].y);
                currentPath.points.slice(1).forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            }
        };

        drawCanvas();
    }, [paths, currentPath, imageLoaded, imageUrl]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const point: Point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        startDrawing(point);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const point: Point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        continueDrawing(point);
    };

    return (
        <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            className="border border-gray-300 cursor-crosshair"
        />
    );
}