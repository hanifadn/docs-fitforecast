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

	let { tracking }: { tracking: BodyCompositionWeek[] } = $props();

	const TARGET_WEIGHT = 78;

	const data = $derived({
		labels: tracking.map((w) => `W${w.week}`),
		datasets: [
			{
				label: 'Weight (kg)',
				data: tracking.map((w) => w.weight_kg),
				borderColor: darkTheme.primaryColor,
				backgroundColor: `${darkTheme.primaryColor}33`,
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
				title: { display: true, text: 'kg', color: darkTheme.tickColor }
			}
		},
		plugins: {
			...basePluginOptions('Weight Progress'),
			annotation: {
				annotations: {
					goalLine: {
						type: 'line' as const,
						yMin: TARGET_WEIGHT,
						yMax: TARGET_WEIGHT,
						borderColor: darkTheme.secondaryColor,
						borderWidth: 2,
						borderDash: [6, 4],
						label: {
							display: true,
							content: `Goal: ${TARGET_WEIGHT} kg`,
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
