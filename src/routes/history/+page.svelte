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
	import getUserAvatar from '$lib/utils/getUserAvatar';
	import getBibleChapterLink from '$lib/utils/getBibleChapterLink';

	function todaysDate() {
		const date: Date = new Date();
		date.setDate(date.getDate() - 1);
		return date;
	}

	let todaysDevotions = $state($devotions);
	let currentSubmission = $state('');
	let devotionStatus = $state(false);
	let selectedDate = $state(todaysDate());
	let activeDiscussionId = $state<string | null>(null);
	let isButtonDisabled = $state(true);

	function claculateDate() {
		const date = new Date(selectedDate);
		date.setDate(date.getDate() + 1);
		const day = date
			.getDate()
			.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const dateString = `${year}-${month}-${day}`;
		return dateString;
	}

	async function calculateTodaysDevotions() {
		todaysDevotions = $devotions?.filter((devotion) => {
			const dateString = claculateDate();
			return devotion.date === dateString;
		});
		todaysDevotions.sort((a, b) => {
			return new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime();
		});
		hasUserSubmittedDailyDevotion();
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
	});

	function getUserProfilePic(user: string) {
		return getUserAvatar(user);
	}

	function getDailyReading() {
		const dateString = claculateDate();
		const todaysReading = DailyReadings.find((reading) => reading.date === dateString);
		return todaysReading?.reading;
	}

	function hasUserSubmittedDailyDevotion() {
		devotionStatus = false;
		if (todaysDevotions.length === 0) {
			devotionStatus = false;
			return;
		}
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
			return new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime();
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
	<div class="flex min-h-screen w-full flex-col items-center justify-start bg-neutral-200">
		<div class="flex h-20 w-full flex-row items-center justify-between bg-green-800 px-4">
			<h1 class="text-2xl font-bold text-white">Devotion Dashboard</h1>
			<div class="flex flex-row items-center justify-center gap-8">
				<h1 class="text-2xl font-bold text-white">{$currentUser.name}</h1>
				<img
					class="h-12 w-12 rounded-full"
					src={getUserProfilePic($currentUser.name)}
					alt="User Avatar"
				/>
			</div>
		</div>
		<div class="my-6 flex w-full flex-col items-center justify-center gap-2">
			<h2 class="text-center text-2xl font-bold">
				The daily reading for {claculateDate()} was {getDailyReading()}
			</h2>
			<a
				target="_blank"
				href={getBibleChapterLink(getDailyReading() as string)}
				class="text-center text-xl font-semibold text-red-700 hover:underline"
				>Read {getDailyReading()} Online Now!</a
			>
			<div class="items center flex w-full flex-col justify-center text-center">
				<a href="/dashboard" class="text-center text-green-800 underline hover:italic"
					>Return to Today</a
				>
			</div>
			<input type="date" bind:value={selectedDate} onchange={() => calculateTodaysDevotions()} />
		</div>
		{#if devotionStatus}
			<div class="flex w-full flex-col gap-4 p-8">
				{#each caclculateMainDevotions() as devotion}
					<div class="flex min-h-24 w-full flex-col gap-2 rounded-xl bg-white p-2">
						<div
							class="flex w-full flex-row items-center justify-start gap-2 border-b border-neutral-300 p-4"
						>
							<img
								class="h-8 w-8 rounded-full"
								src={getUserProfilePic(devotion.user)}
								alt="User Avatar"
							/>
							<p class="text-lg font-semibold">{devotion.user}</p>
						</div>
						<p class="border-b border-neutral-300 px-8 pb-6 pt-4 text-lg font-normal italic">
							{@html devotion.content.replace(/\n/g, '<br />')}
						</p>
						<div>
							{#if calculateDevotionComments(devotion.id as string).length > 0}
								{#each calculateDevotionComments(devotion.id as string) as comment}
									<div class="flex min-h-24 w-full flex-row gap-2 rounded-xl bg-white py-4">
										<div
											class="flex w-full flex-row items-center justify-end gap-2 border-b border-neutral-300"
										>
											<p class="flex-1 px-8 pb-6 pt-4 text-left italic">
												{@html comment.content.replace(/\n/g, '<br />')}
											</p>
											<div class="flex min-w-16 flex-row items-center justify-end gap-1">
												<p class="font-medium">{comment.user}</p>
												<img
													class="h-6 w-6 rounded-full"
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
									class="flex flex-row items-center justify-center gap-1 text-sm font-medium text-green-600 hover:italic"
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
										class="rounded-md bg-green-700 px-4 py-2 text-xl text-white disabled:bg-gray-400"
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
					>Please Submit your discussion for {selectedDate} before viewing others.</span
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
						class="rounded-md bg-green-700 px-4 py-2 text-xl text-white disabled:bg-gray-400"
						onclick={() => handleDevotionSubmit()}>Submit</button
					>
				</form>
			</div>
		{/if}
	</div>
{/if}
