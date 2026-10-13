export type StressLevel = 'low' | 'moderate' | 'high';

export type FactorStatus = 'good' | 'moderate' | 'needs-attention';

export interface Profile {
  id: string;
  name: string;
  email: string;
  age: number | null;
  college: string | null;
  course: string | null;
  year: string | null;
  created_at: string;
}

export interface LifestyleData {
  age: string;
  college: string;
  course: string;
  year: string;
  sleepHours: string;
  studyHours: string;
  screenTime: string;
  exerciseFrequency: string;
  academicPressure: string;
}

export interface QuestionnaireResponse {
  id?: string;
  assessment_id?: string;
  questionId: number;
  question_id?: number;
  response: number;
  score: number;
}

export interface ContributingFactor {
  label: string;
  status: FactorStatus;
  detail: string;
}

export interface Recommendation {
  title: string;
  description: string;
  icon: string;
}

export interface ActivatedRule {
  id: string;
  category: string;
  condition: string;
  conclusion: string;
  stressPoints: number;
  factorLabel: string;
  factorStatus: FactorStatus;
}

export interface InferenceResult {
  stressScore: number;
  stressLevel: StressLevel;
  questionnaireScore: number;
  questionnaireMax: number;
  questionnairePercent: number;
  activatedRules: ActivatedRule[];
  contributingFactors: ContributingFactor[];
  recommendations: Recommendation[];
  reasoningSummary: string;
  facts: import('../ai/rules').RuleFacts;
}

export interface Assessment {
  id: string;
  user_id: string;
  stress_score: number;
  stress_level: StressLevel;
  questionnaire_score: number;
  contributing_factors: ContributingFactor[];
  recommendations: Recommendation[];
  activated_rules: ActivatedRule[];
  reasoning_summary: string;
  lifestyle_data: LifestyleData;
  created_at: string;
}

export interface AssessmentWithResponses extends Assessment {
  responses?: QuestionnaireResponse[];
}
