export interface BodyFatResult {
	category: string;
	color: string;
}

interface CategoryRange {
	label: string;
	min: number;
	max: number;
	color: string;
}

const MALE_CATEGORIES: CategoryRange[] = [
	{ label: 'Essential', min: 2, max: 5, color: '#ef4444' },
	{ label: 'Athletic', min: 6, max: 13, color: '#3b82f6' },
	{ label: 'Fitness', min: 14, max: 17, color: '#22c55e' },
	{ label: 'Average', min: 18, max: 24, color: '#eab308' },
	{ label: 'Obese', min: 25, max: Infinity, color: '#ef4444' }
];

const FEMALE_CATEGORIES: CategoryRange[] = [
	{ label: 'Essential', min: 10, max: 13, color: '#ef4444' },
	{ label: 'Athletic', min: 14, max: 20, color: '#3b82f6' },
	{ label: 'Fitness', min: 21, max: 24, color: '#22c55e' },
	{ label: 'Average', min: 25, max: 31, color: '#eab308' },
	{ label: 'Obese', min: 32, max: Infinity, color: '#ef4444' }
];

/**
 * Classifies body fat percentage using ACE (American Council on Exercise)
 * categories. These ranges are approximate general guidelines.
 */
export function classifyBodyFat(percent: number, gender: string): BodyFatResult {
	const categories = gender === 'female' ? FEMALE_CATEGORIES : MALE_CATEGORIES;

	for (const cat of categories) {
		if (percent >= cat.min && percent <= cat.max) {
			return { category: cat.label, color: cat.color };
		}
	}

	if (percent < (gender === 'female' ? 10 : 2)) {
		return { category: 'Essential', color: '#ef4444' };
	}

	return { category: 'Obese', color: '#ef4444' };
}
