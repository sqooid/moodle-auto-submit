import { deleteItem, getItems, type SubmissionItemType } from '$lib/scheduler/db';
import { error, json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getAssignmentDueDate,
	getAssignmentTitle,
	moodleLogin,
	submitAssignment
} from '$lib/moodle';
import { env } from '$env/dynamic/private';
import { addNewSubmission, cancelSubmission } from '$lib/scheduler/schedule';
import moment from 'moment';

export const DELETE: RequestHandler = async (event) => {
	const body: { id: string } = await event.request.json();
	console.log(`cancelling item ${body.id}`);

	const result = await cancelSubmission(body.id);
	console.log(`cancel result ${result}`);

	if (result) {
		return text('');
	}
	error(400);
};

export const GET: RequestHandler = async (event) => {
	return json(await getItems());
};

export const POST: RequestHandler = async (event) => {
	const { url } = await event.request.json();
	console.log(`creating submission for ${url}`);

	// test if url works
	const page = await moodleLogin(url, env.EMAIL, env.PASSWORD, env.SECRET);
	try {
		console.log('trying dry submission');

		if (!env.FAKE) await submitAssignment(page, true);
	} catch (e) {
		console.log(e);
		error(400, { message: 'Assignment page is not compatible' });
	}
	const title = await getAssignmentTitle(page);
	const dueDatetime = await getAssignmentDueDate(page);
	const submitTime = (
		env.FAKE ? moment().add(20, 'seconds') : dueDatetime.subtract(15, 'minutes')
	).toDate();
	if (submitTime.valueOf() < Date.now()) {
		error(400, { message: 'Submission time is in the past' });
	}
	const item: SubmissionItemType = {
		title,
		url,
		dueDatetime: submitTime,
		addedDatetime: new Date()
	};
	const doc = await addNewSubmission(item);
	console.log(`created item ${JSON.stringify(doc, null, 2)}`);

	return json(doc);
};
