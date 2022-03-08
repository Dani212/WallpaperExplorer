import React, { FC } from 'react';

import { useTheme } from '@react-navigation/native';

import {
	View,
	Pressable,
	Platform,
	ViewStyle,
	TextStyle,
	PressableProps,
} from 'react-native';

import { styles } from 'styles';

import { pColor } from 'utils';

import { Text } from './Text';

interface Props extends PressableProps {
	title: string;
	textStyle?: TextStyle;
	containerStyle?: ViewStyle;
	buttonColor?: string;
	btnTextColor?: string;
	disableRipple?: boolean;
	disabled?: boolean | undefined;
	// onPress?: () => void | undefined;
}

export const Button: FC<Props> = ({
	title,
	// onPress,
	containerStyle: conStyle,
	textStyle,
	buttonColor,
	btnTextColor,
	disableRipple,
	...otherProps
}) => {
	const { dark } = useTheme();
	const btnColor = buttonColor ? buttonColor : '#f4f4';

	return (
		<View style={[styles.buttonContainer, conStyle]}>
			<Pressable
				android_ripple={{
					borderless: true,
					color: disableRipple ? 'transparent' : pColor(dark).pressed,
				}}
				style={({ pressed }) => [
					{
						...Platform.select({
							ios: {
								backgroundColor: pressed ? pColor(dark).pressed : btnColor,
							},
							default: {
								backgroundColor: btnColor,
							},
						}),
					},
					styles.button,
				]}
				{...otherProps}
			>
				<Text
					style={[
						{ color: btnTextColor ? btnTextColor : '#ffffff' },
						textStyle,
					]}
				>
					{title}
				</Text>
			</Pressable>
		</View>
	);
};
