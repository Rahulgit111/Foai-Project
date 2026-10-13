// ============================================================
// KNOWLEDGE BASE — Facts and Rules about Stress Factors
// ============================================================
// The knowledge base stores domain knowledge about factors
// associated with perceived stress in college students.
// This is used by the Inference Engine to reason about
// user-provided facts.
// ============================================================

export interface KnowledgeEntry {
  domain: string;
  fact: string;
  rule: string;
  threshold: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    domain: 'Sleep',
    fact: 'Students sleeping less than 5 hours per day are likely to experience higher stress.',
    rule: 'IF sleep < 5 hours THEN sleep stress = HIGH',
    threshold: 'Less than 5 hours → HIGH | 5-6 hours → MODERATE | 6+ hours → LOW',
  },
  {
    domain: 'Study Time',
    fact: 'Studying more than 8 hours per day without breaks increases academic pressure.',
    rule: 'IF study time > 8 hours THEN study pressure = HIGH',
    threshold: '> 8 hours → HIGH | 6-8 hours → MODERATE | < 6 hours → LOW',
  },
  {
    domain: 'Screen Time',
    fact: 'Excessive recreational screen time (>6 hours) is associated with increased stress and reduced sleep quality.',
    rule: 'IF screen time > 6 hours THEN lifestyle stress = MODERATE',
    threshold: '> 6 hours → MODERATE | 4-6 hours → MODERATE | < 4 hours → LOW',
  },
  {
    domain: 'Exercise',
    fact: 'Lack of physical activity is associated with higher stress levels.',
    rule: 'IF exercise = Never THEN lifestyle stress = MODERATE',
    threshold: 'Never → MODERATE | Rarely → MODERATE | 1+ days/week → LOW',
  },
  {
    domain: 'Academic Pressure',
    fact: 'Students reporting high academic pressure tend to show elevated stress indicators.',
    rule: 'IF academic pressure = High THEN academic stress = HIGH',
    threshold: 'High → HIGH | Moderate → MODERATE | Low → LOW',
  },
  {
    domain: 'Questionnaire',
    fact: 'A high cumulative questionnaire score (10 questions, max 50) indicates elevated perceived stress.',
    rule: 'IF questionnaire score > 35 THEN questionnaire stress = HIGH',
    threshold: '> 35 → HIGH | 25-35 → MODERATE | < 25 → LOW',
  },
];

export const STRESS_CATEGORIES = {
  low: { label: 'LOW', min: 0, max: 33, color: '#4d8c6b' },
  moderate: { label: 'MODERATE', min: 34, max: 66, color: '#e0a536' },
  high: { label: 'HIGH', min: 67, max: 100, color: '#d96565' },
} as const;
