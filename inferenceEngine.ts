import { RULES } from './rules';
import type { Rule, RuleFacts, FactorStatus } from './rules';
import { STRESS_CATEGORIES } from './knowledgeBase';
import { generateRecommendations } from './recommendations';
import type {
  LifestyleData,
  QuestionnaireResponse,
  StressLevel,
  ContributingFactor,
  Recommendation,
  InferenceResult,
  ActivatedRule,
} from '../lib/types';

// ============================================================
// INFERENCE ENGINE — Forward Chaining Rule Evaluator
// ============================================================
// This module implements the core AI reasoning:
//
// 1. Receive user-provided facts (questionnaire + lifestyle)
// 2. Build a fact base from the raw inputs
// 3. Evaluate each IF-THEN rule against the facts
// 4. Collect activated rules and their stress points
// 5. Aggregate points into a final stress score
// 6. Classify the stress level (LOW / MODERATE / HIGH)
// 7. Identify contributing factors
// 8. Generate rule-based recommendations
// 9. Build a human-readable reasoning trace
// 10. Return the complete inference result
//
// This is FORWARD CHAINING: we start with known facts
// and apply rules to derive new conclusions.
// ============================================================

function buildFacts(
  lifestyle: LifestyleData,
  responses: QuestionnaireResponse[],
): RuleFacts {
  const questionnaireScore = responses.reduce((sum, r) => sum + r.score, 0);
  const questionnairePercent = Math.round((questionnaireScore / 50) * 100);

  return {
    questionnaireScore,
    questionnairePercent,
    sleepHours: lifestyle.sleepHours,
    studyHours: lifestyle.studyHours,
    screenTime: lifestyle.screenTime,
    exerciseFrequency: lifestyle.exerciseFrequency,
    academicPressure: lifestyle.academicPressure,
  };
}

function classifyStress(score: number): StressLevel {
  if (score <= 33) return 'low';
  if (score <= 66) return 'moderate';
  return 'high';
}

function buildReasoningTrace(
  facts: RuleFacts,
  activatedRules: ActivatedRule[],
  stressLevel: StressLevel,
  stressScore: number,
): string {
  const lines: string[] = [];

  lines.push('User Input');
  lines.push('   ↓');
  lines.push(`Questionnaire Score = ${facts.questionnaireScore}/50 (${facts.questionnairePercent}%)`);
  lines.push(`Sleep = ${facts.sleepHours}`);
  lines.push(`Study Time = ${facts.studyHours}`);
  lines.push(`Screen Time = ${facts.screenTime}`);
  lines.push(`Exercise = ${facts.exerciseFrequency}`);
  lines.push(`Academic Pressure = ${facts.academicPressure}`);
  lines.push('   ↓');
  lines.push('Evaluating IF-THEN Rules (Forward Chaining)...');
  lines.push('   ↓');

  for (const rule of activatedRules) {
    lines.push(`Rule ${rule.id} Activated:`);
    lines.push(`  ${rule.condition}`);
    lines.push(`  → ${rule.conclusion}`);
    lines.push('   ↓');
  }

  lines.push(`Total Stress Points = ${stressScore}/100`);
  lines.push('   ↓');
  lines.push(`Estimated Stress Level = ${STRESS_CATEGORIES[stressLevel].label}`);

  return lines.join('\n');
}

function buildContributingFactors(
  activatedRules: ActivatedRule[],
  facts: RuleFacts,
): ContributingFactor[] {
  const factorMap = new Map<string, { status: FactorStatus; detail: string; points: number }>();

  for (const rule of activatedRules) {
    const existing = factorMap.get(rule.factorLabel);
    const points = rule.stressPoints;

    if (!existing || points > existing.points) {
      let detail = '';
      switch (rule.factorLabel) {
        case 'Sleep':
          detail = `${facts.sleepHours}`;
          break;
        case 'Study Hours':
          detail = `${facts.studyHours}`;
          break;
        case 'Screen Time':
          detail = `${facts.screenTime}`;
          break;
        case 'Exercise':
          detail = facts.exerciseFrequency;
          break;
        case 'Academic Workload':
          detail = `${facts.academicPressure} pressure`;
          break;
        case 'Questionnaire Responses':
          detail = `Score: ${facts.questionnaireScore}/50`;
          break;
      }
      factorMap.set(rule.factorLabel, { status: rule.factorStatus, detail, points });
    }
  }

  return Array.from(factorMap.entries()).map(([label, info]) => ({
    label,
    status: info.status,
    detail: info.detail,
  }));
}

export function runInference(
  lifestyle: LifestyleData,
  responses: QuestionnaireResponse[],
): InferenceResult {
  // Step 1: Build the fact base from user inputs
  const facts = buildFacts(lifestyle, responses);

  // Step 2: Forward chaining — evaluate each rule against the facts
  const activatedRules: ActivatedRule[] = [];

  for (const rule of RULES) {
    if (rule.test(facts)) {
      activatedRules.push({
        id: rule.id,
        category: rule.category,
        condition: rule.condition,
        conclusion: rule.conclusion,
        stressPoints: rule.stressPoints,
        factorLabel: rule.factorLabel,
        factorStatus: rule.factorStatus,
      });
    }
  }

  // Step 3: Aggregate stress points
  // Only one rule per category should fire (they are mutually exclusive by design)
  const totalPoints = activatedRules.reduce((sum, r) => sum + r.stressPoints, 0);

  // Step 4: Normalize to 0-100 scale
  // Max possible: R01(18) + R04(14) + R08(12) + R11(10) + R14(16) + R17(20) = 90
  // We scale to 100
  const maxPossible = 90;
  let stressScore = Math.round((totalPoints / maxPossible) * 100);
  stressScore = Math.max(0, Math.min(100, stressScore));

  // Step 5: Classify stress level
  const stressLevel = classifyStress(stressScore);

  // Step 6: Build contributing factors
  const contributingFactors = buildContributingFactors(activatedRules, facts);

  // Step 7: Generate recommendations
  const recommendations = generateRecommendations(facts, contributingFactors, stressLevel);

  // Step 8: Build reasoning trace
  const reasoningSummary = buildReasoningTrace(facts, activatedRules, stressLevel, stressScore);

  return {
    stressScore,
    stressLevel,
    questionnaireScore: facts.questionnaireScore,
    questionnaireMax: 50,
    questionnairePercent: facts.questionnairePercent,
    activatedRules,
    contributingFactors,
    recommendations,
    reasoningSummary,
    facts,
  };
}
