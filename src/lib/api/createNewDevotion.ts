import type { Devotion } from '$lib/types/devotion';

export default async function createNewDevotion(
	devotion: Devotion,
	token: string
): Promise<Devotion> {
	try {
		const response = await fetch('https://devotions.greatidea.dev/api/devotion/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(devotion)
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		return await response.json();
	} catch (error) {
		console.error('createNewDevotion', error);
		throw error;
	}
}
