<script lang="ts">
	let { score, label, color = 'primary' }: {
		score: number;
		label: string;
		color?: string;
	} = $props();

	let clampedScore = $derived(Math.max(0, Math.min(100, score)));
</script>

<div class="space-y-1.5">
	<div class="flex items-center justify-between">
		<span class="text-sm text-muted-foreground">{label}</span>
		<span
			class="text-sm font-semibold"
			class:text-primary={color === 'primary'}
			class:text-secondary={color === 'secondary'}
			class:text-destructive={color === 'destructive'}
		>
			{clampedScore}
		</span>
	</div>

	<div class="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
		<!-- Segment markers -->
		<div class="absolute inset-0 flex">
			<div class="w-1/5 border-r border-background/40"></div>
			<div class="w-1/5 border-r border-background/40"></div>
			<div class="w-1/5 border-r border-background/40"></div>
			<div class="w-1/5 border-r border-background/40"></div>
			<div class="w-1/5"></div>
		</div>

		<!-- Fill bar -->
		<div
			class="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
			class:bg-primary={color === 'primary'}
			class:bg-secondary={color === 'secondary'}
			class:bg-destructive={color === 'destructive'}
			style="width: {clampedScore}%"
		></div>
	</div>
</div>
