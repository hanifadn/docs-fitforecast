<script lang="ts">
	import Disclaimer from '$lib/components/layout/Disclaimer.svelte';

	let search = $state('');

	interface GlossaryTerm {
		name: string;
		definition: string;
		range?: string;
		relevance: string;
	}

	interface GlossaryCategory {
		title: string;
		terms: GlossaryTerm[];
	}

	const categories: GlossaryCategory[] = [
		{
			title: 'Body Composition',
			terms: [
				{ name: 'BMI (Body Mass Index)', definition: 'A ratio of weight to height squared (kg/m²), used as a general screening tool for body weight categories.', range: 'Normal: 18.5–24.9', relevance: 'Primary metric for weight classification on the dashboard.' },
				{ name: 'Body Fat Percentage', definition: 'The proportion of total body mass that is adipose tissue, expressed as a percentage.', range: 'Male fitness: 14–17%', relevance: 'Core tracking metric; used in health risk and body fat classification.' },
				{ name: 'Muscle Mass', definition: 'Total weight of skeletal muscle tissue in the body, typically measured in kilograms.', range: 'Varies by frame size', relevance: 'Tracked weekly to monitor lean mass preservation during fat loss.' },
				{ name: 'WHR (Waist-to-Hip Ratio)', definition: 'The circumference of the waist divided by the circumference of the hips, indicating fat distribution.', range: 'Male healthy: < 0.90', relevance: 'Contributes to health risk score; indicator of visceral fat distribution.' },
				{ name: 'Visceral Fat', definition: 'Fat stored around internal organs in the abdominal cavity. Measured on a scale (typically 1–59).', range: 'Healthy: 1–9', relevance: 'High levels are linked to metabolic risk. Tracked weekly in body composition.' },
				{ name: 'Lean Mass', definition: 'Total body weight minus fat mass. Includes muscle, bone, water, and organs.', relevance: 'Used in transformation forecasting to estimate body recomposition.' }
			]
		},
		{
			title: 'Health Metrics',
			terms: [
				{ name: 'Health Risk Score', definition: 'A composite score (0–100) calculated from BMI, body fat, visceral fat, WHR, and activity level. Lower scores indicate lower estimated risk.', range: 'Low: 0–20, Moderate: 21–40, Elevated: 41–60', relevance: 'Central metric on the assessment dashboard.' },
				{ name: 'Resting Heart Rate', definition: 'The number of heartbeats per minute while at complete rest, indicating cardiovascular fitness.', range: 'Normal: 60–100 bpm', relevance: 'Improved resting HR is an expected outcome of the endurance program.' },
				{ name: 'Blood Pressure', definition: 'The force of blood against artery walls, measured as systolic/diastolic in mmHg.', range: 'Normal: < 120/80 mmHg', relevance: 'Exercise and fat loss may contribute to improved blood pressure over time.' },
				{ name: 'Metabolic Rate', definition: 'The rate at which the body burns calories at rest (BMR) or during daily activity (TDEE).', relevance: 'Underpins calorie deficit calculations and fat loss projections.' },
				{ name: 'Insulin Sensitivity', definition: 'How effectively the body responds to insulin. Higher sensitivity means better blood sugar regulation.', relevance: 'Exercise and fat loss are associated with improved insulin sensitivity.' }
			]
		},
		{
			title: 'Training Terms',
			terms: [
				{ name: 'RPE (Rate of Perceived Exertion)', definition: 'A subjective scale (1–10) measuring exercise intensity based on how hard the effort feels.', range: '1 (very light) to 10 (maximal)', relevance: 'Used in exercise log to prescribe and track intensity.' },
				{ name: 'Progressive Overload', definition: 'Gradually increasing training stimulus (weight, reps, or duration) over time to drive adaptation.', relevance: 'Core principle of the 8-month exercise program; drives phase progression.' },
				{ name: 'Deload', definition: 'A planned reduction in training volume or intensity (typically 20%) to allow recovery.', relevance: 'Scheduled every 4th week in the program.' },
				{ name: 'HIIT (High-Intensity Interval Training)', definition: 'Alternating short bursts of intense exercise with recovery periods.', relevance: 'Introduced in later phases for fat loss and cardiovascular conditioning.' },
				{ name: 'Tempo Training', definition: 'Controlling the speed of each repetition phase (eccentric, pause, concentric) for increased time under tension.', relevance: 'Applied in Phase 3+ to increase muscular adaptation without excessive loading.' },
				{ name: 'Time Under Tension', definition: 'The total duration a muscle is under load during a set, measured in seconds.', relevance: 'Tempo prescriptions in the exercise log target specific TUT ranges.' }
			]
		},
		{
			title: 'Nutrition',
			terms: [
				{ name: 'Calorie Deficit', definition: 'Consuming fewer calories than the body expends, creating conditions for fat loss.', range: 'Recommended: 300–500 kcal/day', relevance: 'The subject\'s dietary preference is "calorie deficit" — foundational to fat loss projections.' },
				{ name: 'TDEE (Total Daily Energy Expenditure)', definition: 'The total calories burned per day including basal metabolism, activity, and thermic effect of food.', relevance: 'Baseline for calculating appropriate calorie deficit.' },
				{ name: 'Macronutrients', definition: 'The three primary nutrients: protein, carbohydrates, and fats, each serving different physiological roles.', relevance: 'Protein intake (1.6–2.0 g/kg) is a key assumption in muscle preservation forecasts.' },
				{ name: 'Protein Synthesis', definition: 'The biological process of building new muscle proteins, stimulated by resistance training and adequate protein intake.', relevance: 'Muscle gain projections assume sufficient protein intake to support synthesis.' },
				{ name: 'Basal Metabolic Rate (BMR)', definition: 'The minimum calories the body needs at complete rest to maintain vital functions.', relevance: 'Component of TDEE; affected by muscle mass changes over the program.' }
			]
		}
	];

	let filteredCategories = $derived(
		categories.map((cat) => ({
			...cat,
			terms: cat.terms.filter(
				(t) =>
					t.name.toLowerCase().includes(search.toLowerCase()) ||
					t.definition.toLowerCase().includes(search.toLowerCase())
			)
		})).filter((cat) => cat.terms.length > 0)
	);

	let totalTerms = $derived(
		filteredCategories.reduce((sum, cat) => sum + cat.terms.length, 0)
	);
</script>

<svelte:head>
	<title>Metric Glossary — FitForecast</title>
	<meta name="description" content="Definitions of 26 fitness metrics across body composition, health, training, and nutrition categories." />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-10">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground">Metric Glossary</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Definitions for all metrics, terms, and concepts used in FitForecast.
		</p>
	</div>

	<!-- Search -->
	<div class="mb-8">
		<div class="relative">
			<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<input
				type="text"
				bind:value={search}
				placeholder="Search terms..."
				class="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
			/>
		</div>
		<p class="mt-2 text-xs text-muted-foreground">
			Showing {totalTerms} term{totalTerms !== 1 ? 's' : ''}{search ? ` matching "${search}"` : ' across 4 categories'}
		</p>
	</div>

	<!-- Categories -->
	<div class="space-y-10">
		{#each filteredCategories as category}
			<section>
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
					{category.title}
					<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-normal text-primary">
						{category.terms.length}
					</span>
				</h2>

				<div class="space-y-3">
					{#each category.terms as term}
						<div class="rounded-lg border border-border bg-card p-4">
							<h3 class="text-sm font-semibold text-foreground">{term.name}</h3>
							<p class="mt-1.5 text-sm text-muted-foreground">{term.definition}</p>
							<div class="mt-3 flex flex-wrap gap-4 text-xs">
								{#if term.range}
									<div>
										<span class="font-medium text-muted-foreground">Normal Range:</span>
										<span class="ml-1 text-foreground">{term.range}</span>
									</div>
								{/if}
								<div>
									<span class="font-medium text-muted-foreground">Relevance:</span>
									<span class="ml-1 text-foreground">{term.relevance}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/each}

		{#if filteredCategories.length === 0}
			<div class="rounded-lg border border-border bg-card p-8 text-center">
				<p class="text-sm text-muted-foreground">No terms match "{search}".</p>
			</div>
		{/if}
	</div>

	<Disclaimer variant="inline" class="mt-10" />
</div>
