CREATE POLICY "Anyone can upload a customer logo"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'customer-logos');