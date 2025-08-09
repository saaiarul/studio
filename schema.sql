
-- Enable RLS for all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_values ENABLE ROW LEVEL SECURITY;

-- Grant all permissions to the service_role
GRANT ALL ON TABLE public.businesses TO service_role;
GRANT ALL ON TABLE public.customers TO service_role;
GRANT ALL ON TABLE public.feedback TO service_role;
GRANT ALL ON TABLE public.feedback_values TO service_role;

-- Grant usage on sequences for service_role
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;


-- Policies for 'businesses' table
DROP POLICY IF EXISTS "Allow anon read access on businesses" ON public.businesses;
CREATE POLICY "Allow anon read access on businesses" ON public.businesses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service_role all access on businesses" ON public.businesses;
CREATE POLICY "Allow service_role all access on businesses" ON public.businesses FOR ALL TO service_role USING (true);


-- Policies for 'customers' table
DROP POLICY IF EXISTS "Allow anon read access on customers" ON public.customers;
CREATE POLICY "Allow anon read access on customers" ON public.customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service_role all access on customers" ON public.customers;
CREATE POLICY "Allow service_role all access on customers" ON public.customers FOR ALL TO service_role USING (true);


-- Policies for 'feedback' table
DROP POLICY IF EXISTS "Allow anon read access on feedback" ON public.feedback;
CREATE POLICY "Allow anon read access on feedback" ON public.feedback FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert access on feedback" ON public.feedback;
CREATE POLICY "Allow anon insert access on feedback" ON public.feedback FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role all access on feedback" ON public.feedback;
CREATE POLICY "Allow service_role all access on feedback" ON public.feedback FOR ALL TO service_role USING (true);

-- Policies for 'feedback_values' table
DROP POLICY IF EXISTS "Allow anon read access on feedback_values" ON public.feedback_values;
CREATE POLICY "Allow anon read access on feedback_values" ON public.feedback_values FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert access on feedback_values" ON public.feedback_values;
CREATE POLICY "Allow anon insert access on feedback_values" ON public.feedback_values FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role all access on feedback_values" ON public.feedback_values;
CREATE POLICY "Allow service_role all access on feedback_values" ON public.feedback_values FOR ALL TO service_role USING (true);
