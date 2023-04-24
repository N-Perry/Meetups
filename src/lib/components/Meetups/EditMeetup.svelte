<script>
	import TextInput from '../UI/TextInput.svelte';
	import Button from '../UI/Button.svelte';
	import Modal from '../UI/Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import { isEmpty, isValidEmail } from '../../helpers/validation';
	import meetups from '$lib/meetups-store.js';
	import Error from '../UI/Error.svelte';

	export let id = null;

	let title = '';
	let subtitle = '';
	let description = '';
	let address = '';
	let contactEmail = '';
	let imageUrl = '';
	let error;

	if (id) {
		const unsubscribe = meetups.subscribe((items) => {
			const selectedMeetup = items.find((i) => i.id === id);

			title = selectedMeetup.title;
			subtitle = selectedMeetup.subtitle;
			description = selectedMeetup.description;
			address = selectedMeetup.address;
			contactEmail = selectedMeetup.contactEmail;
			imageUrl = selectedMeetup.imageUrl;
		});

		unsubscribe();
	}

	const dispatch = createEventDispatcher();

	$: titleValid = !isEmpty(title);
	$: subtitleValid = !isEmpty(subtitle);
	$: descriptionValid = !isEmpty(description);
	$: addressValid = !isEmpty(address);
	$: emailValid = isValidEmail(contactEmail);
	$: imageUrlValid = !isEmpty(imageUrl);
	$: formIsValid =
		titleValid && subtitleValid && descriptionValid && addressValid && emailValid && imageUrlValid;

	function submitForm() {
		const meetupData = {
			title,
			subtitle,
			description,
			imageUrl,
			address,
			contactEmail
		};

		if (id) {
			fetch(`https://meetups-svlte-default-rtdb.firebaseio.com/meetups/${id}.json`, {
				method: 'PATCH',
				body: JSON.stringify({ ...meetupData }),
				headers: { 'Content-Type': 'application/json' }
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error('An error occured, please try again!');
					}
					meetups.updateMeetup(id, meetupData);
				})
				.catch((err) => {
					error = err;
					console.log(err);
				});
		} else {
			fetch('https://meetups-svlte-default-rtdb.firebaseio.com/meetups.json', {
				method: 'POST',
				body: JSON.stringify({ ...meetupData, isFavorite: false }),
				headers: { 'Content-Type': 'application/json' }
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error('An error occured, please try again!');
					}
					return res.json();
				})
				.then((data) => {
					meetups.addMeetup({
						...meetupData,
						isFavorite: false,
						id: data.name
					});
				})
				.catch((err) => {
					error = err;
					console.log(err);
				});
		}

		dispatch('save');
	}

	function cancel() {
		dispatch('cancel');
	}

	function deleteMeetup() {
		fetch(`https://meetups-svlte-default-rtdb.firebaseio.com/meetups/${id}.json`, {
			method: 'DELETE'
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error('An error occured, please try again!');
				}
				meetups.removeMeetup(id);
			})
			.catch((err) => {
				error = err;
				console.log(err);
			});
		dispatch('save');
	}
</script>

{#if error}
	<Error message={error.message} />
{/if}

<Modal title="Edit Meetup Data" on:cancel>
	<form on:submit|preventDefault={submitForm}>
		<TextInput
			id="title"
			label="Title"
			value={title}
			valid={titleValid}
			validityMessage={'Please enter a valid title.'}
			on:input={(event) => (title = event.target.value)}
		/>
		<TextInput
			id="subtitle"
			label="Subtitle"
			value={subtitle}
			valid={subtitleValid}
			validityMessage={'Please enter a valid subtitle.'}
			on:input={(event) => (subtitle = event.target.value)}
		/>
		<TextInput
			id="address"
			label="Address"
			value={address}
			valid={addressValid}
			validityMessage={'Please enter a valid address.'}
			on:input={(event) => (address = event.target.value)}
		/>
		<TextInput
			id="imageUrl"
			label="Image URL"
			value={imageUrl}
			valid={imageUrlValid}
			validityMessage={'Please enter a valid image URL.'}
			on:input={(event) => (imageUrl = event.target.value)}
		/>
		<TextInput
			type="email"
			id="email"
			label="E-Mail"
			value={contactEmail}
			valid={emailValid}
			validityMessage={'Please enter a valid E-Mail.'}
			on:input={(event) => (contactEmail = event.target.value)}
		/>
		<TextInput
			controlType="textarea"
			id="description"
			label="Description"
			valid={descriptionValid}
			validityMessage={'Please enter a valid description.'}
			bind:value={description}
		/>
	</form>
	<div slot="footer">
		<Button type="submit" mode="outline" on:click={cancel}>Cancel</Button>
		<Button type="submit" on:click={submitForm} disabled={!formIsValid}>Save</Button>
		{#if id}
			<Button on:click={deleteMeetup}>Delete</Button>
		{/if}
	</div>
</Modal>

<style>
	form {
		width: 100%;
	}
</style>
