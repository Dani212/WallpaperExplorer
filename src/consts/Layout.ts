import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const isSmallDevice = width < 375;

const textSizes = {
	small: 14,
	normal: 16,
	large: 18,
	xl: 24,
	xxl: 28,
	xxxl: 32,
};

export { width, height, isSmallDevice, textSizes };
