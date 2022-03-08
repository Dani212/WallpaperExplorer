import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { useTheme } from '@react-navigation/native';

import { View, ActivityIndicator, ViewStyle } from 'react-native';

import { ImageLRefProps } from 'types';
import { pColor } from 'utils';

type Props = {
	containerStyle?: ViewStyle;
};

// eslint-disable-next-line react/display-name
export const ImageLoading = forwardRef<ImageLRefProps, Props>(
	({ containerStyle }, ref) => {
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
			<View
				style={[
					{
						// height, width,
						justifyContent: 'center',
						alignItems: 'center',
					},
					containerStyle,
				]}
			>
				<ActivityIndicator color={pColor(dark).text} size="large" />
			</View>
		);
	}
);
