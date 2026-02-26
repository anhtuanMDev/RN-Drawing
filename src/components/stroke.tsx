    import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

type StrokeProps = {
  stroke: number;
  onPress: () => void;
};

const Stroke = ({ stroke, onPress }: StrokeProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View
        style={[
          styles.stroke,
          {
            height: Math.min(stroke, 20),
            borderRadius: stroke / 2,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stroke: {
    width: 28,
    backgroundColor: '#222',
  },
});

export default Stroke;