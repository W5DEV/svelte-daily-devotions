import type { User } from '$lib/types/user';

export default async function getAllUsers(token: string): Promise<User[]> {
	try {
		const response = await fetch('https://devotions.greatidea.dev/api/users/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = await response.json();

		return data.data;
	} catch (error) {
		console.error('createNewDevotion', error);
		throw error;
	}
}
