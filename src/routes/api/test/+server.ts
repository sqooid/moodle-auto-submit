import { getAssignmentDueDate, moodleLogin, submitAssignment } from '$lib/moodle';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PASSWORD, SECRET, EMAIL } from '$env/static/private';

export const GET: RequestHandler = async (event) => {
	console.log('Running test');

	const page = await moodleLogin(
		'https://learning.monash.edu/mod/assign/view.php?id=608441&action=view',
		EMAIL,
		PASSWORD,
		SECRET
	);
	// await submitAssignment(page);
	const dueDate = await getAssignmentDueDate(page);
	console.log(dueDate);

	console.log('Done test');
	await page.screenshot({ path: 'test-files/test.png', fullPage: true });

	return json({});
};
