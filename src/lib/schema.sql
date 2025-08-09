-- Drop existing tables and types if they exist, in reverse order of dependency
DROP TABLE IF EXISTS public.feedback_values;
DROP TABLE IF EXISTS public.feedbacks;
DROP TABLE IF EXISTS public.customers;
DROP TABLE IF EXISTS public.businesses;
DROP TYPE IF EXISTS public.business_status;
DROP TYPE IF EXISTS public.form_field_type;

-- Create ENUM types
CREATE TYPE public.business_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.form_field_type AS ENUM ('rating', 'comment');

-- Create businesses table
CREATE TABLE public.businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    reviews INTEGER DEFAULT 0 NOT NULL,
    avg_rating NUMERIC(2, 1) DEFAULT 0.0 NOT NULL,
    review_url TEXT NOT NULL,
    google_review_link TEXT,
    status public.business_status DEFAULT 'pending' NOT NULL,
    credits INTEGER DEFAULT 10 NOT NULL,
    logo_url TEXT,
    welcome_message TEXT DEFAULT 'Please leave a review!' NOT NULL,
    theme JSONB DEFAULT '{
        "primaryColor": "#4A90E2",
        "backgroundColor": "#F5F8FA",
        "textColor": "#333333",
        "buttonColor": "#50E3C2",
        "buttonTextColor": "#FFFFFF"
    }'::jsonb,
    review_form_fields JSONB DEFAULT '[
        {"id": "rating-1", "type": "rating", "label": "Overall Experience", "isOptional": false},
        {"id": "comment-1", "type": "comment", "label": "How can we improve?", "isOptional": true}
    ]'::jsonb
);

-- Create customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    first_review_date DATE NOT NULL
);

-- Create feedbacks table
CREATE TABLE public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date DATE NOT NULL
);

-- Create feedback_values table to store dynamic field values
CREATE TABLE public.feedback_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID NOT NULL REFERENCES public.feedbacks(id) ON DELETE CASCADE,
    field_id TEXT NOT NULL,
    value TEXT NOT NULL
);


-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_values ENABLE ROW LEVEL SECURITY;

-- Create Policies for public access (adjust as needed for your auth roles)
CREATE POLICY "Allow public read access on businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Allow public read access on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public read access on feedbacks" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Allow public read access on feedback_values" ON public.feedback_values FOR SELECT USING (true);

-- Create Policies for authenticated users or specific roles
-- These are examples and should be replaced with your actual authorization logic
CREATE POLICY "Allow admin full access on businesses" ON public.businesses FOR ALL USING (true); -- Replace with proper ownership/role check
CREATE POLICY "Allow admin full access on customers" ON public.customers FOR ALL USING (true); -- Replace with proper ownership/role check
CREATE POLICY "Allow admin full access on feedbacks" ON public.feedbacks FOR ALL USING (true); -- Replace with proper ownership/role check
CREATE POLICY "Allow admin full access on feedback_values" ON public.feedback_values FOR ALL USING (true); -- Replace with proper ownership/role check
