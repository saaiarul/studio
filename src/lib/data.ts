// In a real app, this data would be fetched from a database.
// We're using a static list here for demonstration purposes.

import { format } from 'date-fns';

type Business = {
    id: string;
    name: string;
    ownerEmail: string;
    password?: string; // Optional for existing data, but should be set for new ones
    reviews: number;
    avgRating: number;
    reviewUrl: string;
    googleReviewLink: string;
};

type Feedback = {
    id: string;
    businessId: string;
    rating: number;
    comment: string;
    date: string;
};


const businesses: Business[] = [
    { 
        id: 'comp-123', 
        name: 'The Happy Cafe', 
        ownerEmail: 'company@reviewroute.com', 
        password: 'password',
        reviews: 0, 
        avgRating: 0, 
        reviewUrl: 'http://localhost:3000/review/comp-123',
        googleReviewLink: 'https://g.page/r/some-google-link/review'
    },
    { 
        id: 'comp-456', 
        name: 'City Bookstore', 
        ownerEmail: 'book@example.com', 
        password: 'password',
        reviews: 0, 
        avgRating: 0, 
        reviewUrl: 'http://localhost:3000/review/comp-456',
        googleReviewLink: 'https://www.google.com'
    },
    { 
        id: 'comp-789', 
        name: 'Tech Gadgets Inc.', 
        ownerEmail: 'gadget@example.com', 
        password: 'password',
        reviews: 0, 
        avgRating: 0, 
        reviewUrl: 'http://localhost:3000/review/comp-789',
        googleReviewLink: 'https://www.google.com'
    },
];

const feedbacks: Feedback[] = [];

export async function getBusinesses(): Promise<Business[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return businesses;
}

export async function getBusinessById(id: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return businesses.find(b => b.id === id) || null;
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

export async function getFeedbackByBusinessId(businessId: string): Promise<Feedback[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return feedbacks.filter(f => f.businessId === businessId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addFeedback(businessId: string, data: { rating: number, comment: string }): Promise<Feedback> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const business = businesses.find(b => b.id === businessId);
    if (!business) {
        throw new Error("Business not found");
    }

    // Add new feedback
    const newFeedback: Feedback = {
        id: `fb-${Date.now()}-${Math.random()}`,
        businessId,
        ...data,
        date: format(new Date(), 'yyyy-MM-dd')
    };
    feedbacks.push(newFeedback);
    
    // Update business stats, but only for low ratings
    if (data.rating < 4) {
        const totalRating = (business.avgRating * business.reviews) + data.rating;
        business.reviews += 1;
        business.avgRating = totalRating / business.reviews;
    }

    return newFeedback;
}
