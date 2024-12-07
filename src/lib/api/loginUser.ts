interface ILoginInfo {
	password: string;
	phone: string;
}

export default async function loginUser({ phone, password }: ILoginInfo): Promise<string> {
	const loginInfo = {
		phone: phone,
		password: password
	};
	try {
		const response = await fetch('http://localhost:34500/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(loginInfo)
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = await response.json();
		return data.token;
	} catch (error) {
		console.error('loginUser', error);
		throw error;
	}
}
