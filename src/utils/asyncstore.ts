import AsyncStorage from '@react-native-async-storage/async-storage';

import { AddItemToStoreProps, AddMIToStoreProps, StoreKeys } from 'types';

/**
 * @name addMIToStore Add Multiple Items To Store
 */
export const addMIToStore = async (data: AddMIToStoreProps) => {
	const result: [string, string][] = data.map((v) => [
		v.key,
		JSON.stringify(v.payload),
	]);

	try {
		await AsyncStorage.multiSet(result);
	} catch (err) {
		//
	}
};

/**
 * @name getMIToStore Get Multiple Items From Store
 */
export const getMIToStore = async (keys: StoreKeys[]) => {
	try {
		const result = await AsyncStorage.multiGet([...keys]);

		if (typeof result === 'object') {
			const formatedResult = result.map((v) => {
				if (v[1] === null) {
					return null;
				} else {
					return JSON.parse(v[1]);
				}
			});

			return formatedResult;
		}
		return [];
	} catch (err) {
		//
	}
};

export const addItemToStore = async ({ key, payload }: AddItemToStoreProps) => {
	const result = JSON.stringify(payload);

	try {
		await AsyncStorage.setItem(key, result);
	} catch (err) {
		//
	}
};

export const getItemFromStore = async (keys: StoreKeys) => {
	try {
		const result = await AsyncStorage.getItem(keys);

		if (result !== null) {
			return JSON.parse(result);
		}
		return [];
	} catch (err) {
		//
	}
};
