import { StyleSheet } from 'react-native';

import { width } from 'consts';

export const bsStyles = StyleSheet.create({
	bottoMSheetContainer: {
		zIndex: 10,
		backgroundColor: 'transparent',
		...StyleSheet.absoluteFillObject,
	},
	bottoMSheetBody: {
		flex: 1,
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
	bottomSheetContent: {
		width,
		height: 220,
		elevation: 10,
		paddingVertical: 18,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	bsImageNameContainer: {
		marginHorizontal: 16,
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: 'transparent',
	},
	bottomSheetImage: { height: 55, width: 55, borderRadius: 360 },
	bsiconItem: {
		flexDirection: 'row',
		alignItems: 'center',
		// marginTop: 8,
		height: 55,
	},
});
