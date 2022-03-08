import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { View, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
	NavigationProp,
	useNavigation,
	useTheme,
} from '@react-navigation/native';

import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { Pressable } from './Pressable';

import { pColor } from 'utils';
import { width } from 'consts';
import { ImageLRefProps, RootTabParamList } from 'types';

type Props = {
	screen?: 'save';
	homePressed?: () => void;
	savePressed?: () => void;
};

const styles = StyleSheet.create({
	bottomTabContainer: {
		position: 'absolute',
		flexDirection: 'row',
		height: 55,
		bottom: 1,
		width,
	},
	bottomTabBarSection: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomTabBarIconContainer: {
		width: 50,
		height: 50,
		borderRadius: 360,
		backgroundColor: '#222',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

// eslint-disable-next-line react/display-name
export const BottomTabBar = forwardRef<ImageLRefProps, Props>(
	({ screen, homePressed, savePressed }, ref) => {
		const { dark } = useTheme();

		const [isOpen, setIsOpen] = useState(true);

		const { navigate } = useNavigation<NavigationProp<RootTabParamList>>();

		const home = () => {
			homePressed && homePressed();
			navigate('HomeTab');
		};

		const save = () => {
			savePressed && savePressed();
			navigate('SavedImageTab');
		};
		const open = () => {
			setIsOpen(true);
		};

		const close = () => {
			setIsOpen(false);
		};

		useImperativeHandle(
			ref,
			() => ({
				open,
				close,
			}),
			[]
		);

		if (!isOpen) return null;

		return (
			<Animated.View
				entering={SlideInDown}
				exiting={SlideOutDown}
				style={styles.bottomTabContainer}
			>
				<View style={styles.bottomTabBarSection}>
					<Pressable
						ripple_raduis={24}
						onPress={home}
						style={[
							styles.bottomTabBarIconContainer,
							{ backgroundColor: pColor(dark).view },
						]}
					>
						<Ionicons
							color={pColor(dark).text}
							size={24}
							name={screen ? 'home-outline' : 'home'}
						/>
					</Pressable>
				</View>

				<View style={styles.bottomTabBarSection}>
					<Pressable
						ripple_raduis={24}
						onPress={save}
						style={[
							styles.bottomTabBarIconContainer,
							{ backgroundColor: pColor(dark).view },
						]}
					>
						<Ionicons
							size={24}
							color={pColor(dark).text}
							name={screen === 'save' ? 'bookmark' : 'bookmark-outline'}
						/>
					</Pressable>
				</View>
			</Animated.View>
		);
	}
);
