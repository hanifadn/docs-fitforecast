<script lang="ts">
	const sections = [
		{
			number: 1,
			title: 'Purpose',
			content: 'FitForecast is a web-based estimation and visualization tool designed to project potential fitness transformation outcomes over an 8-month period. It uses hardcoded profile data, general fitness formulas, and standard body composition metrics to generate approximate forecasts. The tool is intended solely for educational and informational purposes.'
		},
		{
			number: 2,
			title: 'Not Medical Advice',
			content: 'The information provided by FitForecast does not constitute medical advice, diagnosis, or treatment. All projections, scores, classifications, and recommendations displayed within this application are approximate estimates based on general population formulas. They are not tailored clinical assessments and should not be used as the basis for any medical decision.'
		},
		{
			number: 3,
			title: 'Consult a Healthcare Provider',
			content: 'Before beginning any exercise program, making dietary changes, or acting on any information provided by this tool, you should consult with a qualified healthcare professional. This is especially important if you have pre-existing health conditions, injuries (including but not limited to lower back pain), or other medical concerns. A healthcare provider can assess your individual circumstances and provide personalized guidance.'
		},
		{
			number: 4,
			title: 'Limitations of Projections',
			content: 'All projections displayed in FitForecast are shown as estimated ranges across multiple scenarios (best case, realistic, worst case). Individual results will vary significantly based on factors including but not limited to: genetics, training adherence, nutrition compliance, sleep quality, stress levels, hormonal factors, medical conditions, and measurement accuracy. No projection should be interpreted as a guaranteed outcome.'
		},
		{
			number: 5,
			title: 'Data Accuracy',
			content: 'FitForecast relies on self-reported or manually entered body composition data. The accuracy of all calculations and projections is directly dependent on the accuracy of the input data. Measurement methods, timing, hydration status, and other factors can introduce significant variability in body composition measurements. All values should be considered approximate.'
		},
		{
			number: 6,
			title: 'No Guarantees',
			content: 'FitForecast makes no guarantees regarding the accuracy, completeness, or reliability of any information, projection, or recommendation provided. The developers and contributors of this application disclaim all warranties, express or implied, regarding the fitness of this tool for any particular purpose. Results shown are mathematical projections based on simplified models of human physiology.'
		},
		{
			number: 7,
			title: 'Exercise Caution',
			content: 'While exercises in this program have been selected with lower back safety in mind, any physical exercise carries inherent risk of injury. You should stop any exercise immediately if you experience pain, dizziness, shortness of breath, or any unusual symptoms. Listen to your body and err on the side of caution. The exercise selections in this tool are general recommendations and have not been evaluated by a physiotherapist for your specific condition.'
		},
		{
			number: 8,
			title: 'Emergency Situations',
			content: 'If you experience a medical emergency during exercise or at any other time, call your local emergency services immediately. Do not rely on this application for medical guidance in any situation. FitForecast is a static informational tool and cannot provide real-time health assessment or emergency assistance.'
		},
		{
			number: 9,
			title: 'Liability',
			content: 'To the maximum extent permitted by applicable law, the developers, contributors, and distributors of FitForecast shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use of this tool, including but not limited to physical injury, health complications, or reliance on projections and recommendations provided herein.'
		},
		{
			number: 10,
			title: 'Acceptance',
			content: 'By using FitForecast, you acknowledge that you have read and understood this disclaimer. You agree that FitForecast is an educational estimation tool, not a medical device, personal trainer, or substitute for professional healthcare. You accept full responsibility for any actions taken based on the information provided by this application.'
		}
	];
</script>

<svelte:head>
	<title>Medical Disclaimer — FitForecast</title>
	<meta name="description" content="FitForecast medical disclaimer. This tool provides estimates only and is not a substitute for professional medical advice." />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<div class="mb-10">
		<div class="mb-4 flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15">
				<svg class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
			</div>
			<div>
				<h1 class="text-3xl font-bold text-foreground">Medical Disclaimer</h1>
				<p class="text-sm text-muted-foreground">Please read carefully before using FitForecast.</p>
			</div>
		</div>

		<div class="rounded-lg border border-secondary/30 bg-secondary/5 px-5 py-3 text-sm text-secondary">
			FitForecast provides estimated projections only. It is not a medical device and does not provide medical advice, diagnosis, or treatment.
		</div>
	</div>

	<div class="space-y-8">
		{#each sections as section}
			<section class="group">
				<div class="flex items-start gap-4">
					<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
						{section.number}
					</span>
					<div>
						<h2 class="text-base font-semibold text-foreground">{section.title}</h2>
						<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{section.content}</p>
					</div>
				</div>
			</section>
		{/each}
	</div>

	<div class="mt-12 border-t border-border pt-8 text-center">
		<p class="text-sm text-muted-foreground">
			By continuing to use FitForecast, you acknowledge that you have read, understood, and agree to the terms of this disclaimer.
		</p>
		<a
			href="/dashboard"
			class="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary/90"
		>
			Back to Dashboard
		</a>
	</div>
</div>
