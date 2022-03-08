import React from 'react';

import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from 'hooks/useCachedResources';
import useColorScheme from 'hooks/useColorScheme';
import Navigation from 'navigation';

import { store } from 'reduxStore/store';

export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<Provider store={store}>
				<SafeAreaProvider>
					<Navigation colorScheme={colorScheme} />
					<StatusBar />
				</SafeAreaProvider>
			</Provider>
		);
	}
}
