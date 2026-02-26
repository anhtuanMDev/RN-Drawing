import { create } from 'zustand';
import { SkPaint, SkPath } from '@shopify/react-native-skia';
import utils from '../drawing/utils';

export type CurrentPath = {
  path: SkPath;
  paint: SkPaint;
  color: string;
};

interface DrawingStore {
  completedPaths: CurrentPath[];
  setCompletedPaths: (paths: CurrentPath[]) => void;

  stroke: SkPaint;
  strokeWidth: number;
  color: string;

  setStrokeWidth: (width: number) => void;
  setColor: (color: string) => void;
  setStroke: (stroke: SkPaint) => void;

  canvasInfo: { width: number; height: number } | null;
  setCanvasInfo: (info: { width: number; height: number }) => void;
}

const useDrawingStore = create<DrawingStore>((set) => ({
  completedPaths: [],
  setCompletedPaths: (completedPaths) => set({ completedPaths }),

  stroke: utils.getPaint(4, '#000000'),
  strokeWidth: 4,
  color: '#000000',

  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setColor: (color) => set({ color }),
  setStroke: (stroke) => set({ stroke }),

  canvasInfo: null,
  setCanvasInfo: (canvasInfo) => set({ canvasInfo }),
}));

export default useDrawingStore;