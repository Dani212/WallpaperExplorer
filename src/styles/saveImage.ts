import { StyleSheet } from 'react-native';

import { height, width } from 'consts/Layout';

export const savedStyles = StyleSheet.create({
	siItemsContainer: {
		height: height * 0.4,
		width: width * 0.48,
		marginBottom: 4,
	},
	siItemIconContainer: {
		zIndex: 10,
		height: 40,
		width: 40,
		right: 16,
		bottom: 16,
		borderRadius: 360,
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
});
