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

	const data = $derived({
		labels: tracking.map((w) => `W${w.week}`),
		datasets: [
			{
				label: 'Visceral Fat Level',
				data: tracking.map((w) => w.visceral_fat_level),
				borderColor: darkTheme.primaryColor,
				backgroundColor: `${darkTheme.primaryColor}22`,
				borderWidth: 2,
				pointRadius: 4,
				pointBackgroundColor: darkTheme.primaryColor,
				tension: 0,
				stepped: true as const,
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
				min: 0,
				max: 20,
				title: { display: true, text: 'Level', color: darkTheme.tickColor }
			}
		},
		plugins: {
			...basePluginOptions('Visceral Fat Level'),
			annotation: {
				annotations: {
					dangerZone: {
						type: 'box' as const,
						yMin: 15,
						yMax: 20,
						backgroundColor: 'rgba(239, 68, 68, 0.08)',
						borderWidth: 0,
						label: {
							display: true,
							content: 'High Risk (15+)',
							color: 'rgba(239, 68, 68, 0.5)',
							position: { x: 'start' as const, y: 'center' as const }
						}
					},
					warningZone: {
						type: 'box' as const,
						yMin: 10,
						yMax: 15,
						backgroundColor: 'rgba(245, 166, 35, 0.08)',
						borderWidth: 0,
						label: {
							display: true,
							content: 'Moderate (10–14)',
							color: 'rgba(245, 166, 35, 0.5)',
							position: { x: 'start' as const, y: 'center' as const }
						}
					},
					healthyZone: {
						type: 'box' as const,
						yMin: 0,
						yMax: 10,
						backgroundColor: 'rgba(16, 185, 129, 0.08)',
						borderWidth: 0,
						label: {
							display: true,
							content: 'Healthy (1–9)',
							color: 'rgba(16, 185, 129, 0.5)',
							position: { x: 'start' as const, y: 'center' as const }
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
