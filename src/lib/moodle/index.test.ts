import { expect, test } from 'vitest';
import { parseDateString } from '.';
import moment from 'moment';

test('date parser works', () => {
	const date = 'Friday, 16 August 2024, 4:30 PM';
	const parsedDate = parseDateString(date);
	const correctDate = moment('2024-08-16 16:30');

	expect(parsedDate.valueOf()).toEqual(correctDate.valueOf());
});
