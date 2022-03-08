module.exports = function (api) {
	api.cache(true);

	const moduleResolver = [
		'module-resolver',
		{
			root: ['./src'],
			alias: {
				types: './src/types',
				utils: './src/utils',
				hooks: './src/hooks',
				store: './src/store',
				consts: './src/consts',
				styles: './src/styles',
				screens: './src/screens',
				navigation: './src/navigation',
				reduxStore: './src/reduxStore',
				components: './src/components',
			},
		},
	];

	return {
		presets: ['babel-preset-expo'],
		plugins: [moduleResolver, 'react-native-reanimated/plugin'],
	};
};
