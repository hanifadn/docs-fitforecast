<script lang="ts">
	import Disclaimer from '$lib/components/layout/Disclaimer.svelte';
	import MetricCard from '$lib/components/shared/MetricCard.svelte';
	import { getBMIResult } from '$lib/engine/bmiCalculator';
	import { classifyBodyFat } from '$lib/engine/bodyFatClassifier';
	import { calculateHealthRisk } from '$lib/engine/healthRiskScore';
	import { getScenarioComparison } from '$lib/engine/scenarioEngine';
	import { base } from '$app/paths';

	let { data } = $props();
	let profile = $derived(data.fitData.profile);
	let bc = $derived(profile.body_composition);
	let demo = $derived(profile.demographics);

	let bmi = $derived(getBMIResult(bc.weight_kg, demo.height_cm));
	let bodyFat = $derived(classifyBodyFat(bc.body_fat_percent, demo.gender));
	let healthRisk = $derived(calculateHealthRisk(profile));
	let comparison = $derived(getScenarioComparison(profile));

	let printMode = $state(false);
	let copied = $state(false);

	function generateShareData(): string {
		const payload = {
			weight: bc.weight_kg,
			bf: bc.body_fat_percent,
			bmi: bmi.bmi,
			risk: healthRisk.score,
			date: profile.generated_date
		};
		return btoa(JSON.stringify(payload));
	}

	function copyShareLink() {
		const encoded = generateShareData();
		const url = `${window.location.origin}${base}/dashboard?share=${encoded}`;
		navigator.clipboard.writeText(url).then(() => {
			copied = true;
			setTimeout(() => copied = false, 2000);
		});
	}

	function handlePrint() {
		printMode = true;
		requestAnimationFrame(() => {
			window.print();
			printMode = false;
		});
	}

	function exportPdf() {
		handlePrint();
	}
</script>

<svelte:head>
	<title>Export — FitForecast</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-10" class:print-mode={printMode}>
	<div class="mb-8">
		<a href="{base}/dashboard" class="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Dashboard
		</a>
		<h1 class="text-3xl font-bold text-foreground">Export Results</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Download, share, or print your FitForecast assessment summary.
		</p>
	</div>

	<!-- Export Actions -->
	<div class="mb-8 grid gap-4 sm:grid-cols-3">
		<button
			onclick={exportPdf}
			class="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			</div>
			<div>
				<p class="text-sm font-semibold text-foreground">Export PDF</p>
				<p class="text-xs text-muted-foreground">Print-to-PDF via browser</p>
			</div>
		</button>

		<button
			onclick={copyShareLink}
			class="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
				</svg>
			</div>
			<div>
				<p class="text-sm font-semibold text-foreground">{copied ? 'Copied!' : 'Copy Share Link'}</p>
				<p class="text-xs text-muted-foreground">Base64-encoded summary URL</p>
			</div>
		</button>

		<button
			onclick={handlePrint}
			class="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
				</svg>
			</div>
			<div>
				<p class="text-sm font-semibold text-foreground">Print View</p>
				<p class="text-xs text-muted-foreground">Browser print dialog</p>
			</div>
		</button>
	</div>

	<!-- Summary Preview -->
	<div class="rounded-lg border border-border bg-card p-6">
		<h2 class="mb-1 text-lg font-semibold text-foreground">Assessment Summary</h2>
		<p class="mb-6 text-xs text-muted-foreground">Generated {profile.generated_date} · Profile v{profile.version}</p>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<MetricCard title="Weight" value={bc.weight_kg} unit="kg" icon="⚖️" />
			<MetricCard title="BMI" value={bmi.bmi} subtitle={bmi.classification} icon="📐" />
			<MetricCard title="Body Fat" value={bc.body_fat_percent} unit="%" subtitle={bodyFat.category} color="secondary" />
			<MetricCard title="Health Risk" value={healthRisk.score} unit="/100" subtitle={healthRisk.label} color={healthRisk.score > 60 ? 'destructive' : 'secondary'} icon="🩺" />
		</div>

		<div class="mt-6">
			<h3 class="mb-3 text-sm font-semibold text-foreground">8-Month Scenario Comparison</h3>
			<div class="overflow-x-auto rounded-lg border border-border">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-border bg-muted/30">
							<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Metric</th>
							<th class="px-4 py-2.5 text-right font-medium text-green-400">Best</th>
							<th class="px-4 py-2.5 text-right font-medium text-primary">Realistic</th>
							<th class="px-4 py-2.5 text-right font-medium text-secondary">Worst</th>
						</tr>
					</thead>
					<tbody>
						{#each comparison.summary as row}
							<tr class="border-b border-border">
								<td class="px-4 py-2 text-foreground">{row.metric}</td>
								<td class="px-4 py-2 text-right text-green-400">{row.best}</td>
								<td class="px-4 py-2 text-right text-primary">{row.realistic}</td>
								<td class="px-4 py-2 text-right text-secondary">{row.worst}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<Disclaimer variant="full" class="mt-6" />
	</div>
</div>

<style>
	@media print {
		:global(nav), :global(footer) {
			display: none !important;
		}
	}
</style>
