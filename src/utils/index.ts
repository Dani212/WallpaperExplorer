import { colors } from 'consts';
import { useSelector } from 'react-redux';
import { SavedItemsState } from 'reduxStore/reducer';
import { ImageResponeProps } from 'types/imagesExplore';
/**
 *
 * @param response
 * @returns
 */
export const formateImageDataResponse = (
	response: ImageResponeProps[],
	savedItems: ImageResponeProps[]
	// : string[]
) => {
	// const savedItems = useSelector(SavedItemsState);
	console.log(savedItems.length, 'test');
	const result = response.map((value) => {
		return {
			id: value.id,
			created_at: value.created_at,
			updated_at: value.updated_at,
			width: value.width,
			height: value.height,
			color: value.color,
			urls: value.urls,
			links: value.links,
			user: {
				id: value.user.id,
				updated_at: value.user.updated_at,
				username: value.user.username,
				name: value.user.name,
				first_name: value.user.first_name,
				last_name: value.user.last_name,
				portfolio_url: value.user.portfolio_url,
				bio: value.user.bio,
				links: {
					html: value.user.links.html,
				},
				profile_image: value.user.profile_image,
			},
			imageIsSaved: savedItems.some((v) => v.id === value.id),
		};
	});

	return result;
};

/**
 * @name pColor means pick color
 * @description This function is used to pick ehti
 */
export const pColor = (dark: boolean): typeof colors.dark => {
	return colors[dark ? 'dark' : 'light'];
};

export * from './asyncstore';
