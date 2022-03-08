import React, { FC, useRef } from 'react';

import { Image, ViewStyle, StyleSheet, Pressable } from 'react-native';

import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

import { useTheme } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import { pColor } from 'utils';

import { ImageLRefProps } from 'types';

import { ImageLoading, Pressable as CustomPressable } from 'components';

import { savedStyles } from 'styles';

type Props = {
	image: string;
	color: string;
	onSavePress: () => void;
	containerStyle: ViewStyle;
	containerPressed: () => void;
};

export const SaveImageItems: FC<Props> = ({
	image,
	color,
	onSavePress,
	containerStyle,
	containerPressed,
}) => {
	const { dark } = useTheme();

	const imageRef = useRef<ImageLRefProps>(null);

	return (
		<Animated.View
			entering={FadeIn}
			exiting={FadeOut}
			layout={Layout.springify()}
		>
			<Pressable
				style={[
					savedStyles.siItemsContainer,
					{ backgroundColor: color, zIndex: 100 },
					containerStyle,
				]}
				onPress={containerPressed}
			>
				<ImageLoading
					ref={imageRef}
					containerStyle={{ ...StyleSheet.absoluteFillObject }}
				/>

				<Image
					source={{ uri: image }}
					onLoadStart={() => imageRef.current?.open()}
					onLoadEnd={() => imageRef.current?.close()}
					style={{
						flex: 1,
					}}
				/>

				<CustomPressable
					ripple_raduis={16}
					onPress={onSavePress}
					style={savedStyles.siItemIconContainer}
				>
					<Ionicons
						size={20}
						style={{}}
						name={'bookmark'}
						color={pColor(dark).text}
					/>
				</CustomPressable>
			</Pressable>
		</Animated.View>
	);
};
