<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';

	let menuOpen = $state(false);

	const navLinks = [
		{ href: `${base}/`, label: 'Home' },
		{ href: `${base}/profile`, label: 'Profile' },
		{ href: `${base}/log`, label: 'Exercise Log' },
		{ href: `${base}/dashboard`, label: 'Dashboard' },
		{ href: `${base}/how-it-works`, label: 'How It Works' },
		{ href: `${base}/glossary`, label: 'Glossary' },
		{ href: `${base}/faq`, label: 'FAQ' }
	];

	function isActive(href: string): boolean {
		const targetHref = href === `${base}/` ? '/' : href.replace(base, '');
		const currentPath = page.url.pathname.replace(base, '') || '/';
		if (targetHref === '/') return currentPath === '/';
		return currentPath.startsWith(targetHref);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<nav
	class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<a href="{base}/" class="text-xl font-bold text-primary">FitForecast</a>

		<div class="hidden items-center gap-1 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="relative px-3 py-2 text-sm transition-colors {isActive(link.href)
						? 'text-primary'
						: 'text-muted-foreground hover:text-foreground'}"
				>
					{link.label}
					{#if isActive(link.href)}
						<span
							class="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
						></span>
					{/if}
				</a>
			{/each}
		</div>

		<button
			class="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
			onclick={toggleMenu}
			aria-label="Toggle menu"
			aria-expanded={menuOpen}
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				{#if menuOpen}
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				{/if}
			</svg>
		</button>
	</div>

	{#if menuOpen}
		<div class="border-t border-border md:hidden">
			<div class="flex flex-col px-4 py-2">
				{#each navLinks as link}
					<a
						href={link.href}
						class="rounded-md px-3 py-2.5 text-sm transition-colors {isActive(link.href)
							? 'bg-primary/10 text-primary'
							: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
						onclick={closeMenu}
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>
