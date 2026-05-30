import type { Profile, HealthRiskResult } from '$lib/types/profile';
import { calculateBMI } from './bmiCalculator';

const WEIGHTS = {
	bmi: 0.25,
	bodyFat: 0.25,
	visceralFat: 0.2,
	whr: 0.15,
	activity: 0.15
};

function scoreBMI(bmi: number): number {
	if (bmi < 18.5) return 30;
	if (bmi < 25) return 0;
	if (bmi < 30) return 40;
	if (bmi < 35) return 65;
	if (bmi < 40) return 85;
	return 100;
}

function scoreBodyFat(percent: number, gender: string): number {
	if (gender === 'female') {
		if (percent <= 24) return 0;
		if (percent <= 31) return 35;
		return Math.min(100, 50 + (percent - 31) * 3);
	}
	if (percent <= 17) return 0;
	if (percent <= 24) return 35;
	return Math.min(100, 50 + (percent - 24) * 3);
}

function scoreVisceralFat(level: number): number {
	if (level <= 9) return 0;
	if (level <= 14) return 50 + (level - 9) * 5;
	return Math.min(100, 75 + (level - 14) * 5);
}

function scoreWHR(whr: number, gender: string): number {
	const threshold = gender === 'female' ? 0.85 : 0.9;
	if (whr <= threshold) return 0;
	const excess = whr - threshold;
	return Math.min(100, excess * 500);
}

function scoreActivity(frequency: string): number {
	const map: Record<string, number> = {
		sedentary: 80,
		'1-2x/week': 50,
		'3-4x/week': 20,
		'5+/week': 0
	};
	return map[frequency] ?? 60;
}

function labelFromScore(score: number): { label: string; color: string } {
	if (score <= 20) return { label: 'Low Risk', color: '#22c55e' };
	if (score <= 40) return { label: 'Moderate', color: '#84cc16' };
	if (score <= 60) return { label: 'Elevated', color: '#eab308' };
	if (score <= 80) return { label: 'High', color: '#f97316' };
	return { label: 'Very High', color: '#ef4444' };
}

function riskLabel(componentScore: number): string {
	if (componentScore <= 20) return 'Low';
	if (componentScore <= 50) return 'Moderate';
	return 'High';
}

/**
 * Computes a composite health risk score (0–100) from multiple body
 * composition metrics. This is an estimated indicator and does not
 * replace professional medical assessment.
 */
export function calculateHealthRisk(profile: Profile): HealthRiskResult {
	const { body_composition, demographics, activity_history } = profile;
	const bmi = calculateBMI(body_composition.weight_kg, demographics.height_cm);

	const bmiScore = scoreBMI(bmi);
	const bfScore = scoreBodyFat(body_composition.body_fat_percent, demographics.gender);
	const vfScore = scoreVisceralFat(body_composition.visceral_fat_level);
	const whrScore = scoreWHR(body_composition.waist_hip_ratio, demographics.gender);
	const actScore = scoreActivity(activity_history.weekly_activity_frequency);

	const composite = Math.round(
		bmiScore * WEIGHTS.bmi +
			bfScore * WEIGHTS.bodyFat +
			vfScore * WEIGHTS.visceralFat +
			whrScore * WEIGHTS.whr +
			actScore * WEIGHTS.activity
	);

	const { label, color } = labelFromScore(composite);

	return {
		score: composite,
		label,
		color,
		breakdown: [
			{ metric: 'BMI', value: Math.round(bmi * 10) / 10, risk: riskLabel(bmiScore) },
			{
				metric: 'Body Fat %',
				value: body_composition.body_fat_percent,
				risk: riskLabel(bfScore)
			},
			{
				metric: 'Visceral Fat',
				value: body_composition.visceral_fat_level,
				risk: riskLabel(vfScore)
			},
			{ metric: 'WHR', value: body_composition.waist_hip_ratio, risk: riskLabel(whrScore) },
			{ metric: 'Activity Level', value: 0, risk: riskLabel(actScore) }
		]
	};
}
