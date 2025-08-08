

// In a real app, this data would be fetched from a database.
// We're using a static list here for demonstration purposes.

import { format, subDays } from 'date-fns';

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
    comment: string; // Keep a primary comment for display
    rating: number; // Keep a primary rating for display
    date: string;
};

type Customer = {
    id: string;
    businessId: string;
    name: string;
    phone?: string;
    email?: string;
    firstReviewDate: string;
};


let businesses: Business[] = [
    { 
        id: 'comp-123', 
        name: 'The Happy Cafe', 
        ownerEmail: 'company@reviewroute.com', 
        password: 'password',
        reviews: 0, 
        avgRating: 0, 
        reviewUrl: 'http://localhost:3000/review/comp-123',
        googleReviewLink: 'https://g.page/r/some-google-link/review',
        status: 'approved',
        credits: 100,
        logoUrl: 'https://placehold.co/100x100/A67B5B/FFFFFF/png',
        welcomeMessage: 'Thanks for visiting The Happy Cafe! We hope you enjoyed your time with us.',
        theme: {
            primaryColor: '#4A90E2', // A friendly blue
            backgroundColor: '#F5F8FA',
            textColor: '#333333',
            buttonColor: '#50E3C2', // A vibrant teal
            buttonTextColor: '#FFFFFF',
        },
        reviewFormFields: [
            { id: 'rating-1', type: 'rating', label: 'How was your overall experience?', isOptional: false },
            { id: 'comment-1', type: 'comment', label: 'Tell us more (Optional)', isOptional: true },
        ],
    },
    { 
        id: 'comp-456', 
        name: 'City Bookstore', 
        ownerEmail: 'book@example.com', 
        password: 'password',
        reviews: 0, 
        avgRating: 0, 
        reviewUrl: 'http://localhost:3000/review/comp-456',
        googleReviewLink: 'https://www.google.com',
        status: 'approved',
        credits: 50,
        reviewFormFields: [
            { id: 'rating-1', type: 'rating', label: 'How was your visit?', isOptional: false },
            { id: 'comment-1', type: 'comment', label: 'Any comments?', isOptional: false },
        ]
    },
    { 
        id: 'comp-789', 
        name: 'Tech Gadgets Inc.', 
        ownerEmail: 'gadget@example.com', 
        password: 'password',
        reviews: 0, 
        avgRating: 0, 
        reviewUrl: 'http://localhost:3000/review/comp-789',
        googleReviewLink: 'https://www.google.com',
        status: 'pending',
        credits: 0,
        reviewFormFields: [
            { id: 'rating-1', type: 'rating', label: 'Rate your purchase', isOptional: false },
            { id: 'comment-1', type: 'comment', label: 'Feedback', isOptional: true },
        ]
    },
];

let feedbacks: Feedback[] = [];
let customers: Customer[] = [];

// Function to generate and reset mock data
const generateMockData = () => {
    // Reset data, but keep statuses and credits for demo purposes
    const businessBase = businesses.map(b => ({ ...b, reviews: 0, avgRating: 0 }));
    businesses = businessBase;
    feedbacks = [];
    customers = [];

    const mockComments = [
        "The service was incredibly slow, and the food was cold. Very disappointed.",
        "Not what I was expecting. The atmosphere was lacking, and the staff seemed uninterested.",
        "It was okay, but nothing special. Probably wouldn't come back.",
        "A decent experience, but there's room for improvement in the menu.",
        "Loved the ambiance and the food was delicious! Will definitely be back.",
        "Fantastic service and amazing quality. Five stars all the way!",
        "The staff was so friendly and helpful. Made our day!",
        "Absolutely a top-notch experience from start to finish."
    ];
    
    const mockNames = ["Alex Johnson", "Maria Garcia", "Chen Wei", "Fatima Al-Fassi", "David Smith"];

    businesses.forEach(business => {
        let totalRating = 0;
        let reviewCount = 0;
        for (let i = 0; i < 25; i++) {
            const rating = Math.floor(Math.random() * 5) + 1; // 1 to 5
            const date = format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd');
            const customerId = `cust-${business.id}-${i}`;
            
            const newCustomer: Customer = {
                id: customerId,
                businessId: business.id,
                name: mockNames[Math.floor(Math.random() * mockNames.length)],
                phone: `555-01${String(i).padStart(2, '0')}`,
                email: `customer${i}@example.com`,
                firstReviewDate: date
            }
            customers.push(newCustomer);

            const newFeedback: Feedback = {
                id: `fb-${business.id}-${i}`,
                businessId: business.id,
                customerId: customerId,
                rating,
                comment: mockComments[Math.floor(Math.random() * mockComments.length)],
                values: [{ fieldId: business.reviewFormFields?.[0].id || 'rating-1', value: rating }],
                date: date
            };

            feedbacks.push(newFeedback);

            if (rating < 4) {
                totalRating += rating;
                reviewCount++;
            }
        }

        if (reviewCount > 0) {
            business.reviews = reviewCount;
            business.avgRating = totalRating / reviewCount;
        }
    });
};

// Initial generation
generateMockData();


export async function getBusinesses(): Promise<Business[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return businesses;
}

export async function getBusinessById(id: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const business = businesses.find(b => b.id === id) || null;
    // Add default form fields if they don't exist
    if (business && !business.reviewFormFields) {
        business.reviewFormFields = [
            { id: 'rating-1', type: 'rating', label: 'How was your experience?', isOptional: false },
            { id: 'comment-1', type: 'comment', label: 'Any comments?', isOptional: true },
        ];
    }
    return business;
}

export async function createBusiness(data: { businessName: string, ownerEmail: string }): Promise<Business> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newId = `comp-${Date.now()}`;
    const newBusiness: Business = {
        id: newId,
        name: data.businessName,
        ownerEmail: data.ownerEmail,
        password: `password-${Math.random().toString(36).substring(2, 10)}`, // Generate random password
        reviews: 0,
        avgRating: 0,
        reviewUrl: `http://localhost:3000/review/${newId}`,
        googleReviewLink: '',
        status: 'pending',
        credits: 0,
        reviewFormFields: [
            { id: 'rating-1', type: 'rating', label: 'How was your experience?', isOptional: false },
            { id: 'comment-1', type: 'comment', label: 'Any comments?', isOptional: true },
        ],
    };
    businesses.push(newBusiness);
    return newBusiness;
}


export async function updateBusiness(id: string, data: Partial<Omit<Business, 'id'>>) {
    // Simulate network delay and update
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = businesses.findIndex(b => b.id === id);
    if (index !== -1) {
        businesses[index] = { ...businesses[index], ...data };
        return businesses[index];
    }
    return null;
}

export async function getFeedbackByBusinessId(businessId: string): Promise<Pick<Feedback, 'id'|'rating'|'comment'|'date'>[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const businessFeedback = feedbacks.filter(f => f.businessId === businessId);
    
    const feedbackWithCustomer = businessFeedback.map(f => {
        const customer = customers.find(c => c.id === f.customerId);
        return {
            id: f.id,
            rating: f.rating,
            // For the table, we'll still show the primary comment.
            comment: `${customer?.name || 'Anonymous'}: ${f.comment}`,
            date: f.date
        }
    })

    return feedbackWithCustomer.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getCustomersByBusinessId(businessId: string): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return customers.filter(c => c.businessId === businessId).sort((a, b) => new Date(b.firstReviewDate).getTime() - new Date(a.firstReviewDate).getTime());
}

export async function addCustomer(businessId: string, data: { name: string, phone?: string, email?: string }): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // In a real app, you'd check if a customer with this phone/email already exists.
    const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        businessId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        firstReviewDate: format(new Date(), 'yyyy-MM-dd')
    };
    customers.push(newCustomer);
    return newCustomer;
}

export async function addFeedback(businessId: string, data: { feedbackValues: FeedbackValue[], customerName: string }): Promise<Feedback> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const business = businesses.find(b => b.id === businessId);
    if (!business) {
        throw new Error("Business not found");
    }

    const customer = customers.find(c => c.name === data.customerName && c.businessId === businessId);
    if (!customer) {
        // For simplicity, we create a customer if they don't exist.
        // In a real app, this might be handled differently.
        const newCustomer = await addCustomer(businessId, { name: data.customerName });
        customers.push(newCustomer);
    }

    const customerId = customers.find(c => c.name === data.customerName && c.businessId === businessId)!.id;

    // For dashboard display, we'll designate the first rating and comment as primary
    const primaryRatingField = business.reviewFormFields?.find(f => f.type === 'rating');
    const primaryCommentField = business.reviewFormFields?.find(f => f.type === 'comment');
    
    const primaryRatingValue = data.feedbackValues.find(v => v.fieldId === primaryRatingField?.id)?.value as number || 0;
    const primaryCommentValue = data.feedbackValues.find(v => v.fieldId === primaryCommentField?.id)?.value as string || '';


    // Add new feedback
    const newFeedback: Feedback = {
        id: `fb-${Date.now()}-${Math.random()}`,
        businessId,
        customerId: customerId,
        values: data.feedbackValues,
        rating: primaryRatingValue,
        comment: primaryCommentValue,
        date: format(new Date(), 'yyyy-MM-dd')
    };
    feedbacks.push(newFeedback);
    
    // Update business stats, but only for low ratings on the primary rating field
    if (primaryRatingValue > 0 && primaryRatingValue < 4) {
        const totalRating = (business.avgRating * business.reviews) + primaryRatingValue;
        business.reviews += 1;
        business.avgRating = totalRating / business.reviews;
    }

    return newFeedback;
}
