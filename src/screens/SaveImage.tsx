import React, { useCallback, useRef } from 'react';

import {
	FlatList,
	View,
	NativeScrollEvent,
	NativeSyntheticEvent,
} from 'react-native';

import {
	NavigationProp,
	useFocusEffect,
	useNavigation,
} from '@react-navigation/native';

import { ImageLRefProps, ImageResponeProps, RootStackParamList } from 'types';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { height, width } from 'consts';

import { styles } from 'styles';

import { BottomTabBar, Text } from 'components';

import { SaveImageItems } from 'components/home/SaveImageItems';
import { useDispatch, useSelector } from 'react-redux';
import {
	addSaveToImageList,
	removeSaveFromImageList,
	SavedItemsState,
	updateSaveImages,
} from 'reduxStore/reducer';

export default function TabOneScreen() {
	// const { dispatch, state } = useContext(AppContext);
	const dispatch = useDispatch();

	const savedImageList = useSelector(SavedItemsState);

	const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();

	const bottomTabBarRef = useRef<ImageLRefProps>(null);

	const flatListRef = useRef<FlatList>(null);

	/**
	 * @description This function is use to update
	 *  imageList item imageIsSaved value to true if the id
	 *	is found in saved Image list
	 */
	const updateImageList = () => {
		//
		const savedList = savedImageList.map((v) => v.id);

		dispatch(addSaveToImageList(savedList));
	};

	useFocusEffect(
		useCallback(() => {
			updateImageList();
		}, [savedImageList])
	);

	/**
	 * @description This function is use to hide bottom tab when user scrolls flatlist
	 */
	let offestY = 0;
	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const currentOffset = event.nativeEvent.contentOffset.y;

		const direction =
			currentOffset > offestY ? (currentOffset <= 0 ? 'up' : 'down') : 'up';
		offestY = currentOffset;

		if (direction === 'down') {
			bottomTabBarRef.current?.close();
		} else {
			bottomTabBarRef.current?.open();
		}
	};

	const onSavePress = (item: ImageResponeProps) => {
		dispatch(updateSaveImages(item));
		dispatch(removeSaveFromImageList(item));
	};

	const containerPressed = (item: ImageResponeProps) => {
		//

		navigate('ImageScreen', item);
	};

	const renderItem = useCallback(
		({ item, index }: { item: ImageResponeProps; index: number }) => (
			<SaveImageItems
				color={item.color}
				image={item.urls.regular}
				onSavePress={() => onSavePress(item)}
				containerStyle={{ marginEnd: index % 2 !== 1 ? 4 : 0 }}
				containerPressed={() => containerPressed(item)}
			/>
		),
		[]
	);

	const keyExtractor = useCallback(
		(item: ImageResponeProps) => item.id,
		[savedImageList]
	);

	const length = height * 0.4 + 4;
	const getItemLayout = (_: unknown, index: number) => ({
		length,
		offset: length * index,
		index,
	});

	return (
		<View style={styles.container}>
			{savedImageList.length < 1 ? (
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<Text style={{ width: width * 0.8, textAlign: 'center' }}>
						You have not save any picuter yet
					</Text>
				</View>
			) : (
				<FlatList
					// debug
					// inverted
					numColumns={2}
					windowSize={11}
					ref={flatListRef}
					onScroll={onScroll}
					data={savedImageList}
					disableVirtualization
					renderItem={renderItem}
					extraData={savedImageList}
					keyExtractor={keyExtractor}
					getItemLayout={getItemLayout}
					removeClippedSubviews={false}
					// CellRendererComponent
					updateCellsBatchingPeriod={20}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ zIndex: 100 }}
					style={{
						alignSelf: savedImageList.length < 2 ? 'flex-start' : 'center',
						marginStart: savedImageList.length < 2 ? 6 : 0,
					}}
				/>
			)}

			<BottomTabBar
				screen="save"
				ref={bottomTabBarRef}
				savePressed={() =>
					flatListRef.current?.scrollToOffset({
						offset: 0,
						animated: true,
					})
				}
			/>
		</View>
	);
}
