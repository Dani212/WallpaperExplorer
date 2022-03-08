import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'reduxStore/store';
import { ImageResponeProps, StoreKeys } from 'types';
import {
	addItemToStore,
	formateImageDataResponse,
	getItemFromStore,
} from 'utils';

export type InitialStateProps = {
	imageList: ImageResponeProps[];
	saveItems: ImageResponeProps[];
};

const initialState: InitialStateProps = {
	imageList: [],
	saveItems: [],
};

export const fetchSaveImageData = createAsyncThunk(
	'users/fetchByIdStatus',
	async (key: StoreKeys, thunkAPI) => {
		thunkAPI.getState();
		const response = await getItemFromStore(key);
		return response;
	}
);

const addRemoveSaveItems = (
	prevSaveItems: ImageResponeProps[],
	saveItem: ImageResponeProps
) => {
	const index = prevSaveItems.findIndex((v) => v.id === saveItem.id);

	if (index > -1) {
		const result = prevSaveItems.filter((v) => v.id !== saveItem.id);

		return result;
	}

	return [...prevSaveItems, saveItem];
};

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		updateImageList: (
			state,
			action: PayloadAction<{ data: ImageResponeProps[]; aT?: 'l' }>
		) => {
			const formatedResult = formateImageDataResponse(
				action.payload.data,
				state.saveItems
				// savedImages.current
			);
			if (action.payload.aT !== 'l') {
				state.imageList = [...formatedResult];
			} else {
				state.imageList = [...state.imageList, ...formatedResult];
			}
		},
		addSaveToImageList: (state, action: PayloadAction<string[]>) => {
			const result = [...state.imageList];

			result.forEach((v, i) => {
				if (action.payload.includes(v.id)) {
					result[i] = {
						...result[i],
						imageIsSaved: true,
					};
				}
			});
			// console.log(result[0].imageIsSaved);

			state.imageList = [...result];
		},
		removeSaveFromImageList: (
			state,
			action: PayloadAction<ImageResponeProps>
		) => {
			const index = state.imageList.findIndex(
				(v) => v.id === action.payload.id
			);

			if (index > -1) {
				const result = [...state.imageList];
				result[index] = {
					...result[index],
					imageIsSaved: false,
				};
				state.imageList = [...result];
			}
		},
		updateSaveImages: (state, action: PayloadAction<ImageResponeProps>) => {
			const saveItemsResult = [
				...addRemoveSaveItems(state.saveItems, {
					...action.payload,
					imageIsSaved: true,
				}),
			];

			state.saveItems = [...saveItemsResult];

			addItemToStore({ key: 'saveItem', payload: [...saveItemsResult] });
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchSaveImageData.fulfilled, (state, action) => {
			state.saveItems = action.payload;
		});
	},
});

export const SavedItemsState = (state: RootState) => state.app.saveItems;

export const ImageListState = (state: RootState) => state.app.imageList;

export const {
	updateImageList,
	updateSaveImages,
	addSaveToImageList,
	removeSaveFromImageList,
} = appSlice.actions;

export default appSlice.reducer;
