<script lang="ts">
	import MetricCard from '$lib/components/shared/MetricCard.svelte';
	import BadgeClassification from '$lib/components/shared/BadgeClassification.svelte';
	import HealthGauge from '$lib/components/shared/HealthGauge.svelte';
	import Disclaimer from '$lib/components/layout/Disclaimer.svelte';
	import { getBMIResult } from '$lib/engine/bmiCalculator';
	import { classifyBodyFat } from '$lib/engine/bodyFatClassifier';
	import { getVisceralFatRisk } from '$lib/engine/visceralFatRisk';
	import { calculateHealthRisk } from '$lib/engine/healthRiskScore';
	import { forecastTransformation } from '$lib/engine/transformationForecaster';
	import { getScenarioComparison } from '$lib/engine/scenarioEngine';
	import { estimateMilestones } from '$lib/engine/strengthMilestoneEstimator';
	import { base } from '$app/paths';

	let { data } = $props();
	let fitData = $derived(data.fitData);
	let profile = $derived(fitData.profile);
	let bc = $derived(profile.body_composition);
	let demo = $derived(profile.demographics);
	let library = $derived(fitData.exercise_library);
	let bodyCompTracking = $derived(fitData.body_composition_tracking);

	let bmi = $derived(getBMIResult(bc.weight_kg, demo.height_cm));
	let bodyFat = $derived(classifyBodyFat(bc.body_fat_percent, demo.gender));
	let visceralFat = $derived(getVisceralFatRisk(bc.visceral_fat_level));
	let healthRisk = $derived(calculateHealthRisk(profile));
	let scenarios = $derived(forecastTransformation(profile));
	let comparison = $derived(getScenarioComparison(profile));
	let milestones = $derived(estimateMilestones(profile));

	let scenarioTab = $state('realistic');

	let latest = $derived(bodyCompTracking[bodyCompTracking.length - 1]);
	let weightChange = $derived(latest
		? Math.round((bc.weight_kg - latest.weight_kg) * 10) / 10
		: 0);
	let bfChange = $derived(latest
		? Math.round((bc.body_fat_percent - latest.body_fat_percent) * 10) / 10
		: 0);

	const activeScenario = $derived(
		scenarios.find((s) => s.name === scenarioTab) ?? scenarios[1]
	);

	const milestoneCategories = ['fat_loss', 'endurance', 'strength'] as const;
	const categoryLabels: Record<string, string> = {
		fat_loss: 'Fat Loss',
		endurance: 'Endurance',
		strength: 'Strength'
	};
	const categoryColors: Record<string, string> = {
		fat_loss: 'text-red-400',
		endurance: 'text-blue-400',
		strength: 'text-green-400'
	};
</script>

<svelte:head>
	<title>Assessment Dashboard — FitForecast</title>
	<meta name="description" content="Comprehensive fitness assessment dashboard with health risk analysis, transformation forecasts, and milestone tracking." />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="mb-8 flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Assessment Dashboard</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Comprehensive analysis of body composition, health risk, and projected transformation.
			</p>
		</div>
		<a
			href="{base}/dashboard/export"
			class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			Export
		</a>
	</div>

	<Disclaimer variant="banner" class="mb-6 rounded-lg" />

	<!-- 1. Executive Summary -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Executive Summary</h2>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<MetricCard title="Current Weight" value={latest?.weight_kg ?? bc.weight_kg} unit="kg" icon="⚖️" subtitle={weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange} kg from baseline` : 'Baseline'} />
			<MetricCard title="Body Fat" value={latest?.body_fat_percent ?? bc.body_fat_percent} unit="%" color="secondary" icon="📏" subtitle={bfChange !== 0 ? `${bfChange > 0 ? '+' : ''}${bfChange}% from baseline` : 'Baseline'} />
			<MetricCard title="Health Risk" value={healthRisk.score} unit="/100" color={healthRisk.score > 60 ? 'destructive' : 'secondary'} icon="🩺" subtitle={healthRisk.label} />
			<MetricCard title="BMI" value={bmi.bmi} color={bmi.classification === 'Normal' ? 'primary' : 'secondary'} icon="📐" subtitle={bmi.classification} />
		</div>
	</section>

	<!-- 2. Health Status Panel -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Health Status</h2>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="rounded-lg border border-border bg-card p-5">
				<HealthGauge score={healthRisk.score} label="Composite Health Risk Score" color={healthRisk.score > 60 ? 'destructive' : healthRisk.score > 40 ? 'secondary' : 'primary'} />
				<div class="mt-4 space-y-2">
					{#each healthRisk.breakdown as item}
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">{item.metric}</span>
							<div class="flex items-center gap-2">
								<span class="text-foreground">{item.value}</span>
								<BadgeClassification label={item.risk} color={item.risk === 'Low' ? 'primary' : item.risk === 'High' ? 'destructive' : 'secondary'} />
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="space-y-4">
				<div class="rounded-lg border border-border bg-card p-5">
					<h3 class="text-sm font-semibold text-foreground">Body Fat Category</h3>
					<div class="mt-2 flex items-center gap-2">
						<span class="text-2xl font-bold text-foreground">{bc.body_fat_percent}%</span>
						<BadgeClassification label={bodyFat.category} color={bodyFat.category === 'Obese' ? 'destructive' : 'secondary'} />
					</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-5">
					<h3 class="text-sm font-semibold text-foreground">Visceral Fat Risk</h3>
					<div class="mt-2 flex items-center gap-2">
						<span class="text-2xl font-bold text-foreground">Level {bc.visceral_fat_level}</span>
						<BadgeClassification label={visceralFat.tier} color={visceralFat.tier === 'Normal/Healthy' ? 'primary' : 'secondary'} />
					</div>
					<p class="mt-2 text-xs text-muted-foreground">{visceralFat.recommendation}</p>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. Forecast Table -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Transformation Forecast</h2>

		<div class="mb-4 flex gap-1 rounded-lg border border-border bg-card p-1">
			{#each scenarios as scenario}
				<button
					class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {scenarioTab === scenario.name ? 'bg-primary text-background' : 'text-muted-foreground hover:text-foreground'}"
					onclick={() => scenarioTab = scenario.name}
				>
					{scenario.label}
				</button>
			{/each}
		</div>

		<div class="overflow-x-auto rounded-lg border border-border">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-card">
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Month</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Est. Weight</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Est. Body Fat</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Est. Muscle</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Est. Waist</th>
					</tr>
				</thead>
				<tbody>
					{#each activeScenario.projections as proj}
						<tr class="border-b border-border transition-colors hover:bg-muted/30">
							<td class="px-4 py-2.5 font-medium text-foreground">Month {proj.month}</td>
							<td class="px-4 py-2.5 text-right text-foreground">~{proj.weight_kg} kg</td>
							<td class="px-4 py-2.5 text-right text-foreground">~{proj.body_fat_percent}%</td>
							<td class="px-4 py-2.5 text-right text-foreground">~{proj.muscle_mass_kg} kg</td>
							<td class="px-4 py-2.5 text-right text-foreground">~{proj.waist_cm} cm</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="mt-2 text-xs text-muted-foreground">
			All projection values are approximate estimates. Individual results will vary.
		</p>
	</section>

	<!-- 4. Monthly Progress Cards -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Monthly Progress (Realistic)</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each (scenarios.find(s => s.name === 'realistic')?.projections ?? []) as proj}
				{@const prevProj = (scenarios.find(s => s.name === 'realistic')?.projections ?? [])[proj.month - 2]}
				{@const weightDiff = prevProj ? Math.round((prevProj.weight_kg - proj.weight_kg) * 10) / 10 : Math.round((bc.weight_kg - proj.weight_kg) * 10) / 10}
				<div class="rounded-lg border border-border bg-card p-4">
					<div class="flex items-center justify-between">
						<span class="text-sm font-semibold text-primary">Month {proj.month}</span>
						{#if weightDiff > 0}
							<span class="text-xs text-green-400">-{weightDiff} kg</span>
						{/if}
					</div>
					<div class="mt-3 space-y-1.5 text-sm">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Weight</span>
							<span class="text-foreground">~{proj.weight_kg} kg</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Body Fat</span>
							<span class="text-foreground">~{proj.body_fat_percent}%</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Muscle</span>
							<span class="text-foreground">~{proj.muscle_mass_kg} kg</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- 5. Lower Back Outlook -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Lower Back Outlook</h2>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="rounded-lg border border-secondary/30 bg-secondary/5 p-5">
				<div class="flex items-center gap-2">
					<svg class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					<h3 class="text-sm font-semibold text-foreground">Safety Assessment</h3>
				</div>
				<p class="mt-2 text-sm text-muted-foreground">
					Subject has <strong>mild lower back pain</strong>. All exercises are selected for lower-back safety.
					Spinal compression movements are avoided in early phases. Core stability work is included every session.
				</p>
				<div class="mt-4">
					<h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Approved Categories</h4>
					<div class="mt-2 flex flex-wrap gap-1.5">
						<BadgeClassification label="Core" color="primary" />
						<BadgeClassification label="Upper Body" color="primary" />
						<BadgeClassification label="Lower Body" color="primary" />
						<BadgeClassification label="Cardio" color="primary" />
					</div>
				</div>
			</div>

			<div class="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
				<h3 class="text-sm font-semibold text-foreground">Avoided Exercises</h3>
				<ul class="mt-3 space-y-2">
					{#each library.avoided_exercises as ex}
						<li class="flex items-start justify-between text-sm">
							<span class="text-foreground">{ex.name}</span>
							<span class="ml-2 text-right text-xs text-muted-foreground">{ex.reason}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- 6. Strength Milestones -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Estimated Milestones</h2>
		<div class="space-y-6">
			{#each milestoneCategories as cat}
				{@const catMilestones = milestones.filter(m => m.category === cat)}
				<div>
					<h3 class="mb-3 text-sm font-semibold {categoryColors[cat]}">{categoryLabels[cat]}</h3>
					<div class="space-y-2">
						{#each catMilestones as milestone}
							<div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
								<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full {milestone.achieved ? 'bg-green-500/15 text-green-400' : 'bg-muted text-muted-foreground'} text-xs font-bold">
									{#if milestone.achieved}✓{:else}M{milestone.estimated_month}{/if}
								</div>
								<div class="flex-1">
									<p class="text-sm font-medium text-foreground">{milestone.name}</p>
									<p class="text-xs text-muted-foreground">{milestone.target}</p>
								</div>
								<span class="text-xs text-muted-foreground">
									~Month {milestone.estimated_month}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- 7. Scenario Comparison -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Scenario Comparison (Month 8)</h2>
		<div class="overflow-x-auto rounded-lg border border-border">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-card">
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Metric</th>
						<th class="px-4 py-3 text-right font-medium text-green-400">Best Case</th>
						<th class="px-4 py-3 text-right font-medium text-primary">Realistic</th>
						<th class="px-4 py-3 text-right font-medium text-secondary">Worst Case</th>
					</tr>
				</thead>
				<tbody>
					{#each comparison.summary as row}
						<tr class="border-b border-border transition-colors hover:bg-muted/30">
							<td class="px-4 py-2.5 text-foreground">{row.metric}</td>
							<td class="px-4 py-2.5 text-right text-green-400">{row.best}</td>
							<td class="px-4 py-2.5 text-right text-primary">{row.realistic}</td>
							<td class="px-4 py-2.5 text-right text-secondary">{row.worst}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="mt-2 text-xs text-muted-foreground">
			All values are approximate estimates. Scenarios assume consistent training and nutrition adherence.
		</p>
	</section>

	<Disclaimer variant="full" />
</div>
