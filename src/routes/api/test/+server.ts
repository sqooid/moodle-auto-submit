import { submitAssignment } from '$lib/moodle';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PASSWORD, SECRET, USERNAME } from '$env/static/private';

export const GET: RequestHandler = async (event) => {
	console.log('Running test');

	await submitAssignment(
		'https://learning.monash.edu/mod/assign/view.php?id=608441&action=view',
		USERNAME,
		PASSWORD,
		SECRET
	);

	console.log('Done test');

	return json({});
};
