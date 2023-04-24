<script>
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import MeetupItem from '$lib/components/Meetups/MeetupItem.svelte';
	import MeetupFilter from '$lib/components/Meetups/MeetupFilter.svelte';
	import Button from '$lib/components/UI/Button.svelte';
	import EditMeetup from '$lib/components/Meetups/EditMeetup.svelte';
	import LoadingSpinner from '$lib/components/UI/LoadingSpinner.svelte';
	import meetups from '$lib/meetups-store.js';

	export let data;

	let fetchedMeetups = data.fetchedMeetups;
	let editMode = null;
	let editedId;
	let isLoading;

	const dispatch = createEventDispatcher();

	let favsOnly = false;
	let unsubscribe;

	$: filteredMeetups = favsOnly
		? fetchedMeetups.filter((meetup) => meetup.isFavorite)
		: fetchedMeetups;

	onMount(() => {
		meetups.setMeetups(fetchedMeetups);
		unsubscribe = meetups.subscribe((items) => {
			fetchedMeetups = items;
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	function setFilter(event) {
		favsOnly = event.detail === 1;
	}

	function savedMeetup(event) {
		editMode = null;
		editedId = null;
	}

	function cancelEdit() {
		editMode = null;
		editedId = null;
	}

	function startEdit(event) {
		editMode = 'edit';
		editedId = event.detail;
	}

	function startAdd() {
		editMode = 'edit';
	}
</script>

<svelte:head>
	<title>All Meetups</title>
</svelte:head>

{#if editMode === 'edit'}
	<EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
	<LoadingSpinner />
{:else}
	<section id="meetup-controls">
		<MeetupFilter on:select={setFilter} />

		<Button on:click={startAdd}>New Meetup</Button>
	</section>
	{#if filteredMeetups.length === 0}
		<p id="no-meetups">No meetups found, you can start adding some</p>
	{/if}
	<section id="meetups">
		{#each filteredMeetups as meetup (meetup.id)}
			<div transition:scale animate:flip={{ duration: 300 }}>
				<MeetupItem
					id={meetup.id}
					title={meetup.title}
					subtitle={meetup.subtitle}
					description={meetup.description}
					imageUrl={meetup.imageUrl}
					address={meetup.address}
					isFav={meetup.isFavorite}
					email={meetup.contactEmail}
					on:edit={startEdit}
				/>
			</div>
		{/each}
	</section>
{/if}

<style>
	#meetups {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 1rem;
	}

	#no-meetups {
		margin: 1rem;
	}

	#meetup-controls {
		display: flex;
		justify-content: space-between;
		margin: 1rem;
	}

	@media (min-width: 768px) {
		#meetups {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
