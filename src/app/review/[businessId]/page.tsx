import { ReviewForm } from "@/components/review/ReviewForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";

type ReviewPageProps = {
    params: {
        businessId: string;
    }
}

// In a real app, you would fetch this data from your database
const getBusinessData = (businessId: string) => {
    console.log("Fetching data for business:", businessId);
    return {
        name: 'The Happy Cafe',
        googleReviewLink: 'https://www.google.com' // Replace with a real link for testing
    }
}

export default function ReviewPage({ params }: ReviewPageProps) {
    const business = getBusinessData(params.businessId);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-lg mx-auto shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <QrCode className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold font-headline">ReviewRoute</h1>
                    </div>
                    <CardTitle className="text-2xl font-headline">Leave a review for {business.name}</CardTitle>
                    <CardDescription>Your feedback helps us improve!</CardDescription>
                </CardHeader>
                <CardContent>
                    <ReviewForm googleReviewLink={business.googleReviewLink} />
                </CardContent>
            </Card>
        </div>
    );
}
