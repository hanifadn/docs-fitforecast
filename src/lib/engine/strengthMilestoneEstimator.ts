import type { Profile, Milestone } from '$lib/types/profile';

/**
 * Estimates approximate month when each milestone may be achieved,
 * based on the subject's baseline metrics and training frequency.
 * These are rough projections and individual results will vary.
 */
export function estimateMilestones(profile: Profile): Milestone[] {
	const { body_composition, goals } = profile;
	const freq = goals.training_frequency_per_week;
	const frequencyFactor = freq >= 4 ? 0.8 : freq >= 3 ? 1.0 : 1.3;

	const milestones: Milestone[] = [];

	const realisticFatLossPerMonth = 0.5 * 4.33;
	const monthsToLose5kg = Math.ceil((5 / realisticFatLossPerMonth) * frequencyFactor);
	milestones.push({
		name: 'First 5 kg lost',
		category: 'fat_loss',
		target: `Reach approximately ${Math.round((body_composition.weight_kg - 5) * 10) / 10} kg`,
		estimated_month: Math.min(monthsToLose5kg, 8),
		achieved: false
	});

	const currentBF = body_composition.body_fat_percent;
	const targetBF = currentBF * 0.9;
	const fatMass = body_composition.weight_kg * (currentBF / 100);
	const targetFatMass = body_composition.weight_kg * (targetBF / 100);
	const fatToLose = fatMass - targetFatMass;
	const monthsTo10pctBF = Math.ceil((fatToLose / realisticFatLossPerMonth) * frequencyFactor);
	milestones.push({
		name: '10% body fat reduction',
		category: 'fat_loss',
		target: `Reach approximately ${Math.round(targetBF * 10) / 10}% body fat`,
		estimated_month: Math.min(monthsTo10pctBF, 8),
		achieved: false
	});

	const whrGap = body_composition.waist_hip_ratio - 0.9;
	const monthsToHealthyWHR =
		whrGap > 0 ? Math.ceil((whrGap / 0.01) * frequencyFactor) : 0;
	milestones.push({
		name: 'Healthy WHR',
		category: 'fat_loss',
		target: 'WHR below 0.90',
		estimated_month: monthsToHealthyWHR > 0 ? Math.min(monthsToHealthyWHR, 8) : 1,
		achieved: body_composition.waist_hip_ratio < 0.9
	});

	const vfGap = body_composition.visceral_fat_level - 9;
	const monthsToHealthyVF =
		vfGap > 0 ? Math.ceil((vfGap / 0.8) * frequencyFactor) : 0;
	milestones.push({
		name: 'Healthy visceral fat',
		category: 'fat_loss',
		target: 'Visceral fat level below 10',
		estimated_month: vfGap > 0 ? Math.min(monthsToHealthyVF, 8) : 1,
		achieved: body_composition.visceral_fat_level < 10
	});

	milestones.push({
		name: '20 min continuous bike',
		category: 'endurance',
		target: '20 minutes sustained cycling at moderate intensity',
		estimated_month: Math.min(Math.ceil(2 * frequencyFactor), 8),
		achieved: false
	});

	milestones.push({
		name: '30 min continuous walk',
		category: 'endurance',
		target: '30 minutes sustained brisk walking',
		estimated_month: Math.min(Math.ceil(1 * frequencyFactor), 8),
		achieved: false
	});

	milestones.push({
		name: '3 km jog',
		category: 'endurance',
		target: 'Complete 3 km jog without stopping',
		estimated_month: Math.min(Math.ceil(4 * frequencyFactor), 8),
		achieved: false
	});

	milestones.push({
		name: '5 km jog',
		category: 'endurance',
		target: 'Complete 5 km jog without stopping',
		estimated_month: Math.min(Math.ceil(6 * frequencyFactor), 8),
		achieved: false
	});

	milestones.push({
		name: 'Modified push-up',
		category: 'strength',
		target: 'Complete 10 modified (knee) push-ups with proper form',
		estimated_month: Math.min(Math.ceil(1.5 * frequencyFactor), 8),
		achieved: false
	});

	milestones.push({
		name: 'Bodyweight squat ×20',
		category: 'strength',
		target: '20 consecutive bodyweight squats',
		estimated_month: Math.min(Math.ceil(2.5 * frequencyFactor), 8),
		achieved: false
	});

	milestones.push({
		name: 'Hip thrust bodyweight',
		category: 'strength',
		target: `Hip thrust at bodyweight (approximately ${Math.round(body_composition.weight_kg)}kg)`,
		estimated_month: Math.min(Math.ceil(5 * frequencyFactor), 8),
		achieved: false
	});

	return milestones;
}
