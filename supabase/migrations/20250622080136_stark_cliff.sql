/*
  # Create fraud indicators table for detailed findings

  1. New Tables
    - `fraud_indicators`
      - `id` (uuid, primary key)
      - `analysis_result_id` (uuid, foreign key) - references analysis_results.id
      - `category` (text) - type of fraud indicator
      - `severity` (text) - low, medium, high
      - `description` (text) - detailed description
      - `recommendation` (text) - suggested action
      - `confidence` (numeric) - confidence in this finding
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `fraud_indicators` table
    - Add policy for users to access indicators for their analysis results
*/

CREATE TABLE IF NOT EXISTS fraud_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_result_id uuid NOT NULL REFERENCES analysis_results(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high')),
  description text NOT NULL DEFAULT '',
  recommendation text NOT NULL DEFAULT '',
  confidence numeric(5,2) NOT NULL DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 100),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE fraud_indicators ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can access fraud indicators for their analysis"
  ON fraud_indicators
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM analysis_results ar
      WHERE ar.id = fraud_indicators.analysis_result_id
      AND ar.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS fraud_indicators_analysis_result_id_idx ON fraud_indicators(analysis_result_id);
CREATE INDEX IF NOT EXISTS fraud_indicators_severity_idx ON fraud_indicators(severity);