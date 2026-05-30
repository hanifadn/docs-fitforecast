export interface BMIResult {
	bmi: number;
	classification: string;
	color: string;
}

export function calculateBMI(weight_kg: number, height_cm: number): number {
	const height_m = height_cm / 100;
	return weight_kg / (height_m * height_m);
}

export function classifyBMI(bmi: number): string {
	if (bmi < 18.5) return 'Underweight';
	if (bmi < 25) return 'Normal';
	if (bmi < 30) return 'Overweight';
	if (bmi < 35) return 'Obese I';
	if (bmi < 40) return 'Obese II';
	return 'Obese III';
}

function getBMIColor(classification: string): string {
	const colors: Record<string, string> = {
		Underweight: '#3b82f6',
		Normal: '#22c55e',
		Overweight: '#eab308',
		'Obese I': '#f97316',
		'Obese II': '#ef4444',
		'Obese III': '#991b1b'
	};
	return colors[classification] ?? '#6b7280';
}

/**
 * Returns BMI value, WHO classification, and associated display color.
 * Note: BMI is an approximate screening tool and does not account for
 * muscle mass distribution or individual health factors.
 */
export function getBMIResult(weight_kg: number, height_cm: number): BMIResult {
	const bmi = calculateBMI(weight_kg, height_cm);
	const classification = classifyBMI(bmi);
	return {
		bmi: Math.round(bmi * 10) / 10,
		classification,
		color: getBMIColor(classification)
	};
}
