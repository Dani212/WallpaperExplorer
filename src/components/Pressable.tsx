/**
 * @description This component was created to add custom androiod ripple color
 */

import {
	Platform,
	Pressable as DefaultPressable,
	PressableProps,
	StyleProp,
	ViewStyle,
} from 'react-native';
import React, { FC } from 'react';
import { pColor } from 'utils';
import { useTheme } from '@react-navigation/native';

interface Props extends PressableProps {
	ripple_raduis?: number;
	ripple_color?: string;
	style?: StyleProp<ViewStyle>;
}

export const Pressable: FC<Props> = ({
	ripple_raduis,
	ripple_color,
	style,
	...otherProps
}) => {
	const { dark } = useTheme();
	return (
		<DefaultPressable
			android_ripple={{
				borderless: !true,
				color: ripple_color ? ripple_color : pColor(dark).pressed,
				radius: ripple_raduis,
			}}
			style={({ pressed }) => [
				style,
				pressed && {
					...Platform.select({
						ios: {
							backgroundColor: pressed ? pColor(dark).pressed : undefined,
						},
					}),

					paddingVertical: 10,
				},
			]}
			{...otherProps}
		/>
	);
};
