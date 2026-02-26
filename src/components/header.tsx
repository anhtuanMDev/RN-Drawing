import { makeImageFromView } from '@shopify/react-native-skia';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import history from '../drawing/history';
import utils from '../drawing/utils';
import useDrawingStore from '../store';
const Header = ({ canvasRef }: { canvasRef: React.RefObject<null> }) => {
  const reset = () => {
    useDrawingStore.getState().setCompletedPaths([]);
    useDrawingStore.getState().setStroke(utils.getPaint(4, '#000000'));
    useDrawingStore.getState().setColor('#000000');
    useDrawingStore.getState().setStrokeWidth(4);
    history.clear();
  };

  const save = async () => {
    const canvasInfo = useDrawingStore.getState().canvasInfo;
    const paths = useDrawingStore.getState().completedPaths;

    if (paths.length === 0) {
      Alert.alert('Nothing to save', 'Draw something first!');
      return;
    }

    if (!canvasRef.current) {
      Alert.alert('Error', 'Canvas reference is not available.');
      return;
    }

    if (canvasInfo?.width && canvasInfo?.height) {
      try {
        const snapshot = await makeImageFromView(canvasRef);
        if (!snapshot) {
          Alert.alert('Error', 'Failed to capture canvas snapshot.');
          return;
        }
        const base64 = snapshot.encodeToBase64();

        const path = `${
          ReactNativeBlobUtil.fs.dirs.CacheDir
        }/drawing_${Date.now()}.png`;

        await ReactNativeBlobUtil.fs.writeFile(path, base64, 'base64');

        await utils.savePicture(`file://${path}`);
        Alert.alert('Success', 'Image has been saved.');
      } catch (error) {
        console.error('Snapshot failed:', error);
        Alert.alert('Error', 'Could not take snapshot of the canvas.');
      }
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => history.undo()}
          style={[styles.button, styles.spaceRight]}
        >
          <Text style={styles.buttonText}>↩ Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => history.redo()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>↪ Redo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={reset}
          style={[styles.button, styles.spaceRight]}
        >
          <Text style={[styles.buttonText, styles.resetColor]}>✕ Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={save}
          style={[styles.button, styles.saveButton]}
        >
          <Text style={[styles.buttonText, styles.saveColor]}>⬇ Save SVG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 54,
    width: '100%',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#0066FF',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  spaceRight: {
    marginRight: 8,
  },
  resetColor: { color: '#CC0000' },
  saveColor: { color: '#fff' },
});

export default Header;
