# **App Name**: ReviewRoute

## Core Features:

- Admin Role: Admin user role to manage businesses and view all reviews.
- Company Role: Company user role with dashboard to view their QR code, total reviews, average rating, and feedback.
- Company Dashboard: Company dashboard to see QR code, total reviews, average rating, and feedback less than 4 stars; export reviews to CSV.
- Public Review Page: Public review page to show a star rating and optional comment form for non-logged-in users.
- Google Review Redirection: Automatically redirect reviewers to a Google review link if the rating is 4 stars or higher; save feedback to Firestore if the rating is less than 4 stars.
- QR Code Generation: Generate unique QR codes and review URLs for each business.
- Role Based Access Control: Utilize Firebase Authentication and Firestore rules to secure access based on user roles (admin/company).
- Company Google Link Upload: Option for the company to upload their Google link

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) for a trustworthy and calming feel.
- Background color: Light gray (#F5F5F5) for a clean and neutral backdrop.
- Accent color: Teal (#26A69A) to highlight key actions and information.
- Body and headline font: 'Inter' (sans-serif) for a clean, modern, and readable user experience.
- Use minimalist icons to represent different elements and actions in the app. Consistent in style and weight to provide visual harmony.
- Use a clean and structured layout to provide simple navigation between dashboards and to focus on important content and calls to action. A card-based layout for displaying QR codes, reviews, and analytics.
- Use subtle transition effects and animations to enhance the user experience when forms appear.