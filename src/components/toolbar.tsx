import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Color from './color';
import Stroke from './stroke';
import useDrawingStore from '../store';
import constants from '../drawing/constants';
import utils from '../drawing/utils';

const Toolbar = () => {
  const currentColor = useDrawingStore((state) => state.color);
  const currentStrokeWidth = useDrawingStore((state) => state.strokeWidth);
  const setStrokeWidth = useDrawingStore((state) => state.setStrokeWidth);
  const setColor = useDrawingStore((state) => state.setColor);
  const setStroke = useDrawingStore((state) => state.setStroke);
  const [showStrokes, setShowStrokes] = useState(false);

  const onStrokeChange = (stroke: number) => {
    setStrokeWidth(stroke);
    setShowStrokes(false);
    setStroke(utils.getPaint(stroke, currentColor));
  };

  const onChangeColor = (color: string) => {
    setColor(color);
    setStroke(utils.getPaint(currentStrokeWidth, color));
  };

  return (
    <>
      {showStrokes && (
        <View style={[styles.toolbar, styles.strokePicker]}>
          {constants.strokes.map((stroke) => (
            <Stroke
              key={stroke}
              stroke={stroke}
              onPress={() => onStrokeChange(stroke)}
            />
          ))}
        </View>
      )}

      <View style={[styles.toolbar, styles.mainToolbar]}>
        <View style={styles.strokeButtonWrapper}>
          <Stroke
            stroke={currentStrokeWidth}
            onPress={() => setShowStrokes(!showStrokes)}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.colorsRow}>
          {constants.colors.map((item) => (
            <Color key={item} color={item} onPress={() => onChangeColor(item)} />
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  strokePicker: {
    bottom: 80,
    position: 'absolute',
    zIndex: 100,
  },
  mainToolbar: {
    position: 'relative',
    marginVertical: 12,
  },
  strokeButtonWrapper: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  divider: {
    height: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  colorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

export default Toolbar;