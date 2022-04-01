import React, { FC, useEffect, useRef, useState } from 'react';

import {
	RefreshControl,
	FlatList,
	Platform,
	Share,
	View,
	NativeSyntheticEvent,
	NativeScrollEvent,
} from 'react-native';

import axios from 'axios';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
	ImageListState,
	updateImageList,
	updateSaveImages,
} from 'reduxStore/reducer';
import { styles } from 'styles';
import { height, width } from 'consts';
import { BottomTabBar, Button, ImageLoading, Text } from 'components';
import ListItem from 'components/home/ListItem';
import { HomeStackParamList, ImageLRefProps, ImageResponeProps } from 'types';

type GetDataActionType = 'loadMore' | 'refereshing' | undefined;

const HomeScreen: FC = () => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const dispatch = useDispatch();

	const imageData = useSelector(ImageListState);

	const isLoadingMore = useRef(false);

	const flatListRef = useRef<FlatList>(null);

	const bottomTabBarRef = useRef<ImageLRefProps>(null);

	const fImageLoadingRef = useRef<ImageLRefProps>(null);

	const imageLoadingRef = useRef<ImageLRefProps>(null);

	const [isRefreshing, setIsRefreshing] = useState(false);

	const [errorMsg, setErrorMsg] = useState('');

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

	const onSavePress = (item: ImageResponeProps) => {
		dispatch(updateSaveImages(item));
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

	const containerPressed = (item: ImageResponeProps) => {
		navigate('ImagePreviewScreen', item);
	};

	const renderItem = ({ item }: { item: ImageResponeProps }) => {
		return (
			<ListItem
				item={item}
				onSharePress={onShare}
				containerPressed={() => containerPressed(item)}
				onSavePress={(): void => onSavePress(item)}
			/>
		);
	};

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
		<View
			style={{
				height: height * 0.2,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<ImageLoading
				ref={fImageLoadingRef}
				containerStyle={{ height: height * 0.2, width }}
			/>

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

	const keyExtractor = (_: unknown, index: number) => String(index);

	const getItemLayout = (_: unknown, index: number) => ({
		length: width * 0.9 + 4,
		offset: width * 0.9 + 4 * index,
		index,
	});

	return (
		<SafeAreaView style={styles.container}>
			<ImageLoading ref={imageLoadingRef} containerStyle={{ height, width }} />

			<FlatList
				data={imageData}
				ref={flatListRef}
				onScroll={onScroll}
				disableVirtualization
				renderItem={renderItem}
				onEndReached={onEndReached}
				keyExtractor={keyExtractor}
				onEndReachedThreshold={0.5}
				getItemLayout={getItemLayout}
				decelerationRate={0.94}
				style={{ flex: 1, marginTop: 12, alignSelf: 'center' }}
				ListEmptyComponent={ListEmptyComponent}
				ListFooterComponent={ListFooterComponent}
				removeClippedSubviews={false}
				showsVerticalScrollIndicator={false}
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
		</SafeAreaView>
	);
};

export default HomeScreen;
