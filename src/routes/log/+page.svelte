<script lang="ts">
	import Disclaimer from '$lib/components/layout/Disclaimer.svelte';
	import SessionCard from '$lib/components/shared/SessionCard.svelte';
	import WeightChart from '$lib/components/charts/WeightChart.svelte';
	import BodyFatChart from '$lib/components/charts/BodyFatChart.svelte';
	import MuscleMassChart from '$lib/components/charts/MuscleMassChart.svelte';
	import VisceralFatChart from '$lib/components/charts/VisceralFatChart.svelte';
	import WhrChart from '$lib/components/charts/WhrChart.svelte';

	let { data } = $props();
	let fitData = $derived(data.fitData);
	let bodyComp = $derived(fitData.body_composition_tracking);
	let exerciseLog = $derived(fitData.exercise_log);
	let library = $derived(fitData.exercise_library);

	let activeTab = $state<'body-comp' | 'exercise-log'>('body-comp');

	let phases = $derived([...new Set(exerciseLog.map((w: { phase: string }) => w.phase))]);
	let activePhase = $state(phases[0] ?? '');

	let phaseWeeks = $derived(
		exerciseLog.filter((w) => w.phase === activePhase)
	);

	let expandedWeeks = $state<Set<number>>(new Set());

	function toggleWeek(week: number) {
		const next = new Set(expandedWeeks);
		if (next.has(week)) next.delete(week);
		else next.add(week);
		expandedWeeks = next;
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>Exercise Log & Body Composition — FitForecast</title>
	<meta name="description" content="Track weekly body composition changes and browse the full 8-month lower-back-safe exercise program." />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground">Exercise Log & Body Composition</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Track weekly body composition changes and browse the full 8-month exercise program.
		</p>
	</div>

	<!-- Tabs -->
	<div class="mb-8 flex gap-1 rounded-lg border border-border bg-card p-1">
		<button
			class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors {activeTab === 'body-comp' ? 'bg-primary text-background' : 'text-muted-foreground hover:text-foreground'}"
			onclick={() => activeTab = 'body-comp'}
		>
			Body Composition
		</button>
		<button
			class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors {activeTab === 'exercise-log' ? 'bg-primary text-background' : 'text-muted-foreground hover:text-foreground'}"
			onclick={() => activeTab = 'exercise-log'}
		>
			Exercise Log
		</button>
	</div>

	{#if activeTab === 'body-comp'}
		<!-- Charts -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="rounded-lg border border-border bg-card p-5">
				<h3 class="mb-4 text-sm font-semibold text-foreground">Weight (kg)</h3>
				<WeightChart tracking={bodyComp} />
			</div>
			<div class="rounded-lg border border-border bg-card p-5">
				<h3 class="mb-4 text-sm font-semibold text-foreground">Body Fat (%)</h3>
				<BodyFatChart tracking={bodyComp} />
			</div>
			<div class="rounded-lg border border-border bg-card p-5">
				<h3 class="mb-4 text-sm font-semibold text-foreground">Muscle Mass (kg)</h3>
				<MuscleMassChart tracking={bodyComp} />
			</div>
			<div class="rounded-lg border border-border bg-card p-5">
				<h3 class="mb-4 text-sm font-semibold text-foreground">Visceral Fat Level</h3>
				<VisceralFatChart tracking={bodyComp} />
			</div>
			<div class="rounded-lg border border-border bg-card p-5 lg:col-span-2">
				<h3 class="mb-4 text-sm font-semibold text-foreground">Waist-to-Hip Ratio</h3>
				<WhrChart tracking={bodyComp} />
			</div>
		</div>

		<!-- Data Table -->
		<div class="mt-8 overflow-x-auto rounded-lg border border-border">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-card">
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Week</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Weight</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Body Fat</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Muscle</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">WHR</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Visceral</th>
						<th class="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Notes</th>
					</tr>
				</thead>
				<tbody>
					{#each bodyComp as row, i}
						<tr class="border-b border-border transition-colors hover:bg-muted/30 {i === 0 ? 'bg-primary/5' : ''}">
							<td class="px-4 py-2.5 font-medium text-foreground">{row.week}</td>
							<td class="px-4 py-2.5 text-muted-foreground">{formatDate(row.date)}</td>
							<td class="px-4 py-2.5 text-right text-foreground">{row.weight_kg} kg</td>
							<td class="px-4 py-2.5 text-right text-foreground">{row.body_fat_percent}%</td>
							<td class="px-4 py-2.5 text-right text-foreground">{row.muscle_mass_kg} kg</td>
							<td class="px-4 py-2.5 text-right text-foreground">{row.waist_hip_ratio}</td>
							<td class="px-4 py-2.5 text-right text-foreground">{row.visceral_fat_level}</td>
							<td class="hidden max-w-xs truncate px-4 py-2.5 text-muted-foreground sm:table-cell">{row.notes}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<Disclaimer variant="inline" class="mt-4" />
	{:else}
		<!-- Phase Navigator -->
		<div class="mb-6 flex flex-wrap gap-2">
			{#each phases as phase}
				<button
					class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {activePhase === phase ? 'bg-primary text-background' : 'border border-border bg-card text-muted-foreground hover:text-foreground'}"
					onclick={() => activePhase = phase}
				>
					{phase}
				</button>
			{/each}
		</div>

		<!-- Weeks Accordion -->
		<div class="space-y-3">
			{#each phaseWeeks as week}
				<div class="rounded-lg border border-border bg-card">
					<button
						class="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
						onclick={() => toggleWeek(week.week)}
						aria-expanded={expandedWeeks.has(week.week)}
					>
						<div>
							<span class="text-sm font-semibold text-foreground">Week {week.week}</span>
							<span class="ml-2 text-xs text-muted-foreground">{week.phase}</span>
							{#if week.notes}
								<span class="ml-2 text-xs text-muted-foreground">— {week.notes}</span>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							<span class="text-xs text-muted-foreground">{week.sessions.length} sessions</span>
							<svg
								class="h-4 w-4 text-muted-foreground transition-transform {expandedWeeks.has(week.week) ? 'rotate-180' : ''}"
								fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</button>

					{#if expandedWeeks.has(week.week)}
						<div class="space-y-2 border-t border-border px-5 py-4">
							{#each week.sessions as session}
								<SessionCard session={{
									day: `Day ${session.day}${session.date ? ` (${formatDate(session.date)})` : ''}`,
									workout_type: session.workout_type,
									duration_minutes: session.duration_minutes ?? 0,
									exercises: (session.exercises ?? []).map(e => ({
										name: e.name,
										sets: e.sets ?? 0,
										reps: e.reps ?? 0,
										weight_kg: e.weight_kg,
										duration_minutes: e.duration_minutes,
										notes: e.notes
									}))
								}} />
							{/each}
						</div>
					{/if}
				</div>
			{/each}

			{#if phaseWeeks.length === 0}
				<div class="rounded-lg border border-border bg-card p-8 text-center">
					<p class="text-sm text-muted-foreground">No sessions logged for this phase yet.</p>
				</div>
			{/if}
		</div>

		<!-- Exercise Library -->
		<div class="mt-10">
			<h2 class="text-xl font-bold text-foreground">Exercise Library</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				All approved and avoided exercises for this program.
			</p>

			<div class="mt-6 grid gap-6 md:grid-cols-2">
				<!-- Approved -->
				{#each [
					{ title: 'Core', items: library.approved_exercises.core },
					{ title: 'Upper Body', items: library.approved_exercises.upper_body },
					{ title: 'Lower Body', items: library.approved_exercises.lower_body },
					{ title: 'Cardio & Endurance', items: library.approved_exercises.cardio_endurance }
				] as group}
					<div class="rounded-lg border border-border bg-card p-5">
						<h3 class="text-sm font-semibold text-primary">{group.title}</h3>
						<ul class="mt-3 space-y-2">
							{#each group.items as ex}
								<li class="flex items-start justify-between gap-2 text-sm">
									<div>
										<span class="text-foreground">{ex.name}</span>
										{#if ex.notes}
											<span class="ml-1 text-xs text-muted-foreground">— {ex.notes}</span>
										{/if}
									</div>
									<span class="shrink-0 rounded-full px-2 py-0.5 text-xs {ex.lower_back_safety === 'excellent' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}">
										{ex.lower_back_safety}
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<!-- Avoided -->
			<div class="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
				<h3 class="text-sm font-semibold text-destructive">Avoided Exercises</h3>
				<ul class="mt-3 space-y-2">
					{#each library.avoided_exercises as ex}
						<li class="flex items-start justify-between gap-2 text-sm">
							<span class="text-foreground">{ex.name}</span>
							<span class="text-right text-xs text-muted-foreground">{ex.reason}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<Disclaimer variant="inline" class="mt-6" />
	{/if}
</div>
