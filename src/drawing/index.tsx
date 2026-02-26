import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import React, { useCallback, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import useDrawingStore, { CurrentPath } from '../store';
import Header from '../components/header';
import Toolbar from '../components/toolbar';
import history from './history';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const Drawing = () => {
  const currentPath = useRef<CurrentPath | null>(null);
  const { width } = useWindowDimensions();
  const canvasRef = useRef(null);

  const completedPaths = useDrawingStore(state => state.completedPaths);
  const setCompletedPaths = useDrawingStore(state => state.setCompletedPaths);
  const stroke = useDrawingStore(state => state.stroke);

  const [canvasHeight, setCanvasHeight] = useState(400);
  const [activePath, setActivePath] = useState<CurrentPath | null>(null);
  const { bottom } = useSafeAreaInsets();

  const onLayout = (event: LayoutChangeEvent) => {
    const { height, width: w } = event.nativeEvent.layout;
    setCanvasHeight(height - bottom);
    useDrawingStore.getState().setCanvasInfo({ width: w, height });
  };

  const updatePaths = useCallback(() => {
    if (!currentPath.current) return;

    const newPath: CurrentPath = {
      path: currentPath.current.path.copy(),
      paint: currentPath.current.paint.copy(),
      color: useDrawingStore.getState().color,
    };

    const updatedPaths = [
      ...useDrawingStore.getState().completedPaths,
      newPath,
    ];

    history.push(newPath);
    setCompletedPaths(updatedPaths);
  }, [setCompletedPaths]);

  const drawGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onBegin(({ x, y }) => {
      const path = Skia.Path.Make();
      path.moveTo(x, y);

      currentPath.current = {
        path,
        paint: stroke.copy(),
        color: useDrawingStore.getState().color,
      };

      setActivePath({
        path: currentPath.current.path.copy(),
        paint: currentPath.current.paint,
        color: currentPath.current.color,
      });
    })
    .onUpdate(({ x, y }) => {
      if (!currentPath.current?.path) return;
      currentPath.current.path.lineTo(x, y);

      setActivePath({
        path: currentPath.current.path.copy(),
        paint: currentPath.current.paint,
        color: currentPath.current.color,
      });
    })
    .onFinalize(() => {
      updatePaths();
      currentPath.current = null;
      setActivePath(null);
    });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.wrapper}>
        <Header canvasRef={canvasRef} />

        <GestureDetector gesture={drawGesture}>
          <View
            ref={canvasRef}
            onLayout={onLayout}
            style={[styles.canvas, { width: width - 24 }]}
          >
            <Canvas style={{ height: canvasHeight, width: width - 24 }}>
              {completedPaths.map((p, index) => (
                <Path key={index} path={p.path} paint={p.paint} />
              ))}
              {activePath && (
                <Path path={activePath.path} paint={activePath.paint} />
              )}
            </Canvas>
          </View>
        </GestureDetector>

        <Toolbar />
      </View>
    </SafeAreaView>
  );
};

export default Drawing;

const styles = StyleSheet.create({
  container: { flex: 1 },
  wrapper: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    alignItems: 'center',
  },

  canvas: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
