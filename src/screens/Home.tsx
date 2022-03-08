import React, { useEffect, useRef, useState } from 'react';

import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';

import {
	View,
	Share,
	Platform,
	FlatList,
	RefreshControl,
	NativeScrollEvent,
	NativeSyntheticEvent,
} from 'react-native';

import axios from 'axios';

import { height, width } from 'consts';

import { ImageBSRefPorps, ImageLRefProps, ImageResponeProps } from 'types';

import {
	BottomTabBar,
	ImageDownLoadEvents,
	ImageLoading,
	Text,
	Button,
} from 'components';

import ImageListItem from 'components/home/ImageListItem';

import { ImageBottomSheet } from 'components/home/ImageBottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import {
	ImageListState,
	// SavedItemsState,
	updateImageList,
	updateSaveImages,
} from 'reduxStore/reducer';
import { HomeContainer } from 'components/home';

type GetDataActionType = 'loadMore' | 'refereshing' | undefined;

export default function HomeScreen() {
	const dispatch = useDispatch();

	const imageData = useSelector(ImageListState);

	// const savedItems = useSelector(SavedItemsState);

	const [downloadFailed, setDownloadFailed] = useState(false);

	const [isDownloading, setIsDownloading] = useState(false);

	const [isRefreshing, setIsRefreshing] = useState(false);

	const [errorMsg, setErrorMsg] = useState('');

	const isLoadingMore = useRef(false);

	const downloadInfo = useRef({ uri: '', name: '' });

	const bottomSheetRef = useRef<ImageBSRefPorps>(null);

	const fImageLoadingRef = useRef<ImageLRefProps>(null);

	const imageLoadingRef = useRef<ImageLRefProps>(null);

	const bottomTabBarRef = useRef<ImageLRefProps>(null);

	const flatListRef = useRef<FlatList>(null);

	const page = useRef(1);

	const setLoading = (result: boolean, aT?: GetDataActionType) => {
		if (!aT) {
			result && imageLoadingRef.current?.open();
			!result && imageLoadingRef.current?.close();
		} else if (aT === 'loadMore') {
			result && fImageLoadingRef.current?.open();
			!result && fImageLoadingRef.current?.close();
			isLoadingMore.current = result;
		} else {
			setIsRefreshing(result);
		}
	};

	const setPage = (aT?: GetDataActionType) => {
		if (aT === 'refereshing') return (page.current = 1);
		page.current += 1;
	};

	const getData = async (aT?: GetDataActionType) => {
		try {
			setLoading(true, aT);
			setErrorMsg('');

			const result = await axios.get('https://api.unsplash.com/photos', {
				params: {
					client_id: 'IFOLYrMLcKWcJA6YYfwJIKtUMaDPKYKin--uz7nM3vM',
					page: page.current,
					per_page: 10,
				},
			});

			setPage(aT);

			// console.log(formatedResult[0].id);
			if (aT !== 'loadMore')
				return dispatch(updateImageList({ data: result.data }));

			await dispatch(updateImageList({ data: result.data, aT: 'l' }));

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			// console.log(err);
			setErrorMsg(err.message);
		} finally {
			setLoading(false, aT);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const saveToMedia = async (uri: string) => {
		const statuss = await MediaLibrary.requestPermissionsAsync();

		if (!statuss.granted) {
			return;
		}

		const assest = await MediaLibrary.createAssetAsync(uri);
		await MediaLibrary.createAlbumAsync('Wallpaper explorer', assest);
	};

	const downloadImages = async (uri: string, name: string) => {
		downloadInfo.current = { uri, name };

		try {
			setIsDownloading(true);
			setDownloadFailed(false);

			const result = await FileSystem.downloadAsync(
				uri,
				FileSystem.documentDirectory + name + '.png'
			);
			await saveToMedia(result.uri);
		} catch (error) {
			setDownloadFailed(true);
			// console.error(error);
		} finally {
			setIsDownloading(false);
		}
	};

	const onShare = async (url: string) => {
		const ios = {
			message: 'Beautiful image from unsplash',
			url,
		};

		const andriod = {
			message: 'Beautiful image from unsplash ' + url,
		};

		try {
			await Share.share(Platform.OS === 'ios' ? ios : andriod);
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const err: any = error;
			alert(err.message);
		}
	};

	const onSavePress = (item: ImageResponeProps) => {
		dispatch(updateSaveImages(item));
	};

	let offestY = 0;
	let isDown = false;
	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const currentOffset = event.nativeEvent.contentOffset.y;

		const direction =
			currentOffset > offestY ? (currentOffset <= 0 ? 'up' : 'down') : 'up';
		offestY = currentOffset;

		if (direction === 'down') {
			!isDown && bottomTabBarRef.current?.close();
			isDown = true;
		} else {
			isDown && bottomTabBarRef.current?.open();
			isDown = false;
		}
	};

	const onRefresh = () => {
		if (isRefreshing) return;

		getData('refereshing');
	};

	const onEndReached = () => {
		if (isLoadingMore.current) return;

		getData('loadMore');
	};

	const renderItem = ({ item }: { item: ImageResponeProps }) => {
		return (
			<ImageListItem
				id={item.id}
				color={item.color}
				image={item.urls.regular}
				imageSaved={item.imageIsSaved}
				profileUri={item.user.portfolio_url}
				profileImage={item.user.profile_image.small}
				userName={`${item.user.first_name} ${
					item.user.last_name ? '' : item.user.last_name
				}`}
				onSavePress={() => onSavePress(item)}
				onSharePress={() => onShare(item.urls.full)}
				morePress={() => bottomSheetRef.current?.open(item)}
			/>
		);
	};

	const keyExtractor = (_: unknown, index: number) => String(index);

	const ListEmptyComponent = () => (
		<View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
			{errorMsg !== '' && (
				<>
					<Text>An error occur</Text>

					<Button
						title={'Try again'}
						onPress={() => getData()}
						containerStyle={{ marginTop: 32 }}
					/>
				</>
			)}
		</View>
	);

	const ListFooterComponent = () => (
		<View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
			<ImageLoading ref={fImageLoadingRef} containerStyle={{ height, width }} />
			{errorMsg !== '' && (
				<>
					<Text>An error occur</Text>

					<Button
						title={'Try again'}
						onPress={() => getData('loadMore')}
						containerStyle={{ marginTop: 32 }}
					/>
				</>
			)}
		</View>
	);

	const getItemLayout = (_: unknown, index: number) => ({
		length: height,
		offset: height * index,
		index,
	});

	return (
		<HomeContainer>
			<>
				<ImageLoading
					ref={imageLoadingRef}
					containerStyle={{ height, width }}
				/>

				<FlatList
					// horizontal
					pagingEnabled
					data={imageData}
					ref={flatListRef}
					onScroll={onScroll}
					disableVirtualization
					renderItem={renderItem}
					onEndReached={onEndReached}
					keyExtractor={keyExtractor}
					onEndReachedThreshold={0.5}
					getItemLayout={getItemLayout}
					contentOffset={{ y: 0, x: 0 }}
					scrollEnabled={!isDownloading}
					style={{ flex: 1, height, width }}
					ListEmptyComponent={ListEmptyComponent}
					ListFooterComponent={ListFooterComponent}
					extraData={[imageData]}
					refreshControl={
						<RefreshControl
							enabled={imageData.length > 0}
							refreshing={isRefreshing}
							onRefresh={onRefresh}
						/>
					}
				/>

				<BottomTabBar
					ref={bottomTabBarRef}
					homePressed={() =>
						flatListRef.current?.scrollToOffset({
							offset: 0,
							animated: true,
						})
					}
				/>

				<ImageBottomSheet ref={bottomSheetRef} downLoadPress={downloadImages} />

				<ImageDownLoadEvents
					isLoading={isDownloading}
					downloadFailed={downloadFailed}
					onBtnPress={() =>
						downloadImages(downloadInfo.current.uri, downloadInfo.current.name)
					}
				/>
			</>
		</HomeContainer>
	);
}
