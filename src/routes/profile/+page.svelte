<script lang="ts">
	import BadgeClassification from '$lib/components/shared/BadgeClassification.svelte';
	import Disclaimer from '$lib/components/layout/Disclaimer.svelte';
	import { getBMIResult } from '$lib/engine/bmiCalculator';
	import { classifyBodyFat } from '$lib/engine/bodyFatClassifier';
	import { getVisceralFatRisk } from '$lib/engine/visceralFatRisk';

	let { data } = $props();
	let profile = $derived(data.fitData.profile);
	let demo = $derived(profile.demographics);
	let bc = $derived(profile.body_composition);
	let activity = $derived(profile.activity_history);
	let health = $derived(profile.health);
	let goals = $derived(profile.goals);

	let bmiResult = $derived(getBMIResult(bc.weight_kg, demo.height_cm));
	let bfResult = $derived(classifyBodyFat(bc.body_fat_percent, demo.gender));
	let vfResult = $derived(getVisceralFatRisk(bc.visceral_fat_level));

	const goalLabels: Record<string, string> = {
		fat_loss: 'Fat Loss',
		endurance: 'Endurance',
		muscle_gain: 'Muscle Gain',
		general_health: 'General Health'
	};

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>Subject Profile — FitForecast</title>
	<meta name="description" content="View the subject's demographics, body composition, activity history, health considerations, and fitness goals." />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-10">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground">Subject Profile</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Read-only view of all hardcoded profile data. Generated {formatDate(profile.generated_date)}.
		</p>
	</div>

	<!-- Goal Badges -->
	<div class="mb-6 flex flex-wrap gap-2">
		{#each goals.primary_goal as goal}
			<span class="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3.5 py-1.5 text-sm font-medium text-primary">
				{#if goal === 'fat_loss'}🔥{:else if goal === 'endurance'}🏃{:else}🎯{/if}
				{goalLabels[goal] ?? goal}
			</span>
		{/each}
		<span class="inline-flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-1.5 text-sm text-muted-foreground">
			{goals.training_frequency_per_week}×/week · {goals.dietary_preference.replace('_', ' ')}
		</span>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<!-- Demographics -->
		<div class="rounded-lg border border-border bg-card p-5">
			<h2 class="text-base font-semibold text-foreground">Demographics</h2>
			<dl class="mt-4 space-y-3">
				{#each [
					{ label: 'Gender', value: demo.gender.charAt(0).toUpperCase() + demo.gender.slice(1) },
					{ label: 'Age', value: `${demo.age} years` },
					{ label: 'Height', value: `${demo.height_cm} cm` },
					{ label: 'Gym Start Date', value: formatDate(demo.gym_start_date) },
					{ label: 'Experience', value: demo.gym_experience.charAt(0).toUpperCase() + demo.gym_experience.slice(1) }
				] as item}
					<div class="flex items-center justify-between">
						<dt class="text-sm text-muted-foreground">{item.label}</dt>
						<dd class="text-sm font-medium text-foreground">{item.value}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<!-- Body Composition -->
		<div class="rounded-lg border border-border bg-card p-5">
			<h2 class="text-base font-semibold text-foreground">Body Composition (Baseline)</h2>
			<dl class="mt-4 space-y-3">
				<div class="flex items-center justify-between">
					<dt class="text-sm text-muted-foreground">Weight</dt>
					<dd class="text-sm font-medium text-foreground">{bc.weight_kg} kg</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-sm text-muted-foreground">BMI</dt>
					<dd class="flex items-center gap-2 text-sm font-medium text-foreground">
						{bmiResult.bmi}
						<BadgeClassification label={bmiResult.classification} color={bmiResult.classification === 'Normal' ? 'primary' : 'destructive'} />
					</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-sm text-muted-foreground">Body Fat</dt>
					<dd class="flex items-center gap-2 text-sm font-medium text-foreground">
						{bc.body_fat_percent}%
						<BadgeClassification label={bfResult.category} color={bfResult.category === 'Athletic' || bfResult.category === 'Fitness' ? 'primary' : 'destructive'} />
					</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-sm text-muted-foreground">Muscle Mass</dt>
					<dd class="text-sm font-medium text-foreground">{bc.muscle_mass_kg} kg</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-sm text-muted-foreground">WHR</dt>
					<dd class="flex items-center gap-2 text-sm font-medium text-foreground">
						{bc.waist_hip_ratio}
						<BadgeClassification label={bc.waist_hip_ratio > 0.9 ? 'High' : 'Normal'} color={bc.waist_hip_ratio > 0.9 ? 'secondary' : 'primary'} />
					</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-sm text-muted-foreground">Visceral Fat</dt>
					<dd class="flex items-center gap-2 text-sm font-medium text-foreground">
						Level {bc.visceral_fat_level}
						<BadgeClassification label={vfResult.tier} color={vfResult.tier === 'Normal/Healthy' ? 'primary' : 'secondary'} />
					</dd>
				</div>
			</dl>
		</div>

		<!-- Activity History -->
		<div class="rounded-lg border border-border bg-card p-5">
			<h2 class="text-base font-semibold text-foreground">Activity History</h2>
			<dl class="mt-4 space-y-3">
				{#each [
					{ label: 'Previous Gym Experience', value: `${activity.previous_gym_experience_years} years` },
					{ label: 'Equipment Familiarity', value: activity.equipment_familiarity.charAt(0).toUpperCase() + activity.equipment_familiarity.slice(1) },
					{ label: 'Last Exercise Type', value: activity.last_exercise_type.charAt(0).toUpperCase() + activity.last_exercise_type.slice(1) },
					{ label: 'Last Exercise Date', value: formatDate(activity.last_exercise_date) },
					{ label: 'Weekly Activity', value: activity.weekly_activity_frequency.charAt(0).toUpperCase() + activity.weekly_activity_frequency.slice(1) }
				] as item}
					<div class="flex items-center justify-between">
						<dt class="text-sm text-muted-foreground">{item.label}</dt>
						<dd class="text-sm font-medium text-foreground">{item.value}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<!-- Health Alerts -->
		<div class="rounded-lg border border-border bg-card p-5">
			<h2 class="text-base font-semibold text-foreground">Health Alerts</h2>
			<div class="mt-4 space-y-3">
				{#if health.lower_back_pain.present}
					<div class="flex items-start gap-3 rounded-lg bg-secondary/10 p-3">
						<svg class="mt-0.5 h-5 w-5 shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
						</svg>
						<div>
							<p class="text-sm font-medium text-secondary">Lower Back Pain — {health.lower_back_pain.severity}</p>
							<p class="mt-0.5 text-xs text-muted-foreground">
								All exercises are selected to be lower-back-safe. Spinal compression movements are avoided in early phases.
							</p>
						</div>
					</div>
				{/if}

				{#if health.other_conditions.length === 0}
					<p class="text-sm text-muted-foreground">No other conditions reported.</p>
				{:else}
					{#each health.other_conditions as condition}
						<div class="rounded-lg bg-muted p-3 text-sm text-foreground">{condition}</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	<!-- Assumptions -->
	<div class="mt-6 rounded-lg border border-border bg-card p-5">
		<h2 class="text-base font-semibold text-foreground">Assumptions & Preferences</h2>
		<div class="mt-4 grid gap-3 sm:grid-cols-3">
			<div class="rounded-lg bg-muted/50 p-3">
				<p class="text-xs text-muted-foreground">Training Frequency</p>
				<p class="mt-0.5 text-sm font-medium text-foreground">{goals.training_frequency_per_week} sessions/week</p>
			</div>
			<div class="rounded-lg bg-muted/50 p-3">
				<p class="text-xs text-muted-foreground">Dietary Approach</p>
				<p class="mt-0.5 text-sm font-medium text-foreground">{goals.dietary_preference.replace('_', ' ')}</p>
			</div>
			<div class="rounded-lg bg-muted/50 p-3">
				<p class="text-xs text-muted-foreground">Data Source</p>
				<p class="mt-0.5 text-sm font-medium text-foreground">Hardcoded YAML v{profile.version}</p>
			</div>
		</div>
	</div>

	<Disclaimer variant="full" class="mt-8" />
</div>
