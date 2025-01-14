<script lang="ts">
	let tickets: any[] = $state([]);

	async function getTickets() {
		for (let i = 1; i < 2; i++) {
			try {
				const response = await fetch(
					`https://app.atera.com/api/v3/tickets/lastmodified?page=1&itemsInPage=50&date=2025-01-01T19%3A38%3A57Z`,
					{
						method: 'GET',
						headers: {
							Accept: 'application/json',
							'X-API-KEY': `73fdafcf905b4f7ebb945825594446bb`,
							'Access-Control-Allow-Origin': '*'
						}
					}
				);

				if (!response.ok) {
					throw new Error(response.statusText);
				}

				const data = await response.json();
				console.log(data.items);
				tickets.push(data.items);
				return data.items;
			} catch (error) {
				console.error('createNewDevotion', error);
				throw error;
			}
		}
	}
</script>

<div>
	<h1>Tickets</h1>
	<button onclick={getTickets}>Get Tickets</button>
	{#if tickets}
		{#each tickets as ticket}
			{ticket}
		{/each}
	{/if}
</div>
