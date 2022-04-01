/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */

import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { ColorSchemeName } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import LinkingConfiguration from './LinkingConfiguration';
import useColorScheme from 'hooks/useColorScheme';
import Colors from 'consts/Colors';

import ImagePreviewScreen from 'screens/ImagePreview';
import NotFoundScreen from 'screens/NotFoundScreen';
import SaveImageScreen from 'screens/SaveImage';
import ImageScreen from 'screens/ImageScreen';
import HomeScreen from 'screens/Home';

import { fetchSaveImageData } from 'reduxStore/reducer';
import {
	HomeStackParamList,
	RootStackParamList,
	RootTabParamList,
} from 'types';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { StackNavigationOptions } from '@react-navigation/stack';

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
				component={HomeStackNavigation}
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

const HomeStack = createSharedElementStackNavigator<HomeStackParamList>();
const options: StackNavigationOptions = {
	headerShown: false,
	headerBackTitleVisible: false,
	cardStyleInterpolator: ({ current: { progress } }) => {
		return {
			cardStyle: {
				opacity: progress,
			},
		};
	},
};
function HomeStackNavigation() {
	return (
		<HomeStack.Navigator
			// initialRouteName="ImagePreviewScreen"
			screenOptions={{ headerShown: false }}
		>
			<HomeStack.Screen name="HomeScreen" component={HomeScreen} />

			<HomeStack.Screen
				name="ImagePreviewScreen"
				component={ImagePreviewScreen}
				options={options}
				sharedElements={(route, otherRoute, showing) => {
					const { id } = route.params;
					if (otherRoute.name === 'HomeScreen' && showing) {
						return [
							{
								align: 'center-center',
								id: `item.${id}.photo`,
								animation: 'move',
								resize: 'none',
							},
						];
					}
				}}
			/>
		</HomeStack.Navigator>
	);
}
