<script lang="ts">
	let name = $state('');
	let phone = $state('');

	let nameError = $state(false);
	let phoneError = $state(false);

	function capitalizeFirstLetter(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function handleSubmit(event: { preventDefault: () => void }) {
		event.preventDefault();
		if (name.length === 0) {
			nameError = true;
		}
		if (phone.length === 0) {
			phoneError = true;
		}
		phone = phone.replace(/[^0-9]/g, '');
		if (phone.length !== 10) {
			phoneError = true;
		}
		if (nameError || phoneError) {
			return;
		}
		name = capitalizeFirstLetter(name).trim();
		console.log(phone, name);
	}
</script>

<section class="flex h-full w-full flex-col items-center justify-center gap-8">
	<h1 class="text-center text-4xl font-bold">Welcome to your Daily Devotions!</h1>
	<p class="text-center text-lg">
		Please begin by logging in with your first name and phone number!
	</p>
	<form class="flex w-full max-w-md flex-col gap-8 p-8">
		<div class="flex flex-col">
			<label for="name" class="text-lg">First Name</label>
			<input
				type="text"
				id="name"
				name="name"
				class={`rounded-md border border-gray-300 p-2 ${nameError ? 'border-red-500' : ''}`}
				placeholder="John"
				onkeydown={(event) => {
					nameError = false;
					const target = event.target as HTMLInputElement | null;
					if (target) {
						name = target.value;
					}
				}}
			/>
			<div class="flex h-6 w-full items-center justify-center">
				<span class="text-center text-xs font-light text-red-500"
					>{nameError ? 'First Name is required' : ' '}</span
				>
			</div>
		</div>
		<div class="flex flex-col">
			<label for="phone" class="text-lg">Phone Number (10 Digits)</label>
			<input
				maxlength="10"
				type="tel"
				id="phone"
				name="phone"
				class={`rounded-md border border-gray-300 p-2 ${phoneError ? 'border-red-500' : ''}`}
				placeholder="6012345555"
				onkeydown={(event) => {
					phoneError = false;
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
		<button
			disabled={phoneError || nameError}
			onclick={handleSubmit}
			class="rounded-md bg-blue-500 p-2 text-white disabled:bg-gray-400">Submit</button
		>
	</form>
</section>
