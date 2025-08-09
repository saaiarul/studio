-- Create ENUM types only if they do not already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_status') THEN
        CREATE TYPE public.business_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_form_field_type') THEN
        CREATE TYPE public.review_form_field_type AS ENUM ('rating', 'comment');
    END IF;
END$$;


-- Create Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    reviews INTEGER DEFAULT 0 NOT NULL,
    avg_rating NUMERIC(3, 2) DEFAULT 0.00 NOT NULL,
    review_url TEXT,
    google_review_link TEXT,
    status public.business_status DEFAULT 'pending' NOT NULL,
    credits INTEGER DEFAULT 10 NOT NULL,
    logo_url TEXT,
    welcome_message TEXT,
    theme JSONB,
    review_form_fields JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    first_review_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create Feedback Table
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create Feedback Values Table
CREATE TABLE IF NOT EXISTS public.feedback_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID REFERENCES public.feedbacks(id) ON DELETE CASCADE NOT NULL,
    field_id TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_values ENABLE ROW LEVEL SECURITY;

-- Create Policies (these are safe to re-run)
-- WARNING: These policies allow public access. You should restrict these for production.
DROP POLICY IF EXISTS "Allow public read access on businesses" ON public.businesses;
CREATE POLICY "Allow public read access on businesses" ON public.businesses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on customers" ON public.customers;
CREATE POLICY "Allow public read access on customers" ON public.customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on feedbacks" ON public.feedbacks;
CREATE POLICY "Allow public read access on feedbacks" ON public.feedbacks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on feedback_values" ON public.feedback_values;
CREATE POLICY "Allow public read access on feedback_values" ON public.feedback_values FOR SELECT USING (true);

-- Allow admin full access. In a real app, you'd check against a user's role.
DROP POLICY IF EXISTS "Allow admin full access on businesses" ON public.businesses;
CREATE POLICY "Allow admin full access on businesses" ON public.businesses FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow admin full access on customers" ON public.customers;
CREATE POLICY "Allow admin full access on customers" ON public.customers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow admin full access on feedbacks" ON public.feedbacks;
CREATE POLICY "Allow admin full access on feedbacks" ON public.feedbacks FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow admin full access on feedback_values" ON public.feedback_values;
CREATE POLICY "Allow admin full access on feedback_values" ON public.feedback_values FOR ALL USING (true);
