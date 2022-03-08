import { ImageResponeProps } from './imagesExplore';

type SaveItemIdKey = 'saveItemId';
type SaveItemKey = 'saveItem';

export type StoreKeys = SaveItemKey | SaveItemIdKey;

export type AddMIToStoreProps = {
	key: StoreKeys;
	payload: string[] | ImageResponeProps[];
}[];

export type AddItemToStoreProps = {
	key: StoreKeys;
	payload: ImageResponeProps[];
};
