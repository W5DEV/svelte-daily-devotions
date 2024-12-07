<script lang="ts">
	import loginUser from '$lib/api/loginUser';
	import { onMount } from 'svelte';
	import { currentUser, token } from '../store';
	import getUserInfo from '$lib/api/getUserInfo';
	import { goto } from '$app/navigation';

	let password = $state('');
	let phone = $state('');

	let passwordError = $state(false);
	let phoneError = $state(false);

	onMount(async () => {
		if ($currentUser) {
			goto('/dashboard');
		} else {
			if (!$token) {
				return;
			}
			const userInfo = await getUserInfo($token);
			currentUser.set(userInfo);
			goto('/dashboard');
		}
	});

	async function handleSubmit(event: { preventDefault: () => void }) {
		event.preventDefault();
		if (password.length === 0) {
			passwordError = true;
		}
		if (phone.length === 0) {
			phoneError = true;
		}
		phone = phone.replace(/[^0-9]/g, '');
		if (phone.length !== 10) {
			phoneError = true;
		}
		if (passwordError || phoneError) {
			return;
		}
		const userToken = await loginUser({ phone: phone, password: password });
		token.set(userToken);
		if ($token) {
			const userInfo = await getUserInfo($token);
			currentUser.set(userInfo);
			goto('/dashboard');
		}
	}
</script>

<section class="flex h-full w-full flex-col items-center justify-center gap-8">
	<h1 class="text-center text-4xl font-bold">Welcome to your Daily Devotions!</h1>
	<p class="text-center text-lg">
		Please begin by logging in with your first name and phone number!
	</p>
	<form class="flex w-full max-w-md flex-col gap-8 p-8">
		<div class="flex flex-col">
			<label for="phone" class="text-lg">Phone Number (10 Digits)</label>
			<input
				maxlength="10"
				type="tel"
				id="phone"
				name="phone"
				class={`rounded-md border border-gray-300 p-2 ${phoneError ? 'border-red-500' : ''}`}
				placeholder="6012345555"
				onkeydown={() => {
					phoneError = false;
				}}
				onchange={(event) => {
					const target = event.target as HTMLInputElement | null;
					if (target) {
						phone = target.value;
					}
				}}
			/>
			<div class="flex h-6 w-full items-center justify-center">
				<span class="text-center text-xs font-light text-red-500"
					>{phoneError ? 'Please check your phone number (10 digits necessary!)' : ' '}</span
				>
			</div>
		</div>
		<div class="flex flex-col">
			<label for="password" class="text-lg">Password</label>
			<input
				type="text"
				id="password"
				name="password"
				class={`rounded-md border border-gray-300 p-2 ${passwordError ? 'border-red-500' : ''}`}
				placeholder="******"
				onkeydown={() => {
					passwordError = false;
				}}
				onchange={(event) => {
					const target = event.target as HTMLInputElement | null;
					if (target) {
						password = target.value;
					}
				}}
			/>
			<div class="flex h-6 w-full items-center justify-center">
				<span class="text-center text-xs font-light text-red-500"
					>{passwordError ? 'Password is required' : ' '}</span
				>
			</div>
		</div>
		<button
			type="button"
			disabled={phoneError || passwordError}
			onclick={handleSubmit}
			class="rounded-md bg-blue-500 p-2 text-white disabled:bg-gray-400">Submit</button
		>
	</form>
</section>
