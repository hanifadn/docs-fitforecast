import { parse } from 'yaml';
import type { FitForecastData, Profile, BodyCompositionWeek, ExerciseWeek, ExerciseLibrary } from '$lib/types/profile';

import profileYaml from '../data/profile.yaml?raw';
import bodyCompYaml from '../data/body-composition.yaml?raw';
import exerciseLogYaml from '../data/exercise-log.yaml?raw';
import exerciseLibraryYaml from '../data/exercise-library.yaml?raw';

export const prerender = true;

export function load() {
	const data: FitForecastData = {
		profile: parse(profileYaml) as Profile,
		body_composition_tracking: parse(bodyCompYaml) as BodyCompositionWeek[],
		exercise_log: parse(exerciseLogYaml) as ExerciseWeek[],
		exercise_library: parse(exerciseLibraryYaml) as ExerciseLibrary
	};
	return { fitData: data };
}
