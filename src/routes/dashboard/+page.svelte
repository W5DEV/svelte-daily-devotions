<script lang="ts">
	import loginUser from '$lib/api/loginUser';
	import { onMount } from 'svelte';
	import { currentUser, token } from '../../store';
	import getUserInfo from '$lib/api/getUserInfo';
	import { goto } from '$app/navigation';

	onMount(async () => {
		if (!$token) {
			currentUser.set(null);
			token.set(null);
			goto('/');
			return;
		}
		if (!$currentUser) {
			const userInfo = await getUserInfo($token);
			currentUser.set(userInfo);
		}
	});
</script>

{#if $currentUser}
	<span>Hello, {$currentUser.name}! Your phone number is {$currentUser.phone}</span>
	<img src={$currentUser.image_url} alt="User Avatar" />
{/if}
