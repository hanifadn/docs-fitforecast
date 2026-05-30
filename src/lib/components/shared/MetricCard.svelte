<script lang="ts">
	let {
		title,
		value,
		unit = '',
		subtitle = '',
		color = 'primary',
		icon = ''
	}: {
		title: string;
		value: string | number;
		unit?: string;
		subtitle?: string;
		color?: string;
		icon?: string;
	} = $props();
</script>

<div class="rounded-lg border border-border bg-card p-5">
	<div class="flex items-start justify-between">
		<p class="text-sm text-muted-foreground">{title}</p>
		{#if icon}
			<span class="text-lg">{icon}</span>
		{/if}
	</div>

	<div class="mt-2 flex items-baseline gap-1.5">
		<span
			class="text-3xl font-bold"
			class:text-primary={color === 'primary'}
			class:text-secondary={color === 'secondary'}
			class:text-destructive={color === 'destructive'}
			class:text-foreground={color === 'foreground'}
		>
			{value}
		</span>
		{#if unit}
			<span class="text-sm text-muted-foreground">{unit}</span>
		{/if}
	</div>

	{#if subtitle}
		<p class="mt-1.5 text-xs text-muted-foreground">{subtitle}</p>
	{/if}
</div>
