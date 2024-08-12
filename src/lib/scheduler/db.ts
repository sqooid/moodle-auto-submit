import { DB_PATH } from '$env/static/private';
import Datastore from '@seald-io/nedb';

const db = new Datastore({ filename: DB_PATH || 'data/db', autoload: true });

export type SubmissionItemType = {
	_id?: string;
	addedDatetime: Date;
	doneDatetime?: Date;
	title: string;
	url: string;
	dueDatetime: Date;
};

export const setDone = async (itemId: string) => {
	const newDoc = await db.updateAsync(
		{ _id: itemId },
		{
			$set: {
				doneDatetime: new Date()
			}
		}
	);
	return newDoc.numAffected == 1;
};

export const createItem = async (item: SubmissionItemType) => {
	const newDoc = await db.insertAsync(item);
	return newDoc;
};

export const deleteItem = async (itemId: string) => {
	const numRemoved = await db.removeAsync({ _id: itemId }, {});
	return numRemoved > 0;
};

export const getItems = async (options = {}) => {
	const docs = await db.findAsync<SubmissionItemType>({}).sort({ dueDatetime: -1 }).limit(100);
	return docs;
};
