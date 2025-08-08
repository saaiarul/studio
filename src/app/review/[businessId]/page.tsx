import { ReviewFlow } from "@/components/review/ReviewFlow";
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-blue-950 to-black bg-[length:200%_200%] animate-gradient">
            <Card className="w-full max-w-lg mx-auto shadow-2xl bg-card/80 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <QrCode className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold font-headline">ReviewRoute</h1>
                    </div>
                </CardHeader>
                <CardContent>
                    <ReviewFlow business={business} />
                </CardContent>
            </Card>
        </div>
    );
}
