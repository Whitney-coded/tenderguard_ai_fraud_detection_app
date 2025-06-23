/*
  # Create risk factors table for detailed risk assessment

  1. New Tables
    - `risk_factors`
      - `id` (uuid, primary key)
      - `analysis_result_id` (uuid, foreign key) - references analysis_results.id
      - `category` (text) - risk category name
      - `score` (integer) - risk score (0-100)
      - `status` (text) - pass, warning, fail
      - `details` (jsonb) - additional details
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `risk_factors` table
    - Add policy for users to access risk factors for their analysis results
*/

CREATE TABLE IF NOT EXISTS risk_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_result_id uuid NOT NULL REFERENCES analysis_results(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT '',
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  status text NOT NULL DEFAULT 'pass' CHECK (status IN ('pass', 'warning', 'fail')),
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE risk_factors ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can access risk factors for their analysis"
  ON risk_factors
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM analysis_results ar
      WHERE ar.id = risk_factors.analysis_result_id
      AND ar.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS risk_factors_analysis_result_id_idx ON risk_factors(analysis_result_id);
CREATE INDEX IF NOT EXISTS risk_factors_score_idx ON risk_factors(score);