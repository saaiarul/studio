

import { format } from 'date-fns';
import { supabase } from './supabaseClient';

export type BusinessStatus = 'approved' | 'pending' | 'rejected';

export type ReviewPageTheme = {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
};

export type ReviewFormField = {
    id: string;
    type: 'rating' | 'comment';
    label: string;
    isOptional: boolean;
};

export type Business = {
    id:string;
    name: string;
    ownerEmail: string;
    password?: string;
    reviews: number;
    avgRating: number;
    reviewUrl: string;
    googleReviewLink: string;
    status: BusinessStatus;
    credits: number;
    logoUrl?: string;
    welcomeMessage?: string;
    theme?: ReviewPageTheme;
    reviewFormFields?: ReviewFormField[];
};

export type FeedbackValue = {
    fieldId: string;
    value: number | string;
};

export type Feedback = {
    id: string;
    businessId: string;
    customerId: string;
    values: FeedbackValue[];
    comment: string; 
    rating: number; 
    date: string;
};

export type Customer = {
    id: string;
    businessId: string;
    name: string;
    phone?: string;
    email?: string;
    firstReviewDate: string;
};


export async function getBusinesses(): Promise<Business[]> {
    const { data, error } = await supabase.from('businesses').select('*');
    if (error) {
        console.error("Error fetching businesses:", error);
        throw error;
    }

    // The data from supabase needs to be mapped to our Business type.
    // Supabase returns snake_case, so we need to convert to camelCase.
    return data.map(b => ({
        id: b.id,
        name: b.name,
        ownerEmail: b.owner_email,
        reviews: b.reviews,
        avgRating: b.avg_rating,
        reviewUrl: b.review_url,
        googleReviewLink: b.google_review_link,
        status: b.status,
        credits: b.credits,
        logoUrl: b.logo_url,
        welcomeMessage: b.welcome_message,
        theme: b.theme,
        reviewFormFields: b.review_form_fields,
        password: b.password,
    }));
}

export async function getBusinessById(id: string): Promise<Business | null> {
    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching business by id ${id}:`, error);
        if (error.code === 'PGRST116') return null; // PostgREST error for no rows found
        throw error;
    }
    if (!data) return null;

    return {
        id: data.id,
        name: data.name,
        ownerEmail: data.owner_email,
        reviews: data.reviews,
        avgRating: data.avg_rating,
        reviewUrl: data.review_url,
        googleReviewLink: data.google_review_link,
        status: data.status,
        credits: data.credits,
        logoUrl: data.logo_url,
        welcomeMessage: data.welcome_message,
        theme: data.theme,
        reviewFormFields: data.review_form_fields,
        password: data.password,
    };
}

export async function createBusiness(data: { businessName: string, ownerEmail: string }): Promise<Business> {
    const newId = `comp-${Date.now()}`;
    const reviewUrl = `https://reviewdeep.vercel.app/review/${newId}`;
    const { data: newBusinessData, error } = await supabase
        .from('businesses')
        .insert({
            id: newId,
            name: data.businessName,
            owner_email: data.ownerEmail,
            password: `password-${Math.random().toString(36).substring(2, 10)}`,
            review_url: reviewUrl,
            google_review_link: '',
            welcome_message: `Leave a review for ${data.businessName}`
        })
        .select()
        .single();
    
    if (error) {
        console.error("Error creating business:", error);
        throw error;
    }

    return {
        id: newBusinessData.id,
        name: newBusinessData.name,
        ownerEmail: newBusinessData.owner_email,
        reviews: newBusinessData.reviews,
        avgRating: newBusinessData.avg_rating,
        reviewUrl: newBusinessData.review_url,
        googleReviewLink: newBusinessData.google_review_link,
        status: newBusinessData.status,
        credits: newBusinessData.credits,
        password: newBusinessData.password,
    };
}


export async function updateBusiness(id: string, data: Partial<Omit<Business, 'id'>>): Promise<Business | null> {
    // Convert camelCase to snake_case for Supabase
    const updateData: {[key: string]: any} = {};
    if (data.name) updateData.name = data.name;
    if (data.ownerEmail) updateData.owner_email = data.ownerEmail;
    if (data.password) updateData.password = data.password;
    if (data.status) updateData.status = data.status;
    if (data.credits !== undefined) updateData.credits = data.credits;
    if (data.logoUrl) updateData.logo_url = data.logoUrl;
    if (data.welcomeMessage) updateData.welcome_message = data.welcomeMessage;
    if (data.theme) updateData.theme = data.theme;
    if (data.reviewFormFields) updateData.review_form_fields = data.reviewFormFields;
    if (data.googleReviewLink) updateData.google_review_link = data.googleReviewLink;


    const { data: updatedBusinessData, error } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error("Error updating business:", error);
        throw error;
    }

    return {
        id: updatedBusinessData.id,
        name: updatedBusinessData.name,
        ownerEmail: updatedBusinessData.owner_email,
        reviews: updatedBusinessData.reviews,
        avgRating: updatedBusinessData.avg_rating,
        reviewUrl: updatedBusinessData.review_url,
        googleReviewLink: updatedBusinessData.google_review_link,
        status: updatedBusinessData.status,
        credits: updatedBusinessData.credits,
        logoUrl: updatedBusinessData.logo_url,
        welcomeMessage: updatedBusinessData.welcome_message,
        theme: updatedBusinessData.theme,
        reviewFormFields: updatedBusinessData.review_form_fields,
        password: updatedBusinessData.password
    };
}

export async function getFeedbackByBusinessId(businessId: string): Promise<Pick<Feedback, 'id'|'rating'|'comment'|'date'>[]> {
    const { data: feedbacks, error } = await supabase
        .from('feedbacks')
        .select(`
            id,
            rating,
            comment,
            date,
            customers ( name )
        `)
        .eq('business_id', businessId);

    if (error) {
        console.error("Error fetching feedback:", error);
        throw error;
    }

    return feedbacks.map((f: any) => ({
        id: f.id,
        rating: f.rating,
        comment: `${f.customers?.name || 'Anonymous'}: ${f.comment}`,
        date: f.date
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getFeedbackByBusinessIdWithFullData(businessId: string): Promise<Feedback[]> {
    const { data, error } = await supabase
        .from('feedbacks')
        .select('*, feedback_values(*)')
        .eq('business_id', businessId);
    
    if (error) {
        console.error("Error fetching full feedback data:", error);
        throw error;
    }
    return data.map(f => ({
        id: f.id,
        businessId: f.business_id,
        customerId: f.customer_id,
        values: f.feedback_values.map((fv: any) => ({fieldId: fv.field_id, value: fv.value})),
        comment: f.comment,
        rating: f.rating,
        date: f.date,
    }));
}


export async function getCustomersByBusinessId(businessId: string): Promise<Customer[]> {
     const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', businessId)
        .order('first_review_date', { ascending: false });

    if (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
    
    return data.map(c => ({
        id: c.id,
        businessId: c.business_id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        firstReviewDate: c.first_review_date
    }));
}

export async function addCustomer(businessId: string, data: { name: string, phone?: string, email?: string }): Promise<Customer> {
    const { data: newCustomerData, error } = await supabase
        .from('customers')
        .insert({
            business_id: businessId,
            name: data.name,
            phone: data.phone,
            email: data.email,
            first_review_date: format(new Date(), 'yyyy-MM-dd')
        })
        .select()
        .single();
    
    if (error) {
        console.error("Error adding customer:", error);
        throw error;
    }

    return {
        id: newCustomerData.id,
        businessId: newCustomerData.business_id,
        name: newCustomerData.name,
        phone: newCustomerData.phone,
        email: newCustomerData.email,
        firstReviewDate: newCustomerData.first_review_date
    };
}

export async function addFeedback(businessId: string, data: { feedbackValues: FeedbackValue[], customerName: string }): Promise<Feedback> {
    const business = await getBusinessById(businessId);
    if (!business) {
        throw new Error("Business not found");
    }

    // Find or create customer
    let { data: customer } = await supabase.from('customers').select('id').eq('name', data.customerName).eq('business_id', businessId).single();
    if (!customer) {
        const newCustomer = await addCustomer(businessId, { name: data.customerName });
        customer = { id: newCustomer.id };
    }
    const customerId = customer!.id;
    
    const primaryRatingField = business.reviewFormFields?.find(f => f.type === 'rating');
    const primaryCommentField = business.reviewFormFields?.find(f => f.type === 'comment');
    const primaryRatingValue = data.feedbackValues.find(v => v.fieldId === primaryRatingField?.id)?.value as number || 0;
    const primaryCommentValue = data.feedbackValues.find(v => v.fieldId === primaryCommentField?.id)?.value as string || '';

    // Add new feedback
    const { data: newFeedbackData, error: feedbackError } = await supabase
        .from('feedbacks')
        .insert({
            business_id: businessId,
            customer_id: customerId,
            rating: primaryRatingValue,
            comment: primaryCommentValue,
            date: format(new Date(), 'yyyy-MM-dd')
        })
        .select()
        .single();

    if (feedbackError) {
        console.error("Error adding feedback:", feedbackError);
        throw feedbackError;
    }

    // Add feedback values
    const feedbackValuesToInsert = data.feedbackValues.map(fv => ({
        feedback_id: newFeedbackData.id,
        field_id: fv.fieldId,
        value: fv.value.toString() // Ensure value is a string for Supabase
    }));

    const { error: valuesError } = await supabase.from('feedback_values').insert(feedbackValuesToInsert);

    if (valuesError) {
        console.error("Error adding feedback values:", valuesError);
        // you might want to delete the feedback record here
        throw valuesError;
    }
    
    // Update business stats
    const { data: allFeedbacksForBusiness, error: statsError } = await supabase
        .from('feedbacks')
        .select('rating')
        .eq('business_id', businessId);
    
    if (statsError) {
        console.error("Error fetching feedbacks for stats update", statsError);
        throw statsError;
    }

    const totalRating = allFeedbacksForBusiness.reduce((acc, f) => acc + f.rating, 0);
    const avgRating = totalRating / allFeedbacksForBusiness.length;
    const reviews = allFeedbacksForBusiness.filter(f => f.rating < 4).length;

    await supabase.from('businesses').update({ avg_rating: avgRating, reviews: reviews }).eq('id', businessId);

    const resultFeedback: Feedback = { 
        id: newFeedbackData.id,
        businessId: newFeedbackData.business_id, 
        customerId: newFeedbackData.customer_id, 
        values: data.feedbackValues,
        comment: newFeedbackData.comment,
        rating: newFeedbackData.rating,
        date: newFeedbackData.date,
    };
    return resultFeedback;
}
