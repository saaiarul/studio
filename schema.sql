-- Create ENUM types if they don't exist
DO $$ BEGIN
    CREATE TYPE public.business_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.review_field_type AS ENUM ('rating', 'comment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- Create Businesses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.businesses (
    id character varying NOT NULL PRIMARY KEY,
    name character varying NOT NULL,
    owner_email character varying NOT NULL,
    password character varying,
    reviews integer DEFAULT 0 NOT NULL,
    avg_rating real DEFAULT 0 NOT NULL,
    review_url character varying,
    google_review_link character varying,
    status public.business_status DEFAULT 'pending' NOT NULL,
    credits integer DEFAULT 10 NOT NULL,
    logo_url character varying,
    welcome_message character varying,
    theme jsonb,
    review_form_fields jsonb
);

-- Create Customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_id character varying NOT NULL,
    name character varying NOT NULL,
    phone character varying,
    email character varying,
    first_review_date date NOT NULL,
    CONSTRAINT customers_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE
);

-- Create Feedbacks table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_id character varying NOT NULL,
    customer_id uuid NOT NULL,
    rating real NOT NULL,
    comment text,
    date date NOT NULL,
    CONSTRAINT feedback_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE,
    CONSTRAINT feedback_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE
);

-- Create Feedback_Values table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.feedback_values (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    feedback_id uuid NOT NULL,
    field_id character varying NOT NULL,
    value text NOT NULL,
    CONSTRAINT feedback_values_feedback_id_fkey FOREIGN KEY (feedback_id) REFERENCES public.feedbacks(id) ON DELETE CASCADE
);


-- RLS POLICIES
-- Make sure RLS is enabled for all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_values ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones to avoid errors on re-run
DROP POLICY IF EXISTS "Allow public read access on businesses" ON public.businesses;
DROP POLICY IF EXISTS "Allow admin full access on businesses" ON public.businesses;
DROP POLICY IF EXISTS "Allow public read access on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow individual customer access" ON public.customers;
DROP POLICY IF EXISTS "Allow admin full access on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public read access on feedback" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow individual feedback access" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow admin full access on feedback" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow public read access on feedback_values" ON public.feedback_values;
DROP POLICY IF EXISTS "Allow admin full access on feedback_values" ON public.feedback_values;

-- Create policies
CREATE POLICY "Allow public read access on businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on businesses" ON public.businesses FOR ALL USING (true); 

CREATE POLICY "Allow public read access on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow individual customer access" ON public.customers FOR ALL USING (true); 
CREATE POLICY "Allow admin full access on customers" ON public.customers FOR ALL USING (true); 

CREATE POLICY "Allow public read access on feedback" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Allow individual feedback access" ON public.feedbacks FOR ALL USING (true); 
CREATE POLICY "Allow admin full access on feedback" ON public.feedbacks FOR ALL USING (true);

CREATE POLICY "Allow public read access on feedback_values" ON public.feedback_values FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on feedback_values" ON public.feedback_values FOR ALL USING (true);
