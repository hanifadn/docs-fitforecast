<script lang="ts">
	let { variant = 'inline', class: className = '' }: {
		variant?: 'banner' | 'inline' | 'full';
		class?: string;
	} = $props();
</script>

{#if variant === 'banner'}
	<div class="flex items-center gap-2 bg-secondary/15 px-4 py-2.5 {className}">
		<svg class="h-4 w-4 shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
		</svg>
		<p class="text-sm text-secondary">
			FitForecast provides estimated projections only. This is not medical advice.
		</p>
	</div>
{:else if variant === 'inline'}
	<p class="text-xs text-muted-foreground {className}">
		Estimates only — not medical advice.
	</p>
{:else if variant === 'full'}
	<div class="space-y-3 rounded-lg border border-border bg-card p-5 {className}">
		<div class="flex items-center gap-2">
			<svg class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
			</svg>
			<h4 class="text-sm font-semibold text-foreground">Medical Disclaimer</h4>
		</div>
		<p class="text-sm text-muted-foreground">
			FitForecast provides estimated projections based on general fitness formulas and the data you
			provide. All values shown are approximate ranges, not exact predictions.
		</p>
		<p class="text-sm text-muted-foreground">
			This tool does not diagnose, treat, or cure any medical condition. Always consult a qualified
			healthcare professional before beginning any exercise program or making dietary changes,
			especially if you have pre-existing health conditions.
		</p>
		<p class="text-sm text-muted-foreground">
			No health data is stored or transmitted outside your browser. All calculations are performed
			locally on your device.
		</p>
	</div>
{/if}
