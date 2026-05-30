<script lang="ts">
	import Disclaimer from '$lib/components/layout/Disclaimer.svelte';

	let search = $state('');
	let expandedId = $state<string | null>(null);

	function toggleQuestion(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	interface FaqItem {
		id: string;
		q: string;
		a: string;
	}

	interface FaqCategory {
		title: string;
		items: FaqItem[];
	}

	const categories: FaqCategory[] = [
		{
			title: 'Getting Started',
			items: [
				{ id: 'gs-1', q: 'What is FitForecast?', a: 'FitForecast is a static web application that analyzes body composition data and generates estimated fitness transformation projections over an 8-month period. It uses hardcoded profile data and six calculation modules to produce visualizations and forecasts.' },
				{ id: 'gs-2', q: 'How is my data loaded?', a: 'All data is hardcoded in a YAML file (fitforecast-profile.yaml) bundled with the application at build time. There are no user uploads, API calls, or server storage. To update the data, you edit the YAML file and rebuild the app.' },
				{ id: 'gs-3', q: 'Do I need to create an account?', a: 'No. FitForecast is a fully static site with no authentication, no user accounts, and no server-side storage. Everything runs in your browser.' },
				{ id: 'gs-4', q: 'Can I use this on my phone?', a: 'Yes. FitForecast is fully responsive and works on screens from 320px to 1200px+. All charts, tables, and layouts adapt to mobile viewports.' },
				{ id: 'gs-5', q: 'How do I update my body composition data?', a: 'Edit the body_composition_tracking section in fitforecast-profile.yaml and add a new weekly entry with the required fields (weight_kg, body_fat_percent, muscle_mass_kg, waist_hip_ratio, visceral_fat_level). Then rebuild the application.' }
			]
		},
		{
			title: 'Data & Calculations',
			items: [
				{ id: 'dc-1', q: 'Are projections guaranteed?', a: 'No. All projections are approximate estimates shown as ranges. Individual results vary significantly based on genetics, adherence, recovery, sleep, stress, and many other factors. Projections assume consistent training and nutrition.' },
				{ id: 'dc-2', q: 'What calculation modules are used?', a: 'Six modules: BMI Calculator (WHO formula), Body Fat Classifier (ACE categories), Visceral Fat Risk Assessment, Health Risk Score (composite 0–100), Transformation Forecaster (3-scenario projections), and Milestone Estimator (fat loss, endurance, strength targets).' },
				{ id: 'dc-3', q: 'How is the health risk score calculated?', a: 'It\'s a weighted composite of 5 metrics: BMI (25%), Body Fat % (25%), Visceral Fat (20%), Waist-to-Hip Ratio (15%), and Activity Level (15%). Each metric is scored 0–100, then combined. Lower scores indicate lower estimated risk.' },
				{ id: 'dc-4', q: 'What are the three scenarios?', a: 'Best Case (0.8 kg/week fat loss, 0.3 kg/month muscle gain), Realistic (0.5 kg/week, 0.2 kg/month), and Worst Case (0.25 kg/week, 0.1 kg/month). All assume consistent adherence to the program.' },
				{ id: 'dc-5', q: 'How often should I update body composition?', a: 'Weekly measurements are recommended for consistent tracking. The body composition table accepts one entry per week with date, weight, body fat, muscle mass, WHR, and visceral fat level.' }
			]
		},
		{
			title: 'Exercise Program',
			items: [
				{ id: 'ep-1', q: 'What are the 5 training phases?', a: 'Foundation (Weeks 1–4), Base Building (Weeks 5–8), Progressive Overload (Weeks 9–16), Strength + Endurance (Weeks 17–24), and Peak Phase (Weeks 25–32). Each phase progressively increases intensity and complexity.' },
				{ id: 'ep-2', q: 'Why lower-back-safe exercises?', a: 'The subject has mild lower back pain (lower_back_pain.present: true, severity: mild). All exercises are selected to avoid spinal compression in early phases. Core stability work is included in every session to support the lower back.' },
				{ id: 'ep-3', q: 'What exercises are avoided?', a: 'Barbell back squat (Months 1–4), conventional deadlift (Months 1–3), sit-ups/crunches (never), behind-the-neck press, standing barbell overhead press, and good mornings. Some may be cleared in later phases with physiotherapist approval.' },
				{ id: 'ep-4', q: 'How does progressive overload work?', a: 'Weight increases by +2.5 kg every 2–3 weeks for upper body and +5 kg for lower body. Cardio progresses by +2–5 min duration per week and +1% incline. A deload week (20% reduction) occurs every 4th week.' },
				{ id: 'ep-5', q: 'When are jog intervals introduced?', a: 'Jog intervals begin in Month 3 (Phase 3), only if the lower back is stable. The progression targets 3 km by Month 4 and 5 km by Month 6.' }
			]
		},
		{
			title: 'Health & Safety',
			items: [
				{ id: 'hs-1', q: 'Is this medical advice?', a: 'No. FitForecast is an educational estimation tool. It does not diagnose, treat, or cure any medical condition. Always consult a qualified healthcare professional before starting any exercise program, especially with pre-existing conditions.' },
				{ id: 'hs-2', q: 'Should I consult a doctor before following the program?', a: 'Yes. It is strongly recommended to consult a healthcare professional before beginning any exercise program, particularly given the lower back pain condition noted in the profile.' },
				{ id: 'hs-3', q: 'What if I experience pain during exercise?', a: 'Stop the exercise immediately. Pain (distinct from normal muscular effort) may indicate injury risk. Consult a healthcare professional before continuing. This tool cannot assess or respond to real-time health events.' },
				{ id: 'hs-4', q: 'Are the body fat categories clinically validated?', a: 'The body fat categories use ACE (American Council on Exercise) general guidelines. They are approximate ranges for general reference and do not constitute clinical assessment.' },
				{ id: 'hs-5', q: 'Is the health risk score a medical diagnosis?', a: 'No. The health risk score is an estimated composite indicator based on general fitness formulas. It is not a clinical diagnostic tool and should not be used for medical decision-making.' }
			]
		},
		{
			title: 'Technical',
			items: [
				{ id: 'te-1', q: 'What technology stack is used?', a: 'SvelteKit with adapter-static for static site generation, Svelte 5 with runes for reactivity, Tailwind CSS v4 for styling, and Chart.js for data visualization. All data is loaded from YAML at build time.' },
				{ id: 'te-2', q: 'Is my data sent to any server?', a: 'No. All data is hardcoded in the application bundle. No health data is stored on servers, transmitted over the network, or accessible to third parties. All calculations run entirely in your browser (BRU-005).' },
				{ id: 'te-3', q: 'Can I export my results?', a: 'Yes. The export page offers print-to-PDF via the browser print dialog, a shareable base64-encoded URL with key metrics, and a print-friendly view that hides navigation elements.' },
				{ id: 'te-4', q: 'How do I deploy FitForecast?', a: 'Run `npm run build` to generate a static site in the `build` directory. Deploy to any static hosting (GitHub Pages, Netlify, Vercel, etc.). No server runtime is required.' }
			]
		}
	];

	let filteredCategories = $derived(
		categories.map((cat) => ({
			...cat,
			items: cat.items.filter(
				(item) =>
					item.q.toLowerCase().includes(search.toLowerCase()) ||
					item.a.toLowerCase().includes(search.toLowerCase())
			)
		})).filter((cat) => cat.items.length > 0)
	);

	let totalQuestions = $derived(
		filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)
	);
</script>

<svelte:head>
	<title>FAQ — FitForecast</title>
	<meta name="description" content="Frequently asked questions about FitForecast data, calculations, exercise programming, and safety." />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-10">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground">Frequently Asked Questions</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Common questions about FitForecast, its data, calculations, and limitations.
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
				placeholder="Search questions..."
				class="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
			/>
		</div>
		<p class="mt-2 text-xs text-muted-foreground">
			{totalQuestions} question{totalQuestions !== 1 ? 's' : ''}{search ? ` matching "${search}"` : ' across 5 categories'}
		</p>
	</div>

	<!-- Categories -->
	<div class="space-y-8">
		{#each filteredCategories as category}
			<section>
				<h2 class="mb-3 text-lg font-semibold text-primary">{category.title}</h2>
				<div class="space-y-2">
					{#each category.items as item}
						<div class="rounded-lg border border-border bg-card">
							<button
								class="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
								onclick={() => toggleQuestion(item.id)}
								aria-expanded={expandedId === item.id}
							>
								<span class="pr-4 text-sm font-medium text-foreground">{item.q}</span>
								<svg
									class="h-4 w-4 shrink-0 text-muted-foreground transition-transform {expandedId === item.id ? 'rotate-180' : ''}"
									fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</button>

							{#if expandedId === item.id}
								<div class="border-t border-border px-5 py-4">
									<p class="text-sm text-muted-foreground">{item.a}</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/each}

		{#if filteredCategories.length === 0}
			<div class="rounded-lg border border-border bg-card p-8 text-center">
				<p class="text-sm text-muted-foreground">No questions match "{search}".</p>
			</div>
		{/if}
	</div>

	<Disclaimer variant="inline" class="mt-10" />
</div>
