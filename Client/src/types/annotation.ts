export interface Point {
    x: number;
    y: number;
  }
  
  export interface DrawingPath {
    id: string;
    points: Point[];
    color: string;
  }
  
  export interface CanvasData {
    imageUrl: string;
    paths: DrawingPath[];
  }
  
  export interface AnnotationData {
    canvases: Record<string, CanvasData>;
  }