export type ImageResponeProps = {
	id: string;
	created_at: string;
	updated_at: string;
	width: number;
	height: number;
	color: string;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
		small_s3: string;
	};
	links: {
		self: string;
		html: string;
		download: string;
		download_location: string;
	};
	user: {
		id: string;
		updated_at: string;
		username: string;
		name: string;
		first_name: string;
		last_name: string;
		portfolio_url: string;
		bio: string;
		links: {
			html: string;
		};
		profile_image: {
			small: string;
			medium: string;
			large: string;
		};
	};
	imageIsSaved: boolean;
};

/**
 * @name ImageBSRefPorps Image Bottom Sheet Ref Props
 */
export type ImageBSRefPorps = {
	open: (imageItems: ImageResponeProps) => void;
	close: () => void;
};

/**
 * @name ImageLRefProps  Image Loading Ref Props
 */
export type ImageLRefProps = {
	open: () => void;
	close: () => void;
};
