-- Drop existing objects in reverse order of dependency, using CASCADE to handle dependencies.
DROP TABLE IF EXISTS public.feedback_values CASCADE;
DROP TABLE IF EXISTS public.feedbacks CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TYPE IF EXISTS public.business_status CASCADE;

-- Create ENUM type for business status
CREATE TYPE public.business_status AS ENUM ('pending', 'approved', 'rejected');

-- Create businesses table
CREATE TABLE public.businesses (
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    owner_email text NOT NULL UNIQUE,
    password text NOT NULL,
    reviews integer DEFAULT 0 NOT NULL,
    avg_rating real DEFAULT 0 NOT NULL,
    review_url text,
    google_review_link text,
    status public.business_status DEFAULT 'pending' NOT NULL,
    credits integer DEFAULT 10 NOT NULL,
    logo_url text,
    welcome_message text,
    theme jsonb,
    review_form_fields jsonb
);

-- Create customers table
CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_id text NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name text NOT NULL,
    phone text,
    email text,
    first_review_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create feedbacks table
CREATE TABLE public.feedbacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_id text NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    rating integer NOT NULL,
    comment text,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create feedback_values table to store dynamic field data
CREATE TABLE public.feedback_values (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    feedback_id uuid NOT NULL REFERENCES public.feedbacks(id) ON DELETE CASCADE,
    field_id text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_values ENABLE ROW LEVEL SECURITY;

-- Define Policies for `businesses` table
CREATE POLICY "Allow public read-only access to businesses" ON public.businesses
FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access for new business applications" ON public.businesses
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin users to update businesses" ON public.businesses
FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Define Policies for `customers` table
CREATE POLICY "Allow public read-only access to customers" ON public.customers
FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access to customers" ON public.customers
FOR INSERT WITH CHECK (true);

-- Define Policies for `feedbacks` table
CREATE POLICY "Allow public read-only access to feedbacks" ON public.feedbacks
FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access to feedbacks" ON public.feedbacks
FOR INSERT WITH CHECK (true);

-- Define Policies for `feedback_values` table
CREATE POLICY "Allow public read-only access to feedback values" ON public.feedback_values
FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access to feedback values" ON public.feedback_values
FOR INSERT WITH CHECK (true);

-- Create a default business for testing purposes
INSERT INTO public.businesses (id, name, owner_email, password, status, google_review_link, welcome_message, review_form_fields, theme)
VALUES 
('comp-123', 'Innovate Inc.', 'company@reviewroute.com', 'password', 'approved', 'https://www.google.com', 'Leave a review for Innovate Inc.', '[{"id": "rating-1", "type": "rating", "label": "How would you rate our service?", "isOptional": false}, {"id": "comment-1", "type": "comment", "label": "Any additional comments?", "isOptional": true}]', '{"primaryColor": "#64B5F6", "backgroundColor": "#F5F5F5", "textColor": "#333333", "buttonColor": "#26A69A", "buttonTextColor": "#FFFFFF"}')
ON CONFLICT (id) DO NOTHING;
