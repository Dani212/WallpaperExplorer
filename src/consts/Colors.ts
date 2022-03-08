const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
	light: {
		text: '#000',
		view: '#ffffff',
		button: '#445cbd',
		background: '#fff',
		tint: tintColorLight,
		tabIconDefault: '#ccc',
		pressed: 'rgba(0,0,0, 0.1)',
		tabIconSelected: tintColorLight,
		modalBg: 'rgba(250, 250,250,0.7)',
		dividerLine: '#rgba(0, 0, 0, 0.1)',
	},
	dark: {
		text: '#fff',
		view: '#222222',
		button: '#445cbd',
		background: '#000',
		tint: tintColorDark,
		tabIconDefault: '#ccc',
		modalBg: 'rgba(0, 0,0,0.1)',
		tabIconSelected: tintColorDark,
		pressed: 'rgba(255, 255, 255, 0.3)',
		dividerLine: '#rgba(200, 200, 200, 0.5)',
	},
};
