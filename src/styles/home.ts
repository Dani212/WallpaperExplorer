import { height } from 'consts';
import { Platform, StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
	sideBarContainer: {
		right: 0,
		zIndex: 10,
		position: 'absolute',
		alignItems: 'center',
		height: height * 0.35,
		bottom: Platform.OS === 'ios' ? 120 : 100,
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
	unsplashText: {
		padding: 0,
		// bottom: 24,
		left: 18,
		position: 'absolute',
		paddingHorizontal: 10,
		top: Platform.OS === 'ios' ? 34 : 24,
		backgroundColor: 'rgba(0,0,0,0.4)',
		borderRadius: 16,
	},
});
