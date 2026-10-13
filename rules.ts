import type { LifestyleData, StressLevel } from '../lib/types';

// ============================================================
// RULE-BASED EXPERT SYSTEM — IF–THEN RULES
// ============================================================
// Each rule has:
//   - id:        Rule identifier (R01, R02, ...)
//   - category:  Which domain this rule covers
//   - condition: Human-readable description of the IF part
//   - conclusion: Human-readable description of the THEN part
//   - test:      Predicate function that evaluates user facts
//   - stressPoints: Points added to the stress score if the rule fires
//   - factorLabel:  Which contributing factor this rule affects
//   - factorStatus: What status to assign if this rule fires
// ============================================================

export type FactorStatus = 'good' | 'moderate' | 'needs-attention';

export interface Rule {
  id: string;
  category: 'sleep' | 'study' | 'screen' | 'exercise' | 'academic' | 'questionnaire';
  condition: string;
  conclusion: string;
  test: (facts: RuleFacts) => boolean;
  stressPoints: number;
  factorLabel: string;
  factorStatus: FactorStatus;
}

export interface RuleFacts {
  questionnaireScore: number;      // 0–50 (10 questions × 1–5)
  questionnairePercent: number;    // 0–100
  sleepHours: string;
  studyHours: string;
  screenTime: string;
  exerciseFrequency: string;
  academicPressure: string;        // 'Low' | 'Moderate' | 'High'
}

export const RULES: Rule[] = [
  // --- SLEEP RULES ---
  {
    id: 'R01',
    category: 'sleep',
    condition: 'IF sleep hours < 5',
    conclusion: 'THEN sleep-related stress factor = HIGH',
    test: (f) => f.sleepHours === 'Less than 4 hours' || f.sleepHours === '4-5 hours',
    stressPoints: 18,
    factorLabel: 'Sleep',
    factorStatus: 'needs-attention',
  },
  {
    id: 'R02',
    category: 'sleep',
    condition: 'IF sleep hours is 5–6',
    conclusion: 'THEN sleep-related stress factor = MODERATE',
    test: (f) => f.sleepHours === '5-6 hours',
    stressPoints: 10,
    factorLabel: 'Sleep',
    factorStatus: 'moderate',
  },
  {
    id: 'R03',
    category: 'sleep',
    condition: 'IF sleep hours >= 6',
    conclusion: 'THEN sleep-related stress factor = LOW',
    test: (f) => f.sleepHours === '6-7 hours' || f.sleepHours === '7-8 hours' || f.sleepHours === 'More than 8 hours',
    stressPoints: 2,
    factorLabel: 'Sleep',
    factorStatus: 'good',
  },

  // --- STUDY HOURS RULES ---
  {
    id: 'R04',
    category: 'study',
    condition: 'IF study time > 8 hours/day',
    conclusion: 'THEN study pressure factor = HIGH',
    test: (f) => f.studyHours === 'More than 8 hours',
    stressPoints: 14,
    factorLabel: 'Study Hours',
    factorStatus: 'needs-attention',
  },
  {
    id: 'R05',
    category: 'study',
    condition: 'IF study time is 6–8 hours/day',
    conclusion: 'THEN study pressure factor = MODERATE',
    test: (f) => f.studyHours === '6-8 hours',
    stressPoints: 8,
    factorLabel: 'Study Hours',
    factorStatus: 'moderate',
  },
  {
    id: 'R06',
    category: 'study',
    condition: 'IF study time is 4–6 hours/day',
    conclusion: 'THEN study pressure factor = LOW',
    test: (f) => f.studyHours === '4-6 hours',
    stressPoints: 4,
    factorLabel: 'Study Hours',
    factorStatus: 'good',
  },
  {
    id: 'R07',
    category: 'study',
    condition: 'IF study time < 4 hours/day',
    conclusion: 'THEN study pressure factor = LOW',
    test: (f) => f.studyHours === 'Less than 2 hours' || f.studyHours === '2-4 hours',
    stressPoints: 2,
    factorLabel: 'Study Hours',
    factorStatus: 'good',
  },

  // --- SCREEN TIME RULES ---
  {
    id: 'R08',
    category: 'screen',
    condition: 'IF screen time > 6 hours/day',
    conclusion: 'THEN lifestyle stress factor = MODERATE',
    test: (f) => f.screenTime === '6-8 hours' || f.screenTime === 'More than 8 hours',
    stressPoints: 12,
    factorLabel: 'Screen Time',
    factorStatus: 'needs-attention',
  },
  {
    id: 'R09',
    category: 'screen',
    condition: 'IF screen time is 4–6 hours/day',
    conclusion: 'THEN lifestyle stress factor = MODERATE',
    test: (f) => f.screenTime === '4-6 hours',
    stressPoints: 7,
    factorLabel: 'Screen Time',
    factorStatus: 'moderate',
  },
  {
    id: 'R10',
    category: 'screen',
    condition: 'IF screen time < 4 hours/day',
    conclusion: 'THEN lifestyle stress factor = LOW',
    test: (f) => f.screenTime === 'Less than 2 hours' || f.screenTime === '2-4 hours',
    stressPoints: 2,
    factorLabel: 'Screen Time',
    factorStatus: 'good',
  },

  // --- EXERCISE RULES ---
  {
    id: 'R11',
    category: 'exercise',
    condition: 'IF exercise = Never',
    conclusion: 'THEN lifestyle stress factor = MODERATE',
    test: (f) => f.exerciseFrequency === 'Never',
    stressPoints: 10,
    factorLabel: 'Exercise',
    factorStatus: 'needs-attention',
  },
  {
    id: 'R12',
    category: 'exercise',
    condition: 'IF exercise = Rarely',
    conclusion: 'THEN lifestyle stress factor = MODERATE',
    test: (f) => f.exerciseFrequency === 'Rarely',
    stressPoints: 7,
    factorLabel: 'Exercise',
    factorStatus: 'moderate',
  },
  {
    id: 'R13',
    category: 'exercise',
    condition: 'IF exercise >= 1-2 days/week',
    conclusion: 'THEN lifestyle stress factor = LOW',
    test: (f) => f.exerciseFrequency === '1-2 days/week' || f.exerciseFrequency === '3-4 days/week' || f.exerciseFrequency === 'Daily',
    stressPoints: 2,
    factorLabel: 'Exercise',
    factorStatus: 'good',
  },

  // --- ACADEMIC PRESSURE RULES ---
  {
    id: 'R14',
    category: 'academic',
    condition: 'IF academic pressure = High',
    conclusion: 'THEN academic stress factor = HIGH',
    test: (f) => f.academicPressure === 'High',
    stressPoints: 16,
    factorLabel: 'Academic Workload',
    factorStatus: 'needs-attention',
  },
  {
    id: 'R15',
    category: 'academic',
    condition: 'IF academic pressure = Moderate',
    conclusion: 'THEN academic stress factor = MODERATE',
    test: (f) => f.academicPressure === 'Moderate',
    stressPoints: 8,
    factorLabel: 'Academic Workload',
    factorStatus: 'moderate',
  },
  {
    id: 'R16',
    category: 'academic',
    condition: 'IF academic pressure = Low',
    conclusion: 'THEN academic stress factor = LOW',
    test: (f) => f.academicPressure === 'Low',
    stressPoints: 2,
    factorLabel: 'Academic Workload',
    factorStatus: 'good',
  },

  // --- QUESTIONNAIRE RULES ---
  {
    id: 'R17',
    category: 'questionnaire',
    condition: 'IF questionnaire score > 35 (out of 50)',
    conclusion: 'THEN questionnaire stress factor = HIGH',
    test: (f) => f.questionnaireScore > 35,
    stressPoints: 20,
    factorLabel: 'Questionnaire Responses',
    factorStatus: 'needs-attention',
  },
  {
    id: 'R18',
    category: 'questionnaire',
    condition: 'IF questionnaire score is 25–35',
    conclusion: 'THEN questionnaire stress factor = MODERATE',
    test: (f) => f.questionnaireScore >= 25 && f.questionnaireScore <= 35,
    stressPoints: 12,
    factorLabel: 'Questionnaire Responses',
    factorStatus: 'moderate',
  },
  {
    id: 'R19',
    category: 'questionnaire',
    condition: 'IF questionnaire score < 25',
    conclusion: 'THEN questionnaire stress factor = LOW',
    test: (f) => f.questionnaireScore < 25,
    stressPoints: 4,
    factorLabel: 'Questionnaire Responses',
    factorStatus: 'good',
  },
];
