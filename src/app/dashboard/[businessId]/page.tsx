

import { DashboardLayout } from '@/components/DashboardLayout';
import { QRCodeCard } from '@/components/dashboard/QRCodeCard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { GoogleLinkCard } from '@/components/dashboard/GoogleLinkCard';
import { getBusinessById, getFeedbackByBusinessId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { FeedbackChart } from '@/components/dashboard/FeedbackChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

type DashboardPageProps = {
    params: {
        businessId: string;
    }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const companyData = await getBusinessById(params.businessId);

  if (!companyData) {
    notFound();
  }
  
  if (companyData.status !== 'approved') {
    return (
       <DashboardLayout role="company">
           <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Account Pending Approval</CardTitle>
                    <CardDescription>Your account is currently under review by our team.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                      <Rocket className="h-4 w-4" />
                      <AlertTitle>Hold Tight!</AlertTitle>
                      <AlertDescription>
                        You will receive an email notification once your application has been approved. You'll then be able to access all features of the dashboard.
                      </AlertDescription>
                    </Alert>
                </CardContent>
           </Card>
       </DashboardLayout>
    )
  }

  const feedback = await getFeedbackByBusinessId(params.businessId);

  const reviewStats = {
    totalReviews: companyData.reviews,
    averageRating: companyData.avgRating,
    credits: companyData.credits,
  };

  const reviewUrl = `https://reviewdeep.vercel.app/review/${companyData.id}`;

  return (
    <DashboardLayout role="company">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">{companyData.name} Dashboard</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <StatsCards stats={reviewStats} />
            <FeedbackChart feedback={feedback} />
            <GoogleLinkCard currentLink={companyData.googleReviewLink} />
          </div>
          <div className="lg:col-span-1">
            <QRCodeCard companyName={companyData.name} reviewUrl={reviewUrl} />
          </div>
        </div>
        
        <FeedbackTable feedback={feedback} />
      </div>
    </DashboardLayout>
  );
}

    