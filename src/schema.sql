-- schema.sql

-- 1. Create ENUM types
CREATE TYPE public.business_status AS ENUM (
    'approved',
    'pending',
    'rejected'
);

CREATE TYPE public.form_field_type AS ENUM (
    'rating',
    'comment'
);

-- 2. Create Businesses Table
CREATE TABLE public.businesses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name character varying NOT NULL,
    owner_email character varying NOT NULL,
    password character varying,
    review_url character varying,
    google_review_link character varying,
    status business_status DEFAULT 'pending' NOT NULL,
    credits integer DEFAULT 0 NOT NULL,
    logo_url character varying,
    welcome_message text,
    theme jsonb,
    review_form_fields jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. Create Customers Table
CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    name character varying NOT NULL,
    phone character varying,
    email character varying,
    first_review_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 4. Create Feedback Table
CREATE TABLE public.feedback (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
    rating integer NOT NULL,
    comment text,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT rating_check CHECK ((rating >= 1) AND (rating <= 5))
);

-- 5. Create Feedback Values Table (for custom form fields)
CREATE TABLE public.feedback_values (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    feedback_id uuid REFERENCES public.feedback(id) ON DELETE CASCADE NOT NULL,
    field_id character varying NOT NULL,
    value text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_values ENABLE ROW LEVEL SECURITY;


-- 7. Create Policies for RLS
-- Businesses: Allow public read access, and authenticated users to manage their own business.
CREATE POLICY "Allow public read access on businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on businesses" ON public.businesses FOR ALL USING (true); -- Replace with proper ownership/role check

-- Customers: Allow related business owners to view their customers.
CREATE POLICY "Allow business owners to read their customers" ON public.customers FOR SELECT USING (true); -- Replace with role check logic
CREATE POLICY "Allow admin full access on customers" ON public.customers FOR ALL USING (true); -- Replace with proper ownership/role check


-- Feedback: Allow public submission, and business owners to view their feedback.
CREATE POLICY "Allow public read access on feedback" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert feedback" ON public.feedback FOR INSERT WITH CHECK (true); -- Adjust based on auth
CREATE POLICY "Allow admin full access on feedback" ON public.feedback FOR ALL USING (true); -- Replace with proper ownership/role check

-- Feedback Values: Similar permissions to feedback.
CREATE POLICY "Allow public read access on feedback_values" ON public.feedback_values FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on feedback_values" ON public.feedback_values FOR ALL USING (true); -- Replace with proper ownership/role check
