<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import {
		Chart,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend,
		Filler
	} from 'chart.js';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import type { BodyCompositionWeek } from '$lib/types/profile';
	import { darkTheme, baseScaleOptions, basePluginOptions } from './chartConfig';

	Chart.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend,
		Filler,
		annotationPlugin
	);

	const HEALTHY_THRESHOLD = 0.9;

	let { tracking }: { tracking: BodyCompositionWeek[] } = $props();

	const data = $derived({
		labels: tracking.map((w) => `W${w.week}`),
		datasets: [
			{
				label: 'Waist-Hip Ratio',
				data: tracking.map((w) => w.waist_hip_ratio),
				borderColor: darkTheme.primaryColor,
				backgroundColor: `${darkTheme.primaryColor}22`,
				borderWidth: 2,
				pointRadius: 4,
				pointBackgroundColor: darkTheme.primaryColor,
				tension: 0.3,
				fill: false
			}
		]
	});

	const options = $derived({
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			...baseScaleOptions(),
			y: {
				...baseScaleOptions().y,
				title: { display: true, text: 'Ratio', color: darkTheme.tickColor }
			}
		},
		plugins: {
			...basePluginOptions('Waist-Hip Ratio'),
			annotation: {
				annotations: {
					healthyLine: {
						type: 'line' as const,
						yMin: HEALTHY_THRESHOLD,
						yMax: HEALTHY_THRESHOLD,
						borderColor: darkTheme.secondaryColor,
						borderWidth: 2,
						borderDash: [6, 4],
						label: {
							display: true,
							content: `Healthy: ≤${HEALTHY_THRESHOLD}`,
							color: darkTheme.secondaryColor,
							position: 'start' as const
						}
					}
				}
			}
		}
	});
</script>

<div class="h-72 w-full">
	<Line {data} {options} />
</div>
