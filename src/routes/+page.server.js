/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	const loadedMeetups = [];

	try {
		const res = await fetch('https://meetups-svlte-default-rtdb.firebaseio.com/meetups.json');
		const data = await res.json();

		for (const key in data) {
			loadedMeetups.push({ ...data[key], id: key });
		}
	} catch (error) {
		throw new Error('Fetching meetups failed, please try again later!');
	}

	return { fetchedMeetups: loadedMeetups.reverse() };
}
