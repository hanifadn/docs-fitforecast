export interface Demographics {
	gender: string;
	age: number;
	height_cm: number;
	gym_start_date: string;
	gym_experience: string;
}

export interface BodyComposition {
	weight_kg: number;
	body_fat_percent: number;
	muscle_mass_kg: number;
	waist_hip_ratio: number;
	visceral_fat_level: number;
}

export interface ActivityHistory {
	previous_gym_experience_years: number;
	equipment_familiarity: string;
	last_exercise_type: string;
	last_exercise_date: string;
	weekly_activity_frequency: string;
}

export interface LowerBackPain {
	present: boolean;
	severity: string;
}

export interface Health {
	lower_back_pain: LowerBackPain;
	other_conditions: string[];
}

export interface Goals {
	primary_goal: string[];
	training_frequency_per_week: number;
	dietary_preference: string;
}

export interface Profile {
	version: string;
	generated_date: string;
	demographics: Demographics;
	body_composition: BodyComposition;
	activity_history: ActivityHistory;
	health: Health;
	goals: Goals;
}

export interface BodyCompositionWeek {
	week: number;
	date: string;
	weight_kg: number;
	body_fat_percent: number;
	muscle_mass_kg: number;
	waist_hip_ratio: number;
	visceral_fat_level: number;
	notes: string;
}

export interface Exercise {
	name: string;
	sets?: number;
	reps?: number;
	weight_kg?: number;
	rest_seconds?: number;
	duration_minutes?: number;
	speed_kmh?: number;
	incline_percent?: number;
	intensity?: string;
	protocol?: string;
	notes?: string;
}

export interface Session {
	day: number;
	date?: string;
	workout_type: string;
	duration_minutes?: number;
	exercises?: Exercise[];
	notes?: string;
	progression?: string | string[];
}

export interface ExerciseWeek {
	week: number;
	phase: string;
	notes?: string;
	sessions: Session[];
}

export interface LibraryExercise {
	name: string;
	category: string;
	lower_back_safety: string;
	notes: string;
	phase_cleared?: string;
}

export interface AvoidedExercise {
	name: string;
	reason: string;
	phase_cleared?: string;
}

export interface ExerciseLibrary {
	approved_exercises: {
		core: LibraryExercise[];
		upper_body: LibraryExercise[];
		lower_body: LibraryExercise[];
		cardio_endurance: LibraryExercise[];
	};
	avoided_exercises: AvoidedExercise[];
}

export interface FitForecastData {
	profile: Profile;
	body_composition_tracking: BodyCompositionWeek[];
	exercise_log: ExerciseWeek[];
	exercise_library: ExerciseLibrary;
}

export interface ScenarioProjection {
	month: number;
	weight_kg: number;
	body_fat_percent: number;
	muscle_mass_kg: number;
	waist_cm: number;
}

export interface Scenario {
	name: string;
	label: string;
	projections: ScenarioProjection[];
}

export interface HealthRiskResult {
	score: number;
	label: string;
	color: string;
	breakdown: { metric: string; value: number; risk: string }[];
}

export interface Milestone {
	name: string;
	category: 'fat_loss' | 'endurance' | 'strength';
	target: string;
	estimated_month: number;
	achieved: boolean;
}
