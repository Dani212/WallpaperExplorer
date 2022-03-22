import React, { useRef, useState } from 'react';

import { StyleSheet, Image, Platform, Share } from 'react-native';

import { RouteProp, useRoute, useTheme } from '@react-navigation/native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Animated from 'react-native-reanimated';

import Constants from 'expo-constants';

import * as IntentLauncher from 'expo-intent-launcher';

import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';

import * as Linking from 'expo-linking';

import { ImageBottomSheet } from 'components/home/ImageBottomSheet';

import {
	ImageBSRefPorps,
	ImageLRefProps,
	RootStackParamList,
	RootStackScreenProps,
} from 'types';

import {
	ImageDownLoadEvents,
	PermRequestModal,
	ImageLoading,
	Pressable,
	Text,
} from 'components';

import { colors, height, width } from 'consts';

import { pColor } from 'utils';
import { StatusBar } from 'expo-status-bar';
import {
	addSaveToImageList,
	removeSaveFromImageList,
	updateSaveImages,
} from 'reduxStore/reducer';
import { useDispatch } from 'react-redux';
import { HomeContainer } from 'components/home';
import ImageZoom from 'react-native-image-pan-zoom';

const styles = StyleSheet.create({
	sideBarContainer: {
		right: 0,
		bottom: 100,
		zIndex: 10,
		position: 'absolute',
		alignItems: 'center',
		height: height * 0.35,
		justifyContent: 'space-between',
		backgroundColor: 'transparent',
		// backgroundColor: '#f4f4',
	},
	sideBarItem: {
		zIndex: 10,
		height: 70,
		width: 70,
		borderRadius: 360,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
});

export default function ImageScreen({
	navigation,
}: RootStackScreenProps<'ImageScreen'>) {
	const { params } = useRoute<RouteProp<RootStackParamList, 'ImageScreen'>>();

	const { dark } = useTheme();

	const dispatch = useDispatch();

	const imageRef = useRef<ImageLRefProps>(null);

	const permRequestRef = useRef<ImageLRefProps>(null);

	const bottomSheetRef = useRef<ImageBSRefPorps>(null);

	const downloadInfo = useRef({ uri: '', name: '' });

	const [resizeImage, setResizeImage] = useState<'cover' | 'contain'>('cover');

	const [downloadFailed, setDownloadFailed] = useState(false);

	const [isDownloading, setIsDownloading] = useState(false);

	const [imageIsSaved, setImageIsSaved] = useState(true);

	// const saveToMedia = async (uri: string) => {
	//
	// };

	const downloadImages = async () => {
		const uri: string = params.links.download;
		const name: string = params.id;

		const status = await MediaLibrary.requestPermissionsAsync();

		if (!status.granted) {
			permRequestRef.current?.open();
			return;
		}

		downloadInfo.current = { uri, name };

		try {
			setIsDownloading(true);
			setDownloadFailed(false);

			const result = await FileSystem.downloadAsync(
				uri,
				FileSystem.documentDirectory + name + '.png'
			);
			// await saveToMedia(result.uri);
			const assest = await MediaLibrary.createAssetAsync(result.uri);
			await MediaLibrary.createAlbumAsync('Wallpaper explorer', assest);
		} catch (error) {
			setDownloadFailed(true);
			// console.error(error);
		} finally {
			setIsDownloading(false);
		}
	};

	const onSharePress = async () => {
		const ios = {
			message: 'Beautiful image from unsplash',
			url: params.urls.full,
		};

		const andriod = {
			message: 'Beautiful image from unsplash ' + params.urls.full,
		};

		try {
			await Share.share(Platform.OS === 'ios' ? ios : andriod);
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const err: any = error;
			alert(err.message);
		}
	};

	const onSavePress = () => {
		if (imageIsSaved) {
			dispatch(updateSaveImages(params));
			dispatch(removeSaveFromImageList(params));
			setImageIsSaved(false);
		} else {
			dispatch(updateSaveImages(params));
			dispatch(addSaveToImageList([params.id]));
			setImageIsSaved(true);
		}
	};

	const resizeImagePress = () => {
		setResizeImage((prev) => (prev === 'contain' ? 'cover' : 'contain'));
	};

	const morePress = () => {
		bottomSheetRef.current?.open(params);
	};

	const okayPress = () => {
		permRequestRef.current?.close();

		const pkg = Constants.manifest?.releaseChannel
			? Constants.manifest.android?.package
			: 'host.exp.exponent';

		if (Platform.OS === 'android') {
			IntentLauncher.startActivityAsync(
				IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
				{ data: 'package:' + pkg }
			);
		} else {
			Linking.openURL('app-settings:');
		}
	};

	const closeDownLoadEvents = () => {
		setDownloadFailed(false);
		setIsDownloading(false);
	};

	return (
		<HomeContainer
			style={{
				backgroundColor: params.color,
			}}
		>
			<>
				<StatusBar
					style={dark ? 'light' : 'dark'}
					backgroundColor={pColor(dark).background}
				/>

				<Pressable
					ripple_raduis={26}
					style={{
						height: 50,
						width: 50,
						top: 24,
						margin: 16,
						zIndex: 100,
						borderRadius: 360,
						position: 'absolute',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: pColor(dark).view,
					}}
					onPress={() => navigation.goBack()}
				>
					<Ionicons
						color={pColor(dark).text}
						size={20}
						name="ios-arrow-back-outline"
					/>
				</Pressable>

				<ImageLoading
					ref={imageRef}
					containerStyle={{ ...StyleSheet.absoluteFillObject }}
				/>

				{resizeImage === 'contain' ? (
					<ImageZoom
						// panToMove={false}
						cropWidth={width}
						cropHeight={height}
						imageWidth={width}
						style={{ flex: 1, zIndex: 10 }}
						imageHeight={height}
					>
						<Image
							source={{ uri: params.urls.regular }}
							resizeMode={resizeImage}
							onLoadStart={() => imageRef.current?.open()}
							onLoadEnd={() => imageRef.current?.close()}
							style={{
								flex: 1,
							}}
						/>
					</ImageZoom>
				) : (
					<Image
						source={{ uri: params.urls.regular }}
						resizeMode={resizeImage}
						onLoadStart={() => imageRef.current?.open()}
						onLoadEnd={() => imageRef.current?.close()}
						style={{
							flex: 1,
						}}
					/>
				)}

				<Animated.View style={[styles.sideBarContainer]}>
					<Pressable
						ripple_raduis={30}
						onPress={morePress}
						style={styles.sideBarItem}
					>
						<Ionicons color={'#fff'} size={20} name="ellipsis-horizontal" />
						<Text btnColor textSize="small" style={{ fontWeight: 'bold' }}>
							More
						</Text>
					</Pressable>

					<Pressable
						ripple_raduis={30}
						onPress={onSharePress}
						style={styles.sideBarItem}
					>
						<FontAwesome color={'#fff'} size={20} name="share" />

						<Text btnColor textSize="small" style={{ fontWeight: 'bold' }}>
							Share
						</Text>
					</Pressable>

					<Pressable
						ripple_raduis={30}
						onPress={resizeImagePress}
						style={styles.sideBarItem}
					>
						<Ionicons
							color={colors.dark.text}
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
						onPress={onSavePress}
						style={styles.sideBarItem}
					>
						<Ionicons
							size={20}
							style={{}}
							color={colors.dark.text}
							name={imageIsSaved ? 'bookmark' : 'bookmark-outline'}
						/>
						<Text btnColor textSize="small" style={{ fontWeight: 'bold' }}>
							Save
						</Text>
					</Pressable>
				</Animated.View>

				<Pressable
					ripple_raduis={20}
					style={{
						padding: 0,
						bottom: 24,
						// top: 24,
						left: 18,
						position: 'absolute',
						paddingHorizontal: 10,
						backgroundColor: 'rgba(0,0,0,0.4)',
						borderRadius: 16,
					}}
					onPress={() => Linking.openURL('https://unsplash.com')}
				>
					<Text btnColor>unsplash.com</Text>
				</Pressable>

				<ImageBottomSheet ref={bottomSheetRef} downLoadPress={downloadImages} />

				<ImageDownLoadEvents
					isLoading={isDownloading}
					downloadFailed={downloadFailed}
					onBtnPress={downloadImages}
					close={closeDownLoadEvents}
				/>
				<PermRequestModal ref={permRequestRef} okayPress={okayPress} />
			</>
		</HomeContainer>
	);
}
