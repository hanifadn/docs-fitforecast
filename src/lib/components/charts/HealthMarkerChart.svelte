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

	let {
		title,
		labels,
		values,
		color,
		unit
	}: {
		title: string;
		labels: string[];
		values: number[];
		color: string;
		unit: string;
	} = $props();

	const data = $derived({
		labels,
		datasets: [
			{
				label: `${title} (${unit})`,
				data: values,
				borderColor: color,
				backgroundColor: `${color}22`,
				borderWidth: 2,
				pointRadius: 3,
				pointBackgroundColor: color,
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
				title: { display: true, text: unit, color: darkTheme.tickColor }
			}
		},
		plugins: {
			...basePluginOptions(title),
			legend: { display: false }
		}
	});
</script>

<div class="h-64 w-full">
	<Line {data} {options} />
</div>
