/*
  # Create analysis results table for fraud detection results

  1. New Tables
    - `analysis_results`
      - `id` (uuid, primary key)
      - `document_id` (uuid, foreign key) - references documents.id
      - `user_id` (uuid, foreign key) - references profiles.id
      - `overall_risk_score` (integer) - risk percentage (0-100)
      - `confidence_level` (numeric) - AI confidence percentage
      - `total_pages` (integer) - number of pages analyzed
      - `flagged_items` (integer) - number of issues found
      - `processing_time` (numeric) - analysis time in seconds
      - `analysis_data` (jsonb) - detailed analysis results
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `analysis_results` table
    - Add policy for users to access their own analysis results
*/

CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  overall_risk_score integer NOT NULL DEFAULT 0 CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  confidence_level numeric(5,2) NOT NULL DEFAULT 0.0 CHECK (confidence_level >= 0 AND confidence_level <= 100),
  total_pages integer NOT NULL DEFAULT 0,
  flagged_items integer NOT NULL DEFAULT 0,
  processing_time numeric(10,3) NOT NULL DEFAULT 0.0,
  analysis_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can access own analysis results"
  ON analysis_results
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER analysis_results_updated_at
  BEFORE UPDATE ON analysis_results
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS analysis_results_document_id_idx ON analysis_results(document_id);
CREATE INDEX IF NOT EXISTS analysis_results_user_id_idx ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS analysis_results_risk_score_idx ON analysis_results(overall_risk_score);