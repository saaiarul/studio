// In a real app, this data would be fetched from a database.
// We're using a static list here for demonstration purposes.

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

const businesses: Business[] = [
    { 
        id: 'comp-123', 
        name: 'The Happy Cafe', 
        ownerEmail: 'company@reviewroute.com', 
        password: 'password',
        reviews: 28, 
        avgRating: 2.8, 
        reviewUrl: 'http://localhost:3000/review/comp-123',
        googleReviewLink: 'https://g.page/r/some-google-link/review'
    },
    { 
        id: 'comp-456', 
        name: 'City Bookstore', 
        ownerEmail: 'book@example.com', 
        password: 'password',
        reviews: 152, 
        avgRating: 3.1, 
        reviewUrl: 'http://localhost:3000/review/comp-456',
        googleReviewLink: 'https://www.google.com'
    },
    { 
        id: 'comp-789', 
        name: 'Tech Gadgets Inc.', 
        ownerEmail: 'gadget@example.com', 
        password: 'password',
        reviews: 45, 
        avgRating: 2.5, 
        reviewUrl: 'http://localhost:3000/review/comp-789',
        googleReviewLink: 'https://www.google.com'
    },
];

export async function getBusinesses(): Promise<Business[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return businesses;
}

export async function getBusinessById(id: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
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
