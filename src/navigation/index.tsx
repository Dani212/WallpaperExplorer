/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import Colors from 'consts/Colors';
import useColorScheme from 'hooks/useColorScheme';
import ImageScreen from 'screens/ImageScreen';
import NotFoundScreen from 'screens/NotFoundScreen';
import HomeScreen from 'screens/Home';
import SaveImageScreen from 'screens/SaveImage';
import { RootStackParamList, RootTabParamList } from 'types';
import LinkingConfiguration from './LinkingConfiguration';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchSaveImageData } from 'reduxStore/reducer';

export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchSaveImageData('saveItem'));
	}, []);

	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<RootNavigator />
		</NavigationContainer>
	);
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Root"
				component={BottomTabNavigator}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!' }}
			/>
			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen
					name="ImageScreen"
					component={ImageScreen}
					options={{ headerShown: false }}
				/>
			</Stack.Group>
		</Stack.Navigator>
	);
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
	const colorScheme = useColorScheme();

	return (
		<BottomTab.Navigator
			initialRouteName="HomeTab"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme].tint,
			}}
		>
			<BottomTab.Screen
				name="HomeTab"
				component={HomeScreen}
				options={() => ({
					title: 'Tab One',
					headerShown: false,
					tabBarStyle: { display: 'none' },
				})}
			/>
			<BottomTab.Screen
				name="SavedImageTab"
				component={SaveImageScreen}
				options={{
					tabBarStyle: { display: 'none' },
					title: 'Saved Images',
				}}
			/>
		</BottomTab.Navigator>
	);
}
