import { writable } from "svelte/store";

const meetups = writable([]);

const customMeetups = {
  subscribe: meetups.subscribe,
  setMeetups: (meetupArray) => {
    meetups.set(meetupArray);
  },
  addMeetup: (meetupData) => {
    const newMeetup = {
      ...meetupData,
    };
    meetups.update((existingItems) => {
      return [newMeetup, ...existingItems];
    });
  },
  updateMeetup: (id, meetupData) => {
    meetups.update((existingItems) => {
      const meetupIndex = existingItems.findIndex((i) => i.id === id);
      const updatedMeetup = { ...existingItems[meetupIndex], ...meetupData };
      const updatedMeetups = [...existingItems];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  removeMeetup: (id) => {
    meetups.update((existingItems) => {
      return existingItems.filter((item) => item.id !== id);
    });
  },
  toggleFavorite: (id) => {
    meetups.update((existingItems) => {
      const updatedMeetup = { ...existingItems.find((m) => m.id === id) };
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const index = existingItems.findIndex((m) => m.id === id);
      const updatedMeetups = [...existingItems];
      updatedMeetups[index] = updatedMeetup;
      return updatedMeetups;
    });
  },
};
export default customMeetups;
