import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import useDrawingStore from '../store';

type ColorProps = {
  color: string;
  onPress: () => void;
};

const Color = ({ color, onPress }: ColorProps) => {
  const currentColor = useDrawingStore((state) => state.color);
  const isSelected = currentColor === color;

  const borderColor = isSelected
    ? '#555'
    : color === '#FFFFFF'
    ? '#ccc'
    : color;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.color,
        isSelected && styles.selected,
        {
          backgroundColor: color,
          borderColor: borderColor,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  color: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginHorizontal: 4,
    borderWidth: 1.5,
    transform: [{ scale: 1 }],
  },
  selected: {
    borderWidth: 3,
    transform: [{ scale: 1.2 }],
  },
});

export default Color;