<script lang="ts">
	import Disclaimer from '$lib/components/layout/Disclaimer.svelte';
	import MetricCard from '$lib/components/shared/MetricCard.svelte';

	let { data } = $props();
	let profile = $derived(data.fitData.profile);
	let bc = $derived(profile.body_composition);
</script>

<svelte:head>
	<title>FitForecast — 8-Month Fitness Transformation</title>
	<meta name="description" content="Data-driven 8-month fitness transformation analysis with body composition tracking, exercise programming, and personalized forecasting." />
	<meta property="og:title" content="FitForecast — 8-Month Fitness Transformation" />
	<meta property="og:description" content="Body composition tracking, lower-back-safe exercise programming, and personalized transformation forecasting." />
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-linear-to-b from-[#0d1530] to-background px-4 py-20 sm:py-28">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,212,180,.12),transparent_70%)]"></div>

	<div class="relative mx-auto max-w-4xl text-center">
		<h1 class="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
			Fit<span class="text-primary">Forecast</span>
		</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
			8-Month Fitness Transformation Analysis
		</p>
		<p class="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
			Data-driven body composition tracking, exercise programming, and personalized forecasting — all calculated locally in your browser.
		</p>

		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<a
				href="/dashboard"
				class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary/90"
			>
				View Dashboard
			</a>
			<a
				href="/log"
				class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
			>
				Explore Exercise Log
			</a>
		</div>
	</div>
</section>

<!-- Trust Signals -->
<section class="border-b border-border bg-card/50 px-4 py-4">
	<div class="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
		<div class="flex items-center gap-2">
			<svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
			</svg>
			<span>Lower Back Safe</span>
		</div>
		<div class="flex items-center gap-2">
			<svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
			<span>Fat Loss + Endurance</span>
		</div>
		<div class="flex items-center gap-2">
			<svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
			</svg>
			<span>Data-Driven</span>
		</div>
	</div>
</section>

<!-- How It Works -->
<section class="px-4 py-16">
	<div class="mx-auto max-w-5xl">
		<h2 class="text-center text-2xl font-bold text-foreground">How It Works</h2>
		<p class="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
			Three steps from raw data to actionable insight
		</p>

		<div class="mt-10 grid gap-6 sm:grid-cols-3">
			{#each [
				{ step: '1', title: 'Profile Data', desc: 'Your body composition, health status, and fitness goals are loaded from a hardcoded YAML file at build time.' },
				{ step: '2', title: 'Analysis Engine', desc: 'Six calculation modules process your data: BMI, body fat, visceral fat, health risk, transformation forecast, and milestones.' },
				{ step: '3', title: 'Personalized Forecast', desc: 'View projected outcomes across best, realistic, and worst-case scenarios — always shown as estimated ranges.' }
			] as card}
				<div class="rounded-lg border border-border bg-card p-6 text-center">
					<div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
						{card.step}
					</div>
					<h3 class="mt-4 text-base font-semibold text-foreground">{card.title}</h3>
					<p class="mt-2 text-sm text-muted-foreground">{card.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Feature Highlights -->
<section class="border-t border-border bg-card/30 px-4 py-16">
	<div class="mx-auto max-w-5xl">
		<h2 class="text-center text-2xl font-bold text-foreground">Feature Highlights</h2>

		<div class="mt-10 grid gap-6 sm:grid-cols-2">
			{#each [
				{ icon: '📊', title: 'Body Composition Tracking', desc: 'Weekly weight, body fat, muscle mass, visceral fat, and WHR tracked over your 8-month program.' },
				{ icon: '🏋️', title: 'Exercise Programming', desc: '5-phase progressive program: Foundation through Peak, with lower-back-safe exercise selection.' },
				{ icon: '⚕️', title: 'Health Risk Analysis', desc: 'Composite health risk score from BMI, body fat, visceral fat, WHR, and activity level.' },
				{ icon: '📈', title: 'Transformation Forecast', desc: 'Month-by-month projections across 3 scenarios with weight, body fat, and muscle mass estimates.' }
			] as feature}
				<div class="flex gap-4 rounded-lg border border-border bg-card p-5">
					<span class="text-2xl">{feature.icon}</span>
					<div>
						<h3 class="text-sm font-semibold text-foreground">{feature.title}</h3>
						<p class="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Sample Preview -->
<section class="px-4 py-16">
	<div class="mx-auto max-w-5xl">
		<h2 class="text-center text-2xl font-bold text-foreground">At a Glance</h2>
		<p class="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
			Current baseline metrics from the subject profile
		</p>

		<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
			<MetricCard title="Weight" value={bc.weight_kg} unit="kg" icon="⚖️" />
			<MetricCard title="Body Fat" value={bc.body_fat_percent} unit="%" color="secondary" icon="📏" />
			<MetricCard title="Muscle Mass" value={bc.muscle_mass_kg} unit="kg" color="primary" icon="💪" />
			<MetricCard title="Visceral Fat" value={bc.visceral_fat_level} subtitle="Level" color="secondary" icon="🔬" />
		</div>

		<Disclaimer variant="inline" class="mt-4 text-center" />
	</div>
</section>

<!-- CTA -->
<section class="border-t border-border px-4 py-16">
	<div class="mx-auto max-w-2xl text-center">
		<h2 class="text-2xl font-bold text-foreground">Ready to explore?</h2>
		<p class="mt-2 text-sm text-muted-foreground">
			Dive into the full dashboard or browse the 8-month exercise program.
		</p>
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a
				href="/dashboard"
				class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary/90"
			>
				View Dashboard
			</a>
			<a
				href="/log"
				class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
			>
				Explore Exercise Log
			</a>
		</div>
	</div>
</section>
