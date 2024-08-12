import { getItems } from '$lib/scheduler/db';
import { jobs, scheduleSubmissionJob } from '$lib/scheduler/schedule';

const initData = async () => {
	console.log('initialising existing data');
	const items = await getItems();
	const futureItems = items.filter((x) => x.dueDatetime.valueOf() > Date.now());
	console.log(`rescheduling ${futureItems.length} items`);

	for (const item of futureItems) {
		const job = scheduleSubmissionJob(item);
		if (item._id) {
			jobs[item._id] = job;
		}
		console.log(`rescheduled ${item._id}`);
	}
};
initData();
