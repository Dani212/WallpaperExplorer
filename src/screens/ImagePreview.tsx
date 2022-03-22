import React from 'react';
import { View, Image } from 'react-native';

import { width, height } from 'consts';

import { styles } from 'styles';
import ImageZoom from 'react-native-image-pan-zoom';
import { HomeStackParamList } from 'types';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import { SafeAreaView } from 'react-native-safe-area-context';

const ImagePreview = () => {
	// const { params } = useNavigation<NavigationProp<any>>();
	const { params } = useRoute<RouteProp<HomeStackParamList>>();

	return (
		// <SafeAreaView style={[styles.container]}>
		<SharedElement id={`item.${params?.id}.photo`}>
			<ImageZoom
				cropWidth={width}
				cropHeight={height}
				imageWidth={width}
				// style={{ justifyContent: 'center', alignItems: 'center' }}
				imageHeight={height / 2}
				panToMove={false}
				// pinchToZoom={false}
			>
				<Image
					style={{ width, height: height * 0.5, alignSelf: 'center' }}
					// resizeMode="contain"
					resizeMode="cover"
					source={{
						uri: params?.image,
						// uri: 'https://images.unsplash.com/photo-1645894023835-e6cb8e51c3ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=674&q=80',
					}}
				/>
			</ImageZoom>
		</SharedElement>
		// </SafeAreaView>
	);
};

export default ImagePreview;
