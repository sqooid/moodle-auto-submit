import { EMAIL, PASSWORD, SECRET } from '$env/static/private';
import { moodleLogin, submitAssignment } from '$lib/moodle';
import { createItem, deleteItem, setDone, type SubmissionItemType } from './db';
import schedule from 'node-schedule';

export const scheduleSubmissionJob = (item: SubmissionItemType) => {
	// schedule job
	const job = schedule.scheduleJob(
		item.dueDatetime,
		async function (item: SubmissionItemType) {
			const page = await moodleLogin(item.url, EMAIL, PASSWORD, SECRET);
			try {
				await submitAssignment(page, false);
				if (item._id) {
					delete jobs[item._id];
					const updated = await setDone(item._id);
					console.log(`update done date ${updated}`);
				}
			} catch (e) {
				// notify if fails somehow
			}
		}.bind(null, item)
	);
	return job;
};

export const addNewSubmission = async (item: SubmissionItemType) => {
	const job = scheduleSubmissionJob(item);
	const doc = await createItem(item);
	jobs[doc._id] = job;
	return doc;
};

export const cancelSubmission = async (id: string) => {
	const deletedDb = await deleteItem(id);
	const deletedJob = jobs[id]?.cancel();
	if (deletedJob) delete jobs[id];
	return deletedDb && deleteItem;
};

export const jobs: Record<string, schedule.Job> = {};
