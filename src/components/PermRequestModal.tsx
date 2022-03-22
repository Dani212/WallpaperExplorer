import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { width } from 'consts';
import { Text } from './Text';
import { Button } from './Button';
import { ImageLRefProps } from 'types';
import { pColor } from 'utils';
import { useTheme } from '@react-navigation/native';

type Props = {
	okayPress: () => void;
};

// eslint-disable-next-line react/display-name
export const PermRequestModal = forwardRef<ImageLRefProps, Props>(
	({ okayPress }, ref) => {
		const { dark } = useTheme();
		const [isOpen, setIsOpen] = useState(false);
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
				entering={FadeIn}
				exiting={FadeOut}
				style={styles.permRmodalContainer}
			>
				<View
					style={[
						styles.permRmodalContent,
						{ backgroundColor: pColor(dark).view },
					]}
				>
					<Text textSize="large" style={styles.permRmodalHeaderText}>
						Permission request
					</Text>

					<Text textSize="large" style={styles.permRmodalContentText}>
						Permission to access file and media has to be granted in other to
						download image to gallery. Click settings to go to settings
					</Text>
					<View style={styles.permRmodalBtnContainer}>
						{Platform.OS !== 'ios' && (
							<Button title={'Cancel'} onPress={close} />
						)}
						<Button title={'Settings'} onPress={okayPress} />
					</View>
				</View>
			</Animated.View>
		);
	}
);

const styles = StyleSheet.create({
	permRmodalContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.2)',
		...StyleSheet.absoluteFillObject,
	},
	permRmodalContent: {
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.8,
		borderRadius: 32,
		// height: 160,
	},
	permRmodalHeaderText: {
		marginVertical: 16,
	},
	permRmodalContentText: {
		marginVertical: 16,
		width: width * 0.7,
	},
	permRmodalBtnContainer: {
		justifyContent: Platform.OS !== 'ios' ? 'space-between' : 'center',
		flexDirection: 'row',
		alignItems: 'center',
		width: width * 0.7,
		marginVertical: 16,
	},
});
