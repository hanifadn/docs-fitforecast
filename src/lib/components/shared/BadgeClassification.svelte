<script lang="ts">
	let { label, color = 'primary' }: {
		label: string;
		color?: string;
	} = $props();

	let colorClasses = $derived(
		color === 'secondary'
			? 'bg-secondary/15 text-secondary'
			: color === 'destructive'
				? 'bg-destructive/15 text-destructive'
				: 'bg-primary/15 text-primary'
	);
</script>

<span
	class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {colorClasses}"
>
	{label}
</span>
