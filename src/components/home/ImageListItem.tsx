import React, { useState, FC, useRef, useEffect, memo } from 'react';

import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { View, StyleSheet, Image } from 'react-native';

import { useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';

import * as Linking from 'expo-linking';

import { ImageLoading, Pressable, Text } from 'components';

import { height, width } from 'consts';

import { pColor } from 'utils';

import { ImageLRefProps } from 'types';
import { homeStyles } from 'styles';

type Props = {
	//
	id: string;
	color: string;
	image: string;
	userName: string;
	profileUri: string;
	imageSaved: boolean;
	profileImage: string;
	morePress: () => void;
	onSharePress: () => void;
	onSavePress: (saved: boolean) => void;
};

const ImageListItem: FC<Props> = ({
	color,
	image,
	morePress,
	imageSaved,
	onSavePress,
	onSharePress,
}) => {
	const { dark } = useTheme();

	const initialLoad = useRef(false);

	const imageRef = useRef<ImageLRefProps>(null);

	const [saved, setSaved] = useState(false);

	const [savedPressed, setSavedPressed] = useState(false);

	const [resizeImage, setResizeImage] = useState<'cover' | 'contain'>('cover');

	const resizeImagePress = () => {
		setResizeImage((prev) => (prev === 'contain' ? 'cover' : 'contain'));
	};

	useEffect(() => {
		if (imageSaved) {
			!saved && setSaved(true);
		} else {
			saved && setSaved(false);
		}
	}, [imageSaved]);

	useEffect(() => {
		if (initialLoad.current) {
			onSavePress(!saved);
		} else {
			initialLoad.current = true;
		}
	}, [savedPressed]);

	const onSave = async () => {
		setSaved(!saved);

		setSavedPressed(!savedPressed);
	};

	return (
		<View
			style={{
				width,
				height,
				flexShrink: 10,
				flexBasis: height,
				backgroundColor: color,
			}}
		>
			<ImageLoading
				ref={imageRef}
				containerStyle={{ ...StyleSheet.absoluteFillObject }}
			/>

			<Image
				source={{ uri: image }}
				resizeMode={resizeImage}
				onLoadStart={() => imageRef.current?.open()}
				onLoadEnd={() => imageRef.current?.close()}
				style={{
					flex: 1,
				}}
			/>

			<Animated.View style={[homeStyles.sideBarContainer]}>
				<Pressable
					ripple_raduis={30}
					onPress={morePress}
					style={homeStyles.sideBarItem}
				>
					<Ionicons color={'#fff'} size={20} name="ellipsis-horizontal" />
					<Text btnColor textSize="small" style={{ fontWeight: 'bold' }}>
						More
					</Text>
				</Pressable>

				<Pressable
					ripple_raduis={30}
					onPress={onSharePress}
					style={homeStyles.sideBarItem}
				>
					<FontAwesome color={'#fff'} size={20} name="share" />

					<Text btnColor textSize="small" style={{ fontWeight: 'bold' }}>
						Share
					</Text>
				</Pressable>

				<Pressable
					ripple_raduis={30}
					onPress={resizeImagePress}
					style={homeStyles.sideBarItem}
				>
					<Ionicons
						color={pColor(dark).text}
						size={20}
						name="resize"
						style={{}}
					/>

					<Text btnColor textSize="small" style={{ fontWeight: 'bold' }}>
						Resize
					</Text>
				</Pressable>

				<Pressable
					ripple_raduis={30}
					onPress={onSave}
					style={homeStyles.sideBarItem}
				>
					<Ionicons
						size={20}
						style={{}}
						color={pColor(dark).text}
						name={saved ? 'bookmark' : 'bookmark-outline'}
					/>
					<Text btnColor textSize="small" style={{ fontWeight: 'bold' }}>
						Save
					</Text>
				</Pressable>
			</Animated.View>

			<Pressable
				ripple_raduis={20}
				style={homeStyles.unsplashText}
				onPress={() => Linking.openURL('https://unsplash.com')}
			>
				<Text btnColor>unsplash.com</Text>
			</Pressable>
		</View>
	);
};

export default memo(ImageListItem);
