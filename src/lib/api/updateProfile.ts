import type { User } from '$lib/types/user';

export default async function updateProfile(user: User, token: string): Promise<User> {
	try {
		const response = await fetch('https://devotions.greatidea.dev/api/users/', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(user)
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
