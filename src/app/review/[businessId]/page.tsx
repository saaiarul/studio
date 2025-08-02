import { ReviewForm } from "@/components/review/ReviewForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinessById } from "@/lib/data";
import { QrCode } from "lucide-react";
import { notFound } from "next/navigation";

type ReviewPageProps = {
    params: {
        businessId: string;
    }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
    const business = await getBusinessById(params.businessId);

    if (!business) {
        notFound();
    }

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
                    <ReviewForm businessId={params.businessId} googleReviewLink={business.googleReviewLink} />
                </CardContent>
            </Card>
        </div>
    );
}
