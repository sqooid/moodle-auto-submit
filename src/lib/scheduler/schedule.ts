import { env } from '$env/dynamic/private';
import { moodleLogin, submitAssignment } from '$lib/moodle';
import { createItem, deleteItem, setDone, type SubmissionItemType } from './db';
import schedule from 'node-schedule';
import { sendDiscordNotification } from './discord';

export const scheduleSubmissionJob = (item: SubmissionItemType) => {
	// schedule job
	const job = schedule.scheduleJob(
		item.dueDatetime,
		async function (item: SubmissionItemType) {
			console.log(`running submission for ${item.url}`);
			try {
				const page = await moodleLogin(item.url, env.EMAIL, env.PASSWORD, env.SECRET);
				if (!env.FAKE) await submitAssignment(page, false);
				if (item._id) {
					delete jobs[item._id];
					const updated = await setDone(item._id);
					console.log(`update done date ${updated}`);
				}
				await sendDiscordNotification(item, true);
			} catch (e) {
				console.log(`submission failed: ${e}`);

				// notify if fails somehow
				await sendDiscordNotification(item, false);
			}
		}.bind(null, item)
	);
	return job;
};

export const addNewSubmission = async (item: SubmissionItemType) => {
	const doc = await createItem(item);
	const job = scheduleSubmissionJob(doc);
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
