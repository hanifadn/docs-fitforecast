<script lang="ts">
	import Disclaimer from '$lib/components/layout/Disclaimer.svelte';

	let expandedModule = $state<string | null>(null);

	function toggleModule(id: string) {
		expandedModule = expandedModule === id ? null : id;
	}

	const modules = [
		{
			id: 'bmi',
			title: 'BMI Calculator',
			desc: 'Calculates Body Mass Index from weight and height using the standard WHO formula (weight_kg / height_m²). Classifies into Underweight, Normal, Overweight, Obese I/II/III.',
			formula: 'BMI = weight (kg) ÷ height (m)²',
			caveat: 'BMI is a screening tool and does not account for muscle mass distribution.'
		},
		{
			id: 'bodyfat',
			title: 'Body Fat Classifier',
			desc: 'Uses ACE (American Council on Exercise) categories to classify body fat percentage. Categories differ by gender: Essential, Athletic, Fitness, Average, Obese.',
			formula: 'Direct classification lookup based on percentage and gender',
			caveat: 'Classification ranges are general guidelines; individual variation exists.'
		},
		{
			id: 'visceral',
			title: 'Visceral Fat Risk',
			desc: 'Evaluates visceral fat level against established tiers: Normal/Healthy (1–9), High (10–14), Very High (15+). Provides tier-specific recommendations.',
			formula: 'Level ≤ 9 → Normal | 10–14 → High | 15+ → Very High',
			caveat: 'Visceral fat levels are approximate indicators, not diagnostic values.'
		},
		{
			id: 'healthrisk',
			title: 'Health Risk Score',
			desc: 'Composite score (0–100) weighted across 5 metrics: BMI (25%), Body Fat (25%), Visceral Fat (20%), WHR (15%), Activity Level (15%). Lower is better.',
			formula: 'Score = Σ (metric_score × weight)',
			caveat: 'This estimated composite does not replace clinical risk assessment.'
		},
		{
			id: 'forecast',
			title: 'Transformation Forecaster',
			desc: 'Projects body composition over 8 months across 3 scenarios. Best case: 0.8 kg/week fat loss + 0.3 kg/month muscle. Realistic: 0.5 + 0.2. Worst: 0.25 + 0.1.',
			formula: 'Monthly: fat_mass -= loss_rate × 4.33; lean_mass += gain_rate',
			caveat: 'Projections assume consistent adherence to training and nutrition.'
		},
		{
			id: 'milestones',
			title: 'Milestone Estimator',
			desc: 'Estimates approximate month for achieving fat loss, endurance, and strength milestones. Adjusts estimates based on training frequency.',
			formula: 'estimated_month = base_months × frequency_factor',
			caveat: 'Individual progress varies significantly based on genetics, recovery, and consistency.'
		}
	];

	const isItems = [
		'An estimation and visualization tool',
		'An educational resource about body composition',
		'A data-driven progress tracker',
		'Fully client-side — no data leaves your browser'
	];

	const isNotItems = [
		'A medical device or diagnostic tool',
		'A replacement for a personal trainer',
		'A substitute for professional medical advice',
		'FDA-approved or clinically validated'
	];

	const assumptions = [
		{ assumption: 'Training adherence', value: '3 sessions per week, consistent' },
		{ assumption: 'Calorie deficit', value: '300–500 kcal/day below TDEE' },
		{ assumption: 'Protein intake', value: '1.6–2.0 g per kg body weight' },
		{ assumption: 'Sleep', value: '7–9 hours per night' },
		{ assumption: 'Fat loss rate', value: '0.25–0.8 kg per week (scenario-dependent)' },
		{ assumption: 'Muscle gain rate', value: '0.1–0.3 kg per month (beginner)' },
		{ assumption: 'Measurement frequency', value: 'Weekly body composition' },
		{ assumption: 'Lower back protocol', value: 'All exercises cleared for mild LBP' }
	];
</script>

<svelte:head>
	<title>How It Works — FitForecast</title>
	<meta name="description" content="Learn how FitForecast calculates body composition projections, health risk scores, and transformation estimates." />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-10">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground">How It Works</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Understand the data flow, calculation engine, and limitations of FitForecast.
		</p>
	</div>

	<!-- 3-Step Overview -->
	<section class="mb-12">
		<div class="grid gap-4 sm:grid-cols-3">
			{#each [
				{ step: '1', title: 'Hardcoded Profile', desc: 'Your body composition, health data, and goals are stored in a YAML file bundled with the app at build time. No user uploads or API calls.' },
				{ step: '2', title: 'Calculation Engine', desc: 'Six modules process the data: BMI, body fat classification, visceral fat risk, health risk scoring, transformation forecasting, and milestone estimation.' },
				{ step: '3', title: 'Personalized Forecast', desc: 'Results are displayed as estimated ranges across best, realistic, and worst-case scenarios. All projections are approximate, never guaranteed.' }
			] as card}
				<div class="relative rounded-lg border border-border bg-card p-6">
					<div class="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
						{card.step}
					</div>
					<h3 class="text-base font-semibold text-foreground">{card.title}</h3>
					<p class="mt-2 text-sm text-muted-foreground">{card.desc}</p>
				</div>
			{/each}
		</div>

		<div class="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
			<span class="rounded bg-muted px-2 py-1 font-mono text-xs">YAML</span>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
			</svg>
			<span class="rounded bg-muted px-2 py-1 font-mono text-xs">Engine</span>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
			</svg>
			<span class="rounded bg-muted px-2 py-1 font-mono text-xs">Dashboard</span>
		</div>
	</section>

	<!-- Calculation Modules -->
	<section class="mb-12">
		<h2 class="mb-4 text-xl font-semibold text-foreground">Calculation Modules</h2>
		<div class="space-y-2">
			{#each modules as mod}
				<div class="rounded-lg border border-border bg-card">
					<button
						class="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
						onclick={() => toggleModule(mod.id)}
						aria-expanded={expandedModule === mod.id}
					>
						<span class="text-sm font-semibold text-foreground">{mod.title}</span>
						<svg
							class="h-4 w-4 text-muted-foreground transition-transform {expandedModule === mod.id ? 'rotate-180' : ''}"
							fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if expandedModule === mod.id}
						<div class="border-t border-border px-5 py-4 text-sm">
							<p class="text-muted-foreground">{mod.desc}</p>
							<div class="mt-3 rounded bg-muted/50 px-3 py-2">
								<p class="font-mono text-xs text-primary">{mod.formula}</p>
							</div>
							<p class="mt-3 text-xs text-secondary">
								<strong>Note:</strong> {mod.caveat}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- IS / IS NOT -->
	<section class="mb-12">
		<h2 class="mb-4 text-xl font-semibold text-foreground">What FitForecast Is & Is Not</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="rounded-lg border border-primary/30 bg-primary/5 p-5">
				<h3 class="mb-3 text-sm font-semibold text-primary">FitForecast IS</h3>
				<ul class="space-y-2">
					{#each isItems as item}
						<li class="flex items-start gap-2 text-sm text-foreground">
							<svg class="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							{item}
						</li>
					{/each}
				</ul>
			</div>

			<div class="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
				<h3 class="mb-3 text-sm font-semibold text-destructive">FitForecast IS NOT</h3>
				<ul class="space-y-2">
					{#each isNotItems as item}
						<li class="flex items-start gap-2 text-sm text-foreground">
							<svg class="mt-0.5 h-4 w-4 shrink-0 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
							{item}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- Assumptions -->
	<section class="mb-12">
		<h2 class="mb-4 text-xl font-semibold text-foreground">Key Assumptions</h2>
		<div class="overflow-x-auto rounded-lg border border-border">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-card">
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Assumption</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Value</th>
					</tr>
				</thead>
				<tbody>
					{#each assumptions as row}
						<tr class="border-b border-border transition-colors hover:bg-muted/30">
							<td class="px-4 py-2.5 font-medium text-foreground">{row.assumption}</td>
							<td class="px-4 py-2.5 text-muted-foreground">{row.value}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Privacy -->
	<section class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-foreground">Privacy & Data</h2>
		<div class="rounded-lg border border-primary/30 bg-primary/5 p-5">
			<div class="flex items-start gap-3">
				<svg class="mt-0.5 h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
				<div>
					<h3 class="text-sm font-semibold text-foreground">100% Client-Side</h3>
					<p class="mt-1 text-sm text-muted-foreground">
						All data is hardcoded in the application bundle. No health data is stored on servers,
						transmitted over the network, or accessible to third parties. All calculations run
						entirely in your browser.
					</p>
				</div>
			</div>
		</div>
	</section>

	<Disclaimer variant="full" />
</div>
