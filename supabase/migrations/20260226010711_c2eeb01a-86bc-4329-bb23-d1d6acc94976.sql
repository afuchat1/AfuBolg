
-- Allow admins to see ALL articles (not just their own)
DROP POLICY IF EXISTS "Authors can view own articles" ON public.articles;
CREATE POLICY "Authors and admins can view articles"
ON public.articles FOR SELECT
TO authenticated
USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- Allow admins to update ALL articles
DROP POLICY IF EXISTS "Authors can update own articles" ON public.articles;
CREATE POLICY "Authors and admins can update articles"
ON public.articles FOR UPDATE
TO authenticated
USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete ALL articles
DROP POLICY IF EXISTS "Authors can delete own articles" ON public.articles;
CREATE POLICY "Authors and admins can delete articles"
ON public.articles FOR DELETE
TO authenticated
USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));
