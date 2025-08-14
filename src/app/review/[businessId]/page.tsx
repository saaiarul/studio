import Image from 'next/image';
import { ReviewFlow } from "@/components/review/ReviewFlow";
import { Card, CardContent } from "@/components/ui/card";
import { getBusinessById } from "@/lib/data";
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
    
    const theme = business.theme;

    const pageStyle: React.CSSProperties = {
        '--page-bg': theme?.backgroundColor || 'hsl(var(--background))',
        '--page-text': theme?.textColor || 'hsl(var(--foreground))',
        '--card-bg': 'rgba(255, 255, 255, 0.1)',
        '--card-text': theme?.textColor || 'hsl(var(--foreground))',
        '--primary-color': theme?.primaryColor || 'hsl(var(--primary))',
        '--button-bg': theme?.buttonColor || 'hsl(var(--accent))',
        '--button-text': theme?.buttonTextColor || 'hsl(var(--accent-foreground))',
    } as React.CSSProperties;


    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4"
            style={pageStyle}
        >
            <div 
                className="absolute inset-0 bg-gradient-to-br from-black via-blue-950 to-black bg-[length:200%_200%] animate-gradient -z-10"
                style={{ background: theme?.backgroundColor ? `linear-gradient(45deg, ${theme.primaryColor}, ${theme.backgroundColor})` : undefined }}
            ></div>
           
            <Card 
                className="w-full max-w-lg mx-auto shadow-2xl backdrop-blur-sm border-white/20"
                style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--page-text)'
                }}
            >
                <CardContent className="p-6 text-center">
                    {business.logoUrl && (
                        <div className="mb-6 flex justify-center">
                            <Image 
                                src={business.logoUrl} 
                                alt={`${business.name} Logo`}
                                width={100}
                                height={100}
                                className="rounded-full object-cover w-[100px] h-[100px]"
                                data-ai-hint="logo"
                            />
                        </div>
                    )}
                     <ReviewFlow business={business} />
                </CardContent>
            </Card>
        </div>
    );
}
