import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawing from './src/drawing';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Drawing />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
