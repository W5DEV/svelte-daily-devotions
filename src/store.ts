import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '$lib/types/user';
import type { Devotion } from '$lib/types/devotion';

export const token = writable((browser && localStorage.getItem('token')) || null);
token.subscribe((val) => {
	if (browser) return (localStorage.token = val);
});

export const currentUser = writable<User | null>();
currentUser.subscribe((val) => {
	if (browser) return (localStorage.currentUser = val);
});

export const devotions = writable<Devotion[]>([]);
devotions.subscribe((val) => {
	if (browser) return (localStorage.devotions = val);
});
