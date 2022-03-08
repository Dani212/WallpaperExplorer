import { ImageResponeProps } from './imagesExplore';

type RemoveSavedItem = {
	type: 'removeSavedItem';
	payload: { id: string; item: ImageResponeProps };
};

type AddSaveItems = {
	type: 'addSaveItems';
	payload: { id: string; item: ImageResponeProps };
};

type UpdateSaveItems = {
	type: 'updateSaveItems';
	payload: { id: string; item: ImageResponeProps };
};

type UpdateInitSaveItems = {
	type: 'updateInitSaveItems';
	payload: { ids: string[]; items: ImageResponeProps[] };
};

export type AppActionProps =
	| UpdateInitSaveItems
	| UpdateSaveItems
	| RemoveSavedItem
	| AddSaveItems;
