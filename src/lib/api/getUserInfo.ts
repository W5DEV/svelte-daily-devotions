import type { User } from '$lib/types/user';

export default async function getUserInfo(token: string): Promise<User> {
	try {
		const response = await fetch('https://devotions.greatidea.dev/api/users/me', {
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

		return data.data.user;
	} catch (error) {
		console.error('createNewDevotion', error);
		throw error;
	}
}
