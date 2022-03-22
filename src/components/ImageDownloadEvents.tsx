import React, { FC } from 'react';

import { useTheme } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Text } from 'components/Text';

import { Pressable } from 'components/Pressable';
import { Button } from 'components/Button';
import { pColor } from 'utils';
import { width } from 'consts';

type Props = {
	close: () => void;
	isLoading: boolean;
	downloadFailed: boolean;
	onBtnPress?: () => void;
};

export const ImageDownLoadEvents: FC<Props> = ({
	close,
	isLoading,
	onBtnPress,
	downloadFailed,
}) => {
	const { dark } = useTheme();

	return isLoading || downloadFailed ? (
		<Animated.View
			entering={FadeIn}
			exiting={FadeOut}
			style={{
				backgroundColor: pColor(dark).modalBg,
				...StyleSheet.absoluteFillObject,
				justifyContent: 'center',
				alignItems: 'center',
				position: 'absolute',
			}}
		>
			<Pressable style={{ ...StyleSheet.absoluteFillObject }} onPress={close} />

			{isLoading ? (
				<View
					style={{
						height: 100,
						width: 100,
						borderRadius: 32,

						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: pColor(dark).view,
					}}
				>
					<ActivityIndicator color={'#fff'} size="large" />
				</View>
			) : (
				<View
					style={{
						height: 180,
						borderRadius: 32,
						width: width * 0.8,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: pColor(dark).view,
					}}
				>
					<Text>An error occur</Text>
					<Button
						title={'Try again'}
						onPress={onBtnPress}
						containerStyle={{ marginTop: 32 }}
					/>
				</View>
			)}
		</Animated.View>
	) : null;
};
