import React, { useRef, useState } from 'react';
import { View, Image, Platform, StyleSheet, Share } from 'react-native';

import { width, height, colors } from 'consts';

import ImageZoom from 'react-native-image-pan-zoom';
import {
	useRoute,
	RouteProp,
	NavigationProp,
	useNavigation,
	useTheme,
} from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';

import Ionicons from '@expo/vector-icons/build/Ionicons';
import Constants from 'expo-constants';

import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';

import {
	ImageDownLoadEvents,
	ImageLoading,
	PermRequestModal,
	Pressable,
	Text,
} from 'components';
import { HomeStackParamList, ImageBSRefPorps, ImageLRefProps } from 'types';
import { ImageBottomSheet } from 'components/home';
import { useDispatch } from 'react-redux';
import {
	updateSaveImages,
	removeSaveFromImageList,
	addSaveToImageList,
} from 'reduxStore/reducer';
import { StatusBar } from 'expo-status-bar';
import { pColor } from 'utils';

const styles = StyleSheet.create({
	sideBarContainer: {
		right: 0,
		zIndex: 10,
		position: 'absolute',
		alignItems: 'center',
		height: height * 0.3,
		bottom: Platform.OS === 'ios' ? 80 : 60,
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
		backgroundColor: 'rgba(100, 100, 100, 0.35)',
	},
	unsplashLink: {
		padding: 0,
		bottom: 24,
		// top: 24,
		left: 18,
		position: 'absolute',
		paddingHorizontal: 10,
		backgroundColor: 'rgba(0,0,0,0.4)',
		borderRadius: 16,
	},
	closeBtn: {
		position: 'absolute',
		top: 32,
		left: 16,
		height: 40,
		width: 40,
		zIndex: 100,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#111',
		borderRadius: 360,
	},
});

const ImagePreview = () => {
	const { dark } = useTheme();
	const { goBack } = useNavigation<NavigationProp<HomeStackParamList>>();

	const { params } =
		useRoute<RouteProp<HomeStackParamList, 'ImagePreviewScreen'>>();

	const dispatch = useDispatch();

	const imageRef = useRef<ImageLRefProps>(null);

	const permRequestRef = useRef<ImageLRefProps>(null);

	const bottomSheetRef = useRef<ImageBSRefPorps>(null);

	const downloadInfo = useRef({ uri: '', name: '' });

	const [hideSidebar, setHideSidebar] = useState(false);

	const [downloadFailed, setDownloadFailed] = useState(false);

	const [isDownloading, setIsDownloading] = useState(false);

	const [imageIsSaved, setImageIsSaved] = useState(params.imageIsSaved);

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
		<View
			style={{
				flex: 1,
				backgroundColor: '#000',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<StatusBar
				style={dark ? 'light' : 'dark'}
				backgroundColor={pColor(dark).background}
			/>

			<ImageLoading
				ref={imageRef}
				containerStyle={{ ...StyleSheet.absoluteFillObject }}
			/>

			<ImageZoom
				onMove={(e) => {
					if (e.scale === 1) setHideSidebar(false);

					!hideSidebar && setHideSidebar(true);
				}}
				onSwipeDown={() => {
					goBack();
				}}
				cropWidth={width}
				cropHeight={height}
				imageWidth={width}
				style={{ flex: 1 }}
				imageHeight={height * 0.5}
			>
				<SharedElement id={`item.${params?.id}.photo`}>
					<Image
						// resizeMode="contain"
						resizeMode="cover"
						source={{ uri: params?.urls.regular }}
						style={{ width, height: height * 0.5 }}
						onLoadStart={() => imageRef.current?.open()}
						onLoadEnd={() => imageRef.current?.close()}
					/>
				</SharedElement>
			</ImageZoom>

			<Pressable
				ripple_raduis={20}
				ripple_color={'rgba(100, 100, 100, 0.35)'}
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				style={styles.closeBtn}
				onPress={() => goBack()}
			>
				<Ionicons name="close" size={24} color="#ffffff" />
			</Pressable>

			{!hideSidebar && (
				<>
					<Animated.View
						exiting={SlideOutRight}
						entering={SlideInRight}
						style={styles.sideBarContainer}
					>
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
							<Ionicons name="share-social" size={20} color={'#fff'} />

							<Text btnColor textSize="small" style={{ fontWeight: 'bold' }}>
								Share
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
				</>
			)}

			<Pressable
				ripple_raduis={20}
				style={styles.unsplashLink}
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
		</View>
	);
};

export default ImagePreview;
