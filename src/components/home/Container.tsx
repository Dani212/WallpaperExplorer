import React, { FC } from 'react';

import { View, Platform, ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from 'styles';

type Props = {
	children: React.ReactElement;
	style?: ViewStyle;
};

export const HomeContainer: FC<Props> = ({ children, style }) => {
	if (Platform.OS === 'ios') {
		return <View style={[styles.container, style]}>{children}</View>;
	}

	return (
		<SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
	);
};
