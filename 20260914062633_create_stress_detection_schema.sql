/*
# Stress Detection AI - Database Schema

## Overview
Creates the complete database schema for an AI-based mental stress detection system for college students. Three tables store user profiles, stress assessments, and questionnaire responses.

## New Tables

### 1. profiles
- `id` (uuid, PK, references auth.users) — 1:1 with Supabase auth users
- `name` (text, not null) — full name
- `email` (text, not null) — email address
- `age` (int) — user age
- `college` (text) — institution name
- `course` (text) — field of study
- `year` (text) — year of study
- `created_at` (timestamptz) — record creation time

### 2. assessments
- `id` (uuid, PK) — auto-generated
- `user_id` (uuid, not null, defaults to auth.uid()) — owner reference
- `stress_score` (int, not null) — 0-100 estimated stress score
- `stress_level` (text, not null) — 'low' | 'moderate' | 'high'
- `questionnaire_score` (numeric) — normalized questionnaire score
- `lifestyle_score` (numeric) — normalized lifestyle score
- `camera_used` (boolean, default false) — whether camera analysis was used
- `camera_indicator` (text, nullable) — facial expression indicator text
- `lifestyle_data` (jsonb) — all lifestyle/academic input data
- `contributing_factors` (jsonb) — factor breakdown array
- `recommendations` (jsonb) — recommendation array
- `created_at` (timestamptz) — assessment date/time

### 3. questionnaire_responses
- `id` (uuid, PK) — auto-generated
- `assessment_id` (uuid, FK to assessments) — parent assessment
- `question_id` (int) — question number
- `response` (text) — Likert scale label
- `score` (int) — numeric score value

## Security
- RLS enabled on all three tables
- Owner-scoped CRUD: users can only access their own profiles and assessments
- Questionnaire responses scoped through parent assessment ownership check
- SECURITY DEFINER function for account deletion with caller verification
- No camera images/videos stored — only indicator text

## Important Notes
1. profiles.id = auth.users.id (1:1, ON DELETE CASCADE)
2. assessments.user_id defaults to auth.uid() so inserts work without explicit user_id
3. questionnaire_responses cascades with assessments deletion
4. Account deletion function removes all user data then auth account
*/

-- ============ PROFILES TABLE ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  age int,
  college text,
  course text,
  year text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============ ASSESSMENTS TABLE ============
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  stress_score int NOT NULL,
  stress_level text NOT NULL CHECK (stress_level IN ('low', 'moderate', 'high')),
  questionnaire_score numeric NOT NULL DEFAULT 0,
  lifestyle_score numeric NOT NULL DEFAULT 0,
  camera_used boolean NOT NULL DEFAULT false,
  camera_indicator text,
  lifestyle_data jsonb DEFAULT '{}',
  contributing_factors jsonb DEFAULT '[]',
  recommendations jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_assessments" ON assessments;
CREATE POLICY "select_own_assessments" ON assessments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_assessments" ON assessments;
CREATE POLICY "insert_own_assessments" ON assessments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_assessments" ON assessments;
CREATE POLICY "update_own_assessments" ON assessments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_assessments" ON assessments;
CREATE POLICY "delete_own_assessments" ON assessments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ QUESTIONNAIRE RESPONSES TABLE ============
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id int NOT NULL,
  response text NOT NULL,
  score int NOT NULL DEFAULT 0
);

ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_responses" ON questionnaire_responses;
CREATE POLICY "select_own_responses" ON questionnaire_responses FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM assessments WHERE assessments.id = questionnaire_responses.assessment_id AND assessments.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_responses" ON questionnaire_responses;
CREATE POLICY "insert_own_responses" ON questionnaire_responses FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM assessments WHERE assessments.id = questionnaire_responses.assessment_id AND assessments.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_responses" ON questionnaire_responses;
CREATE POLICY "delete_own_responses" ON questionnaire_responses FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM assessments WHERE assessments.id = questionnaire_responses.assessment_id AND assessments.user_id = auth.uid())
  );

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_assessment_id ON questionnaire_responses(assessment_id);

-- ============ ACCOUNT DELETION FUNCTION ============
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM questionnaire_responses
  WHERE assessment_id IN (SELECT id FROM assessments WHERE user_id = auth.uid());

  DELETE FROM assessments WHERE user_id = auth.uid();
  DELETE FROM profiles WHERE id = auth.uid();
END;
$$;

REVOKE EXECUTE ON FUNCTION delete_user_account FROM anon;
GRANT EXECUTE ON FUNCTION delete_user_account TO authenticated;