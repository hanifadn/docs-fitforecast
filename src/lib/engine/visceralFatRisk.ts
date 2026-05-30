export interface VisceralFatResult {
	level: number;
	tier: string;
	color: string;
	recommendation: string;
}

/**
 * Evaluates visceral fat level and returns a risk tier with guidance.
 * Visceral fat levels are approximate indicators; they do not constitute
 * a medical diagnosis.
 */
export function getVisceralFatRisk(level: number): VisceralFatResult {
	if (level <= 9) {
		return {
			level,
			tier: 'Normal/Healthy',
			color: '#22c55e',
			recommendation:
				'Visceral fat is within a healthy range. Maintaining current activity and dietary habits may help sustain this level.'
		};
	}

	if (level <= 14) {
		return {
			level,
			tier: 'High',
			color: '#f59e0b',
			recommendation:
				'Visceral fat may suggest elevated metabolic risk. A combination of regular exercise and a calorie-appropriate diet may help reduce this level over time.'
		};
	}

	return {
		level,
		tier: 'Very High',
		color: '#ef4444',
		recommendation:
			'Visceral fat level may suggest significantly elevated risk. Consistent cardiovascular exercise and dietary adjustments are strongly recommended. Consider consulting a healthcare professional.'
	};
}
