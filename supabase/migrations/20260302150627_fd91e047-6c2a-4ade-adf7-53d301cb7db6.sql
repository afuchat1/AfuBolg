
-- Add slug column to articles
ALTER TABLE public.articles ADD COLUMN slug text UNIQUE;

-- Create index for slug lookups
CREATE INDEX idx_articles_slug ON public.articles(slug);

-- Generate slugs for existing articles
UPDATE public.articles SET slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '''', ''), '"', ''), '?', ''), '!', '')) || '-' || LEFT(id::text, 8);

-- Make slug NOT NULL after populating
ALTER TABLE public.articles ALTER COLUMN slug SET NOT NULL;

-- Create function to auto-generate slug on insert
CREATE OR REPLACE FUNCTION public.generate_article_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter int := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  IF base_slug = '' THEN
    base_slug := 'untitled';
  END IF;
  final_slug := base_slug;
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.articles WHERE slug = final_slug AND id != NEW.id);
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for auto slug generation
CREATE TRIGGER generate_slug_before_insert
BEFORE INSERT ON public.articles
FOR EACH ROW
WHEN (NEW.slug IS NULL)
EXECUTE FUNCTION public.generate_article_slug();

-- Also generate slug on update if title changes
CREATE TRIGGER generate_slug_before_update
BEFORE UPDATE ON public.articles
FOR EACH ROW
WHEN (NEW.title IS DISTINCT FROM OLD.title AND NEW.slug = OLD.slug)
EXECUTE FUNCTION public.generate_article_slug();
