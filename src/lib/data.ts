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

export type Business = {
    id: string;
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
};

type Feedback = {
    id: string;
    businessId: string;
    customerId: string;
    rating: number;
    comment: string;
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
        logoUrl: '/logo-placeholder.png',
        welcomeMessage: 'Thanks for visiting The Happy Cafe! We hope you enjoyed your time with us.',
        theme: {
            primaryColor: '#4A90E2', // A friendly blue
            backgroundColor: '#F5F8FA',
            textColor: '#333333',
            buttonColor: '#50E3C2', // A vibrant teal
            buttonTextColor: '#FFFFFF',
        }
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
        credits: 50
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
        credits: 0
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
    return businesses.find(b => b.id === id) || null;
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

export async function getFeedbackByBusinessId(businessId: string): Promise<Feedback[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const businessFeedback = feedbacks.filter(f => f.businessId === businessId);
    
    const feedbackWithCustomer = businessFeedback.map(f => {
        const customer = customers.find(c => c.id === f.customerId);
        return {
            ...f,
            comment: `${customer?.name || 'Anonymous'}: ${f.comment}`
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

export async function addFeedback(businessId: string, data: { rating: number, comment: string, customerName: string }): Promise<Feedback> {
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


    // Add new feedback
    const newFeedback: Feedback = {
        id: `fb-${Date.now()}-${Math.random()}`,
        businessId,
        customerId: customerId,
        rating: data.rating,
        comment: data.comment,
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