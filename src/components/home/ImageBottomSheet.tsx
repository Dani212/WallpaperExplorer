import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { View, Image, Pressable } from 'react-native';

import { useTheme } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import Animated, {
	FadeInUp,
	FadeOut,
	SlideInDown,
	SlideOutDown,
} from 'react-native-reanimated';

import { Text, Pressable as CustomPressable } from 'components';

import * as Linking from 'expo-linking';

import { pColor } from 'utils';

import { imageDummyItem, width } from 'consts';

import { ImageBSRefPorps, ImageResponeProps } from 'types';

import { bsStyles } from 'styles';

type Props = {
	downLoadPress: (downloadUrl: string, name: string) => void;
};

// eslint-disable-next-line react/display-name
export const ImageBottomSheet = forwardRef<ImageBSRefPorps, Props>(
	({ downLoadPress }, ref) => {
		const { dark } = useTheme();

		const [isOpen, setIsOpen] = useState(false);

		const [items, setItems] = useState<ImageResponeProps>(imageDummyItem);

		const formateName = (
			firstName: string | undefined,
			otherName: string | undefined
		): string => {
			return `${typeof firstName === 'string' ? firstName : ''} ${
				typeof otherName === 'string' ? otherName : ''
			} `;
		};

		const open = (imageItems: ImageResponeProps) => {
			setIsOpen(true);
			setItems(imageItems);
		};

		const close = () => {
			setIsOpen(false);
		};

		const downLoadPressed = () => {
			close();
			const name = items?.id;
			const result = items?.links.download;
			downLoadPress(result ? result : '', name ? name : '');
		};

		const viewMorePress = () => {
			const result = items?.user.links.html;

			Linking.openURL(result ? result : '');

			close();
		};

		useImperativeHandle(
			ref,
			() => ({
				open,
				close,
			}),
			[]
		);

		if (!isOpen) return null;

		return (
			<View style={bsStyles.bottoMSheetContainer}>
				<Animated.View
					entering={FadeInUp.duration(1500)}
					exiting={FadeOut}
					style={bsStyles.bottoMSheetBody}
				/>

				<Pressable style={{ flex: 1 }} onPress={close} />

				<Animated.View
					entering={SlideInDown}
					exiting={SlideOutDown}
					style={[
						bsStyles.bottomSheetContent,
						{ backgroundColor: pColor(dark).view },
					]}
				>
					<Text style={{ marginStart: 18, marginTop: 10, marginBottom: 16 }}>
						Author
					</Text>

					<View style={bsStyles.bsImageNameContainer}>
						<Image
							source={{ uri: items?.user.profile_image.medium }}
							resizeMode="cover"
							style={bsStyles.bottomSheetImage}
						/>
						<View style={{ marginStart: 18, backgroundColor: 'transparent' }}>
							<Text>
								{formateName(items?.user.first_name, items?.user.last_name)}
							</Text>
							<CustomPressable
								ripple_raduis={120}
								onPress={viewMorePress}
								style={{ paddingVertical: 1, marginTop: 5 }}
							>
								<Text
									style={{
										borderRadius: 16,
										backgroundColor: 'rgba(100,100,100,1)',
									}}
								>
									{' View more on unsplash > '}
								</Text>
							</CustomPressable>
						</View>
					</View>

					<View
						style={{
							width,
							height: 0.5,
							marginVertical: 14,
							backgroundColor: pColor(dark).dividerLine,
						}}
					/>

					<CustomPressable
						onPress={downLoadPressed}
						style={bsStyles.bsiconItem}
					>
						<Ionicons
							color={pColor(dark).text}
							size={24}
							name="download-outline"
							style={{
								marginHorizontal: 16,
							}}
						/>

						<Text>Download</Text>
					</CustomPressable>
				</Animated.View>
			</View>
		);
	}
);
