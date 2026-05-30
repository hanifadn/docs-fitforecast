import type { Profile, Scenario } from '$lib/types/profile';
import { forecastTransformation } from './transformationForecaster';

export interface ScenarioSummaryRow {
	metric: string;
	best: string;
	realistic: string;
	worst: string;
}

export interface ScenarioComparison {
	scenarios: Scenario[];
	summary: ScenarioSummaryRow[];
}

function formatRange(value: number, unit: string): string {
	return `~${value}${unit}`;
}

function findScenario(scenarios: Scenario[], name: string): Scenario | undefined {
	return scenarios.find((s) => s.name === name);
}

/**
 * Produces a side-by-side comparison of best/realistic/worst projections
 * at the 8-month mark. All values are estimated ranges, not guarantees.
 */
export function getScenarioComparison(profile: Profile): ScenarioComparison {
	const scenarios = forecastTransformation(profile);

	const best = findScenario(scenarios, 'best');
	const realistic = findScenario(scenarios, 'realistic');
	const worst = findScenario(scenarios, 'worst');

	const month8 = {
		best: best?.projections[7],
		realistic: realistic?.projections[7],
		worst: worst?.projections[7]
	};

	const baseline = profile.body_composition;

	const summary: ScenarioSummaryRow[] = [
		{
			metric: 'Estimated Weight (kg)',
			best: month8.best ? formatRange(month8.best.weight_kg, ' kg') : 'N/A',
			realistic: month8.realistic ? formatRange(month8.realistic.weight_kg, ' kg') : 'N/A',
			worst: month8.worst ? formatRange(month8.worst.weight_kg, ' kg') : 'N/A'
		},
		{
			metric: 'Estimated Body Fat %',
			best: month8.best ? formatRange(month8.best.body_fat_percent, '%') : 'N/A',
			realistic: month8.realistic
				? formatRange(month8.realistic.body_fat_percent, '%')
				: 'N/A',
			worst: month8.worst ? formatRange(month8.worst.body_fat_percent, '%') : 'N/A'
		},
		{
			metric: 'Estimated Muscle Mass (kg)',
			best: month8.best ? formatRange(month8.best.muscle_mass_kg, ' kg') : 'N/A',
			realistic: month8.realistic
				? formatRange(month8.realistic.muscle_mass_kg, ' kg')
				: 'N/A',
			worst: month8.worst ? formatRange(month8.worst.muscle_mass_kg, ' kg') : 'N/A'
		},
		{
			metric: 'Estimated Waist (cm)',
			best: month8.best ? formatRange(month8.best.waist_cm, ' cm') : 'N/A',
			realistic: month8.realistic
				? formatRange(month8.realistic.waist_cm, ' cm')
				: 'N/A',
			worst: month8.worst ? formatRange(month8.worst.waist_cm, ' cm') : 'N/A'
		},
		{
			metric: 'Total Weight Change',
			best: month8.best
				? formatRange(
						Math.round((baseline.weight_kg - month8.best.weight_kg) * 10) / 10,
						' kg lost'
					)
				: 'N/A',
			realistic: month8.realistic
				? formatRange(
						Math.round((baseline.weight_kg - month8.realistic.weight_kg) * 10) / 10,
						' kg lost'
					)
				: 'N/A',
			worst: month8.worst
				? formatRange(
						Math.round((baseline.weight_kg - month8.worst.weight_kg) * 10) / 10,
						' kg lost'
					)
				: 'N/A'
		}
	];

	return { scenarios, summary };
}
