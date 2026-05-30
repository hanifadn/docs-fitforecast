<script lang="ts">
	let { session }: {
		session: {
			day: string;
			workout_type: string;
			duration_minutes: number;
			exercises: Array<{
				name: string;
				sets: number;
				reps: number;
				weight_kg?: number;
				duration_minutes?: number;
				notes?: string;
			}>;
		};
	} = $props();

	let expanded = $state(false);

	function toggle() {
		expanded = !expanded;
	}
</script>

<div class="rounded-lg border border-border bg-card">
	<button
		class="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
		onclick={toggle}
		aria-expanded={expanded}
	>
		<div class="flex items-center gap-3">
			<span class="text-sm font-medium text-foreground">{session.day}</span>
			<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
				{session.workout_type}
			</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-xs text-muted-foreground">{session.duration_minutes} min</span>
			<svg
				class="h-4 w-4 text-muted-foreground transition-transform {expanded ? 'rotate-180' : ''}"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
	</button>

	{#if expanded}
		<div class="border-t border-border px-4 py-3">
			<ul class="space-y-2">
				{#each session.exercises as exercise}
					<li class="flex items-start justify-between text-sm">
						<span class="text-foreground">{exercise.name}</span>
						<span class="text-muted-foreground">
							{#if exercise.sets && exercise.reps}
								{exercise.sets} &times; {exercise.reps}
								{#if exercise.weight_kg}
									&times; {exercise.weight_kg} kg
								{/if}
							{:else if exercise.duration_minutes}
								{exercise.duration_minutes} min
							{/if}
						</span>
					</li>
					{#if exercise.notes}
						<li class="pl-2 text-xs text-muted-foreground">&mdash; {exercise.notes}</li>
					{/if}
				{/each}
			</ul>
		</div>
	{/if}
</div>
