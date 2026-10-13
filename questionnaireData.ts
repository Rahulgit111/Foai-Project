export interface Question {
  id: number;
  text: string;
}

export const SCALE_OPTIONS: { label: string; value: number }[] = [
  { label: 'Never', value: 1 },
  { label: 'Rarely', value: 2 },
  { label: 'Sometimes', value: 3 },
  { label: 'Often', value: 4 },
  { label: 'Very Often', value: 5 },
];

export const QUESTIONS: Question[] = [
  { id: 1, text: 'How often do you feel overwhelmed by your academic workload?' },
  { id: 2, text: 'How often do you have difficulty concentrating on your studies?' },
  { id: 3, text: 'How often do you feel worried about exams, assignments, or academic performance?' },
  { id: 4, text: 'How often do you feel tired even after getting some sleep?' },
  { id: 5, text: 'How often do you have difficulty relaxing after studying or completing academic work?' },
  { id: 6, text: 'How often do you experience problems sleeping because of academic or personal worries?' },
  { id: 7, text: 'How often do you feel that you have too many responsibilities to handle?' },
  { id: 8, text: 'How often do you feel irritable or frustrated during your daily college activities?' },
  { id: 9, text: 'How often do you feel that you do not have enough time for yourself, friends, or family?' },
  { id: 10, text: 'How often do you feel stressed or mentally exhausted during a normal college week?' },
];

export const MAX_QUESTION_SCORE = QUESTIONS.length * 5;

export const SLEEP_OPTIONS = [
  'Less than 4 hours',
  '4-5 hours',
  '5-6 hours',
  '6-7 hours',
  '7-8 hours',
  'More than 8 hours',
];

export const STUDY_OPTIONS = [
  'Less than 2 hours',
  '2-4 hours',
  '4-6 hours',
  '6-8 hours',
  'More than 8 hours',
];

export const SCREEN_OPTIONS = [
  'Less than 2 hours',
  '2-4 hours',
  '4-6 hours',
  '6-8 hours',
  'More than 8 hours',
];

export const EXERCISE_OPTIONS = [
  'Never',
  'Rarely',
  '1-2 days/week',
  '3-4 days/week',
  'Daily',
];

export const PRESSURE_OPTIONS = ['Low', 'Moderate', 'High'];
