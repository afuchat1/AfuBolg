CREATE POLICY "Rate limits are backend-only"
  ON public.summary_rate_limits FOR ALL
  USING (false) WITH CHECK (false);