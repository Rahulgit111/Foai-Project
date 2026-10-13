/*
# Update Schema - Remove Camera Fields for Rule-Based AI

## Overview
Removes camera-related fields from the assessments table and simplifies the schema
for a pure rule-based expert system (no ML, no camera).

## Changes
1. Drop camera_used and camera_indicator columns from assessments
2. Drop lifestyle_score column (not used in rule-based system)
3. Add activated_rules jsonb column to store which IF-THEN rules fired
4. Add reasoning_summary text column for the AI reasoning explanation

## Security
- RLS policies unchanged (already owner-scoped)
*/

ALTER TABLE assessments DROP COLUMN IF EXISTS camera_used;
ALTER TABLE assessments DROP COLUMN IF EXISTS camera_indicator;
ALTER TABLE assessments DROP COLUMN IF EXISTS lifestyle_score;

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS activated_rules jsonb DEFAULT '[]';
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS reasoning_summary text DEFAULT '';
