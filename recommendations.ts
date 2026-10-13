import type { RuleFacts, FactorStatus } from './rules';
import type { Recommendation, ContributingFactor, StressLevel } from '../lib/types';

// ============================================================
// RECOMMENDATION ENGINE — Rule-Based Suggestions
// ============================================================
// Generates recommendations using IF-THEN rules based on
// the same facts the inference engine used.
// ============================================================

export function generateRecommendations(
  facts: RuleFacts,
  factors: ContributingFactor[],
  stressLevel: StressLevel,
): Recommendation[] {
  const recs: Recommendation[] = [];

  // IF sleep < 5 hours THEN recommend improving sleep
  if (facts.sleepHours === 'Less than 4 hours' || facts.sleepHours === '4-5 hours') {
    recs.push({
      title: 'Improve Sleep',
      description: 'Try to maintain a regular sleep schedule of 7-8 hours. Avoid screens before bedtime and create a calming nighttime routine.',
      icon: 'moon',
    });
  }

  // IF study time > 8 hours THEN recommend study breaks
  if (facts.studyHours === 'More than 8 hours') {
    recs.push({
      title: 'Study Breaks',
      description: 'Break large academic tasks into smaller goals. Use the Pomodoro technique — study for 25 minutes, then take a 5-minute break.',
      icon: 'book-open',
    });
  }

  // IF screen time > 6 hours THEN recommend reducing screen time
  if (facts.screenTime === '6-8 hours' || facts.screenTime === 'More than 8 hours') {
    recs.push({
      title: 'Reduce Screen Time',
      description: 'Consider reducing recreational screen time. Set app limits and take regular screen breaks to improve sleep quality.',
      icon: 'monitor',
    });
  }

  // IF exercise = Never or Rarely THEN recommend physical activity
  if (facts.exerciseFrequency === 'Never' || facts.exerciseFrequency === 'Rarely') {
    recs.push({
      title: 'Physical Activity',
      description: 'Consider adding regular physical activity to your routine. Even a 20-minute daily walk can significantly reduce stress levels.',
      icon: 'activity',
    });
  }

  // IF academic pressure = High THEN recommend workload management
  if (facts.academicPressure === 'High') {
    recs.push({
      title: 'Manage Workload',
      description: 'Break large academic tasks into smaller, manageable goals. Prioritize assignments and consider talking to your advisor.',
      icon: 'clipboard-list',
    });
  }

  // IF questionnaire stress = HIGH THEN recommend talking to someone
  if (facts.questionnaireScore > 35) {
    recs.push({
      title: 'Talk to Someone',
      description: 'Consider talking to someone you trust about your current workload and stress. A campus counselor or trusted friend can help.',
      icon: 'users',
    });
  }

  // IF stress level = HIGH THEN recommend professional support
  if (stressLevel === 'high') {
    recs.push({
      title: 'Seek Support',
      description: 'Your stress level appears high. Consider speaking with a campus counselor, a trusted faculty member, or a mental health professional.',
      icon: 'heart',
    });
  }

  // IF all factors are good THEN maintain routine
  if (recs.length === 0) {
    recs.push({
      title: 'Maintain Your Routine',
      description: 'Your lifestyle patterns look balanced. Continue maintaining your healthy habits and check in regularly with how you are feeling.',
      icon: 'check-circle',
    });
  }

  return recs;
}
