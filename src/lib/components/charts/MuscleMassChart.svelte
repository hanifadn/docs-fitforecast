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
		Filler
	);

	let { tracking }: { tracking: BodyCompositionWeek[] } = $props();

	const data = $derived({
		labels: tracking.map((w) => `W${w.week}`),
		datasets: [
			{
				label: 'Muscle Mass (kg)',
				data: tracking.map((w) => w.muscle_mass_kg),
				borderColor: darkTheme.successColor,
				backgroundColor: `${darkTheme.successColor}22`,
				borderWidth: 2,
				pointRadius: 4,
				pointBackgroundColor: darkTheme.successColor,
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
				title: { display: true, text: 'kg', color: darkTheme.tickColor }
			}
		},
		plugins: basePluginOptions('Muscle Mass')
	});
</script>

<div class="h-72 w-full">
	<Line {data} {options} />
</div>
