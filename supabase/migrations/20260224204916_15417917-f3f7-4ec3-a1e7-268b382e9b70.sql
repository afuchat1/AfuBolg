
-- Make author_id nullable so we can have system/editorial articles
ALTER TABLE public.articles ALTER COLUMN author_id DROP NOT NULL;

-- Update RLS to also allow reading articles with null author_id
DROP POLICY IF EXISTS "Authors can view own articles" ON public.articles;
CREATE POLICY "Authors can view own articles" ON public.articles FOR SELECT USING (auth.uid() = author_id);
