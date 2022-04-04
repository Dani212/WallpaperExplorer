import React, { useState, FC, useRef, useEffect, memo } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { ImageLoading, Pressable } from 'components';

import { colors, width } from 'consts';

import { ImageLRefProps, ImageResponeProps } from 'types';

import { SharedElement } from 'react-navigation-shared-element';

type Props = {
	item: ImageResponeProps;
	onSharePress: (link: string) => void;
	onSavePress: (saved: boolean) => void;
	containerPressed: (saved: boolean) => void;
};

const ListItem: FC<Props> = ({
	item,
	onSavePress,
	onSharePress,
	containerPressed,
}) => {
	const {
		id,
		color,
		imageIsSaved,
		urls: { regular: image, full },
	} = item;

	const initialLoad = useRef(false);

	const imageRef = useRef<ImageLRefProps>(null);

	const [saved, setSaved] = useState(false);

	const [savedPressed, setSavedPressed] = useState(false);

	useEffect(() => {
		if (imageIsSaved) {
			!saved && setSaved(true);
		} else {
			saved && setSaved(false);
		}
	}, [imageIsSaved]);

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

	const onShare = () => {
		onSharePress(full);
	};

	const imageContainerPressed = () => {
		containerPressed(saved);
		//
	};

	return (
		<TouchableOpacity
			onPress={imageContainerPressed}
			activeOpacity={0.7}
			style={{
				zIndex: 100,
				width: width * 0.98,
				height: width * 0.9,
				marginTop: 4,
				borderRadius: 6,
				backgroundColor: color,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<ImageLoading
				ref={imageRef}
				containerStyle={{ ...StyleSheet.absoluteFillObject }}
			/>

			<SharedElement id={`item.${id}.photo`}>
				<Image
					resizeMode={'cover'}
					source={{ uri: image }}
					onLoadStart={() => imageRef.current?.open()}
					onLoadEnd={() => imageRef.current?.close()}
					style={{
						width: width * 0.96,
						height: width * 0.88,
						borderRadius: 6,
					}}
				/>
			</SharedElement>

			<View
				style={{
					position: 'absolute',
					bottom: 16,
					right: 16,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Pressable
					ripple_raduis={20}
					onPress={onShare}
					style={{
						padding: 12,
						marginEnd: 24,
						borderRadius: 360,
						backgroundColor: 'rgba(0, 0, 0, 0.4)',
					}}
				>
					<Ionicons name="share-social" size={22} color={'#fff'} />
				</Pressable>

				<Pressable
					ripple_raduis={20}
					onPress={onSave}
					style={{
						padding: 12,
						borderRadius: 360,
						backgroundColor: 'rgba(0, 0, 0, 0.4)',
					}}
				>
					<Ionicons
						size={20}
						style={{}}
						color={colors.dark.text}
						name={saved ? 'bookmark' : 'bookmark-outline'}
					/>
				</Pressable>
			</View>
		</TouchableOpacity>
	);
};

export default memo(ListItem);
