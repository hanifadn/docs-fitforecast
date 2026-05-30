<script lang="ts">
	const currentYear = new Date().getFullYear();

	const platformLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/dashboard/export', label: 'Export' }
	];

	const resourceLinks = [
		{ href: '/how-it-works', label: 'How It Works' },
		{ href: '/glossary', label: 'Glossary' },
		{ href: '/faq', label: 'FAQ' }
	];
</script>

<footer class="border-t border-border bg-background">
	<div class="mx-auto max-w-7xl px-4 py-12">
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<div>
				<h3 class="mb-3 text-sm font-semibold text-foreground">Platform</h3>
				<ul class="space-y-2">
					{#each platformLinks as link}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold text-foreground">Resources</h3>
				<ul class="space-y-2">
					{#each resourceLinks as link}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold text-foreground">Legal</h3>
				<ul class="space-y-2">
					<li>
						<a
							href="/disclaimer"
							class="text-sm text-muted-foreground transition-colors hover:text-primary"
						>
							Disclaimer
						</a>
					</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold text-foreground">About</h3>
				<ul class="space-y-2">
					<li class="text-sm text-muted-foreground">Version 1.0.0</li>
					<li class="text-sm text-muted-foreground">
						Generated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-10 border-t border-border pt-6">
			<p class="text-center text-xs text-muted-foreground">
				FitForecast provides estimates only. Not medical advice. Consult a qualified professional
				before starting any exercise program.
			</p>
			<p class="mt-2 text-center text-xs text-muted-foreground">
				&copy; {currentYear} FitForecast. All projections are approximate.
			</p>
		</div>
	</div>
</footer>
