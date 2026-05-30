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
				label: 'Body Fat %',
				data: tracking.map((w) => w.body_fat_percent),
				borderColor: darkTheme.primaryColor,
				backgroundColor: `${darkTheme.primaryColor}22`,
				borderWidth: 2,
				pointRadius: 4,
				pointBackgroundColor: darkTheme.primaryColor,
				tension: 0.3,
				fill: true
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
				max: 40,
				title: { display: true, text: '%', color: darkTheme.tickColor }
			}
		},
		plugins: {
			...basePluginOptions('Body Fat %'),
			annotation: {
				annotations: {
					obeseZone: {
						type: 'box' as const,
						yMin: 25,
						yMax: 40,
						backgroundColor: 'rgba(239, 68, 68, 0.08)',
						borderWidth: 0,
						label: {
							display: true,
							content: 'Obese (>25%)',
							color: 'rgba(239, 68, 68, 0.5)',
							position: { x: 'start' as const, y: 'center' as const }
						}
					},
					averageZone: {
						type: 'box' as const,
						yMin: 18,
						yMax: 25,
						backgroundColor: 'rgba(245, 166, 35, 0.08)',
						borderWidth: 0,
						label: {
							display: true,
							content: 'Average (18–25%)',
							color: 'rgba(245, 166, 35, 0.5)',
							position: { x: 'start' as const, y: 'center' as const }
						}
					},
					fitnessZone: {
						type: 'box' as const,
						yMin: 0,
						yMax: 18,
						backgroundColor: 'rgba(16, 185, 129, 0.08)',
						borderWidth: 0,
						label: {
							display: true,
							content: 'Fitness (<18%)',
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
