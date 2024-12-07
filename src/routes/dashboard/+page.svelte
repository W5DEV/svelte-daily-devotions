<script lang="ts">
	import DailyReadings from '../../DailyReadings.json';
	import { onMount } from 'svelte';
	import { currentUser, token, devotions, allUsers } from '../../store';
	import getUserInfo from '$lib/api/getUserInfo';
	import { goto } from '$app/navigation';
	import getDevotions from '$lib/api/getDevotions';
	import getAllUsers from '$lib/api/getAllUsers';
	import createNewDevotion from '$lib/api/createNewDevotion';
	import type { Devotion } from '$lib/types/devotion';
	import DefaultAvatar from '../../assets/avatar-placeholder.gif';

	let todaysDevotions = $state($devotions);
	let currentSubmission = $state('');
	let devotionStatus = $state(false);
	let activeDiscussionId = $state<string | null>(null);
	let isButtonDisabled = $state(true);

	function claculateDate() {
		const date = new Date();
		const day = date
			.getDate()
			.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const dateString = `${year}-${month}-${day}`;
		return dateString;
	}

	function calculateTodaysDevotions() {
		todaysDevotions = $devotions?.filter((devotion) => {
			const dateString = claculateDate();
			return devotion.date === dateString;
		});
	}

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

		if (true) {
			const users = await getAllUsers($token);
			allUsers.set(users);
		}
		const updatedDevotions = await getDevotions($token);
		devotions.set(updatedDevotions);

		if (!$devotions) {
			return;
		}
		calculateTodaysDevotions();

		hasUserSubmittedDailyDevotion();
	});

	function getUserProfilePic(user: string) {
		const userProfilePic = $allUsers?.find((u) => u.name === user)?.image_url;
		if (userProfilePic == 'null') {
			return DefaultAvatar;
		}
		return userProfilePic;
	}

	function getDailyReading() {
		const dateString = claculateDate();
		const todaysReading = DailyReadings.find((reading) => reading.date === dateString);
		return todaysReading?.reading;
	}

	function hasUserSubmittedDailyDevotion() {
		if (todaysDevotions.some((devotion) => devotion.user === $currentUser?.name)) {
			devotionStatus = true;
		}
	}

	async function handleDevotionSubmit() {
		if ($currentUser && $token) {
			const todaysDevotion: Devotion = {
				user: $currentUser?.name,
				content: currentSubmission,
				date: claculateDate()
			};
			await createNewDevotion(todaysDevotion, $token);
			const updatedDevotions = await getDevotions($token);
			devotions.set(updatedDevotions);
			calculateTodaysDevotions();
			hasUserSubmittedDailyDevotion();
			currentSubmission = '';
			return;
		}
	}
	async function handleCommentSubmit(id: string) {
		if ($currentUser && $token) {
			const todaysDevotion: Devotion = {
				user: $currentUser?.name,
				content: currentSubmission.trim(),
				date: claculateDate(),
				parent_id: id
			};
			await createNewDevotion(todaysDevotion, $token);
			const updatedDevotions = await getDevotions($token);
			devotions.set(updatedDevotions);
			calculateTodaysDevotions();
			hasUserSubmittedDailyDevotion();
			currentSubmission = '';
			activeDiscussionId = null;
			return;
		}
	}

	function caclculateMainDevotions() {
		const mainDevotions = todaysDevotions.filter(
			(devotion) => devotion.parent_id === '00000000-0000-0000-0000-000000000000'
		);
		return mainDevotions;
	}

	function calculateDevotionComments(id: string) {
		const filteredComments = todaysDevotions.filter((devotion) => devotion.parent_id === id);
		filteredComments.sort((a, b) => {
			return new Date(a.date).getTime() - new Date(b.date).getTime();
		});
		return filteredComments;
	}

	function toggleCommentForm(discussionId: string) {
		if (activeDiscussionId === discussionId) {
			activeDiscussionId = null;
		} else {
			activeDiscussionId = discussionId;
		}
	}

	function checkButtonState() {
		if (currentSubmission.trim().length > 0) {
			isButtonDisabled = false;
		} else {
			isButtonDisabled = true;
		}
	}
</script>

{#if $currentUser}
	<div class="flex min-h-screen w-full flex-col items-center justify-start bg-neutral-200 py-8">
		<div class="flex h-20 w-full flex-row items-center justify-between bg-cyan-500 px-4">
			<h1 class="text-2xl font-bold text-white">Devotion Dashboard</h1>
			<div class="flex flex-row items-center justify-center gap-8">
				<h1 class="text-2xl font-bold text-white">{$currentUser.name}</h1>
				<img
					class="h-12 rounded-full"
					src={getUserProfilePic($currentUser.name)}
					alt="User Avatar"
				/>
			</div>
		</div>
		<div class="items center my-6 flex w-full flex-col justify-center gap-2 text-center">
			<h2 class="text-2xl font-bold">Your daily reading for today is {getDailyReading()}</h2>
			<a href="/history" class="text-center text-blue-500 hover:underline">View Previous Dates</a>
		</div>
		{#if devotionStatus}
			<div class="flex w-full flex-col gap-4 px-8">
				{#each caclculateMainDevotions() as devotion}
					<div class="flex min-h-24 w-full flex-col gap-2 rounded-xl bg-white p-2">
						<div
							class="flex w-full flex-row items-center justify-start gap-2 border-b border-neutral-300 p-4"
						>
							<p class="text-lg font-semibold">{devotion.user}</p>
							<img
								class="h-8 rounded-full"
								src={getUserProfilePic(devotion.user)}
								alt="User Avatar"
							/>
						</div>
						<p class="border-b border-neutral-300 px-8 pb-6 pt-4 text-lg font-medium italic">
							{devotion.content}
						</p>
						<div>
							{#if calculateDevotionComments(devotion.id as string).length > 0}
								{#each calculateDevotionComments(devotion.id as string) as comment}
									<div class="flex min-h-24 w-full flex-row gap-2 rounded-xl bg-white py-4">
										<div
											class="flex w-full flex-row items-center justify-end gap-2 border-b border-neutral-300"
										>
											<p class="flex-1 px-8 pb-6 pt-4 text-right italic">
												{comment.content}
											</p>
											<div class="flex min-w-16 flex-row items-center justify-end gap-1">
												<p class="font-medium">{comment.user}</p>
												<img
													class="h-6 rounded-full"
													src={getUserProfilePic(comment.user)}
													alt="User Avatar"
												/>
											</div>
										</div>
									</div>
								{/each}
							{:else}
								<div class="flex min-h-24 w-full flex-row gap-2 rounded-xl bg-white py-4">
									<div
										class="flex w-full flex-row items-center justify-end gap-2 border-b border-neutral-300"
									>
										<p class="flex-1 px-8 pb-6 pt-4 italic">No Comments Yet</p>
									</div>
								</div>
							{/if}
						</div>
						<div>
							<div class="flex w-full flex-row items-center justify-end gap-4 p-4">
								<button
									type="button"
									class="flex flex-row items-center justify-center gap-1 text-sm font-medium text-black hover:italic"
									onclick={() => toggleCommentForm(devotion.id as string)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="h-4 w-4"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 4.5v15m7.5-7.5h-15"
										/>
									</svg>
									Add Comment
								</button>
							</div>
							{#if activeDiscussionId === devotion.id}
								<form class="flex w-full flex-col items-center justify-center gap-4">
									<textarea
										onkeyup={(event) => {
											const target = event.target as HTMLTextAreaElement | null;
											if (target) {
												currentSubmission = target.value;
												checkButtonState();
											}
										}}
										class="h-72 w-full rounded-xl border-gray-300"
										name="content"
										id="content"
									></textarea>
									<button
										type="button"
										disabled={isButtonDisabled}
										class="rounded-md bg-blue-500 px-4 py-2 text-xl text-white disabled:bg-gray-400"
										onclick={() => handleCommentSubmit(devotion.id as string)}>Submit</button
									>
								</form>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex w-full flex-col items-center justify-center bg-neutral-300 p-8">
				<span class="mb-4 w-full px-8 text-center"
					>Please Submit your discussion for today before viewing others.</span
				>
				<form class="flex w-full flex-col items-center justify-center gap-4">
					<textarea
						onkeyup={(event) => {
							const target = event.target as HTMLTextAreaElement | null;
							if (target) {
								currentSubmission = target.value;
								checkButtonState();
							}
						}}
						class="h-72 w-full rounded-xl border-none"
						name="content"
						id="content"
					></textarea>
					<button
						type="button"
						disabled={isButtonDisabled}
						class="rounded-md bg-blue-500 px-4 py-2 text-xl text-white disabled:bg-gray-400"
						onclick={() => handleDevotionSubmit()}>Submit</button
					>
				</form>
			</div>
		{/if}
	</div>
{/if}
