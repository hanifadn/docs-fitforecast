import type { Profile, Scenario, ScenarioProjection } from '$lib/types/profile';

interface ScenarioParams {
	name: string;
	label: string;
	fatLossPerWeek: number;
	muscleGainPerMonth: number;
}

const SCENARIO_CONFIGS: ScenarioParams[] = [
	{ name: 'best', label: 'Best Case', fatLossPerWeek: 0.8, muscleGainPerMonth: 0.3 },
	{ name: 'realistic', label: 'Realistic', fatLossPerWeek: 0.5, muscleGainPerMonth: 0.2 },
	{ name: 'worst', label: 'Worst Case', fatLossPerWeek: 0.25, muscleGainPerMonth: 0.1 }
];

const WEEKS_PER_MONTH = 4.33;

function estimateWaistFromWeight(
	currentWeight: number,
	baselineWeight: number,
	baselineWaist: number
): number {
	const weightRatio = currentWeight / baselineWeight;
	return Math.round(baselineWaist * Math.pow(weightRatio, 0.6) * 10) / 10;
}

function projectScenario(
	params: ScenarioParams,
	baseline: {
		weight: number;
		bodyFat: number;
		muscleMass: number;
		waist: number;
	},
	months: number
): ScenarioProjection[] {
	const projections: ScenarioProjection[] = [];
	let fatMass = baseline.weight * (baseline.bodyFat / 100);
	let leanMass = baseline.weight - fatMass;

	for (let m = 1; m <= months; m++) {
		const fatLostThisMonth = params.fatLossPerWeek * WEEKS_PER_MONTH;
		fatMass = Math.max(fatMass - fatLostThisMonth, baseline.weight * 0.05);
		leanMass += params.muscleGainPerMonth;

		const totalWeight = fatMass + leanMass;
		const bodyFatPct = (fatMass / totalWeight) * 100;

		projections.push({
			month: m,
			weight_kg: Math.round(totalWeight * 10) / 10,
			body_fat_percent: Math.round(bodyFatPct * 10) / 10,
			muscle_mass_kg: Math.round((baseline.muscleMass + params.muscleGainPerMonth * m) * 10) / 10,
			waist_cm: estimateWaistFromWeight(totalWeight, baseline.weight, baseline.waist)
		});
	}

	return projections;
}

/**
 * Projects body composition changes over 8 months across best, realistic,
 * and worst case scenarios. All values are approximate estimates intended
 * for motivational tracking, not medical guidance.
 */
export function forecastTransformation(profile: Profile): Scenario[] {
	const { body_composition, demographics } = profile;
	const baselineWaist =
		body_composition.waist_hip_ratio > 0
			? body_composition.waist_hip_ratio * (demographics.height_cm * 0.53)
			: 90;

	const baseline = {
		weight: body_composition.weight_kg,
		bodyFat: body_composition.body_fat_percent,
		muscleMass: body_composition.muscle_mass_kg,
		waist: baselineWaist
	};

	return SCENARIO_CONFIGS.map((config) => ({
		name: config.name,
		label: config.label,
		projections: projectScenario(config, baseline, 8)
	}));
}
