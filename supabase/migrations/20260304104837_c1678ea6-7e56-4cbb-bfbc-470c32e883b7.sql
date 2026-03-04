
-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Authors can upload article images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own images
CREATE POLICY "Authors can update own article images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own images
CREATE POLICY "Authors can delete own article images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'article-images');
