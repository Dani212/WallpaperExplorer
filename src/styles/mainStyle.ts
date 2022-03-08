import { fontFamily } from 'consts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		//
		fontFamily,
		fontSize: 16,
	},
	buttonContainer: {
		width: 120,
		height: 45,
		borderRadius: 32,
		overflow: 'hidden',
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%',
	},
});
