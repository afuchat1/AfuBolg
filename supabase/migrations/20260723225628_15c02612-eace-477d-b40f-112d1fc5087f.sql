
CREATE TABLE public.article_summaries (
  article_id uuid PRIMARY KEY REFERENCES public.articles(id) ON DELETE CASCADE,
  content_hash text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.article_summaries TO anon, authenticated;
GRANT ALL ON public.article_summaries TO service_role;
ALTER TABLE public.article_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Summaries are readable by everyone"
  ON public.article_summaries FOR SELECT
  USING (true);

CREATE TABLE public.summary_rate_limits (
  ip text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL DEFAULT 1,
  PRIMARY KEY (ip, window_start)
);
GRANT ALL ON public.summary_rate_limits TO service_role;
ALTER TABLE public.summary_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_summary_rate_limits_window ON public.summary_rate_limits(window_start);
