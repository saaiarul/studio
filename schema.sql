
-- Enable RLS for all tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM public;

-- USERS table (managed by Supabase Auth)
-- We will reference auth.users via public.users view
CREATE OR REPLACE VIEW public.users AS
SELECT id, email, created_at, last_sign_in_at
FROM auth.users;

-- BUSINESSES table
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    review_url TEXT,
    google_review_link TEXT,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
    credits INT DEFAULT 0 NOT NULL,
    logo_url TEXT,
    welcome_message TEXT,
    theme JSONB,
    review_form_fields JSONB
);
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access" ON businesses FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON businesses FOR ALL USING (true); -- Replace with proper admin role check


-- CUSTOMERS table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    first_review_date DATE NOT NULL
);
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin full access on customers" ON customers FOR ALL USING (true); -- Replace with proper ownership/role check

-- FEEDBACK table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    -- Denormalized fields for easier querying and display
    rating INT,
    comment TEXT
);
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access on feedback" ON feedback FOR ALL USING (true); -- Replace with proper ownership/role check


-- FEEDBACK_VALUES table to store individual form field answers
CREATE TABLE feedback_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    feedback_id UUID REFERENCES feedback(id) ON DELETE CASCADE NOT NULL,
    field_id TEXT NOT NULL, -- Corresponds to the ID in business.review_form_fields
    value_text TEXT,
    value_number NUMERIC
);
ALTER TABLE feedback_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON feedback_values FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access on feedback_values" FOR ALL USING (true); -- Replace with proper ownership/role check


-- Seed with some initial data to get started
INSERT INTO businesses (name, owner_email, status, credits, google_review_link, welcome_message, review_form_fields) VALUES
('The Happy Cafe', 'company@reviewroute.com', 'approved', 100, 'https://g.page/r/some-google-link/review', 'Thanks for visiting The Happy Cafe! We hope you enjoyed your time with us.', '[{"id": "rating-1", "type": "rating", "label": "How was your overall experience?", "isOptional": false}, {"id": "comment-1", "type": "comment", "label": "Tell us more (Optional)", "isOptional": true}]'),
('City Bookstore', 'book@example.com', 'approved', 50, 'https://www.google.com', 'Welcome to City Bookstore!', '[{"id": "rating-1", "type": "rating", "label": "How was your visit?", "isOptional": false}, {"id": "comment-1", "type": "comment", "label": "Any comments?", "isOptional": false}]');

UPDATE businesses SET review_url = '/review/' || id;
