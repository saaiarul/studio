
-- Drop existing tables and types with cascade to handle dependencies
DROP TABLE IF EXISTS public.feedback_values CASCADE;
DROP TABLE IF EXISTS public.review_form_fields CASCADE;
DROP TABLE IF EXISTS public.feedbacks CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TYPE IF EXISTS public.business_status CASCADE;
DROP TYPE IF EXISTS public.review_field_type CASCADE;

-- Create ENUM types
CREATE TYPE public.business_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.review_field_type AS ENUM ('rating', 'comment');

-- Create businesses table
CREATE TABLE public.businesses (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    owner_email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    status public.business_status DEFAULT 'pending' NOT NULL,
    credits INT DEFAULT 10 NOT NULL,
    reviews INT DEFAULT 0 NOT NULL,
    avg_rating FLOAT DEFAULT 0 NOT NULL,
    review_url TEXT,
    google_review_link TEXT,
    logo_url TEXT,
    welcome_message TEXT DEFAULT 'Welcome! Please leave us a review.',
    theme JSONB,
    review_form_fields JSONB
);

-- Create customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    first_review_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create review_form_fields table
CREATE TABLE public.review_form_fields (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    type public.review_field_type NOT NULL,
    label TEXT NOT NULL,
    is_optional BOOLEAN DEFAULT false NOT NULL,
    "order" INT NOT NULL
);

-- Create feedbacks table
CREATE TABLE public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create feedback_values table
CREATE TABLE public.feedback_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID NOT NULL REFERENCES public.feedbacks(id) ON DELETE CASCADE,
    field_id TEXT NOT NULL REFERENCES public.review_form_fields(id) ON DELETE CASCADE,
    value TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_values ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your auth)
-- These are permissive for a quick start. Replace with specific role-based access.
CREATE POLICY "Allow public read access on businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Allow individual insert access on businesses" ON public.businesses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow individual update access on businesses" ON public.businesses FOR UPDATE USING (true);
CREATE POLICY "Allow public read access on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow individual insert access on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on feedbacks" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Allow individual insert access on feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on review_form_fields" ON public.review_form_fields FOR SELECT USING (true);
CREATE POLICY "Allow public read access on feedback_values" ON public.feedback_values FOR SELECT USING (true);
CREATE POLICY "Allow individual insert access on feedback_values" ON public.feedback_values FOR INSERT WITH CHECK (true);

-- For admin/service roles, you might bypass RLS or create specific policies.
-- Example of a more restrictive policy (if you have user auth):
-- CREATE POLICY "Allow users to see their own customer entries" ON customers
-- FOR SELECT USING (auth.uid() = user_id);
