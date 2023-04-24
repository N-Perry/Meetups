/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
	const meetupId = params.id;
	let loadedMeetup = {};

	try {
		const res = await fetch(
			`https://meetups-svlte-default-rtdb.firebaseio.com/meetups/${meetupId}.json`
		);
		loadedMeetup = await res.json();
	} catch (error) {
		throw new Error(404, 'Could not fetch meetup!');
	}

	return { loadedMeetup: { ...loadedMeetup, id: meetupId } };
}
