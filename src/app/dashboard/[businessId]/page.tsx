import { DashboardLayout } from '@/components/DashboardLayout';
import { QRCodeCard } from '@/components/dashboard/QRCodeCard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { GoogleLinkCard } from '@/components/dashboard/GoogleLinkCard';
import { getBusinessById, getFeedbackByBusinessId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { FeedbackChart } from '@/components/dashboard/FeedbackChart';

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

  const feedback = await getFeedbackByBusinessId(params.businessId);

  const reviewStats = {
    totalReviews: companyData.reviews,
    averageRating: companyData.avgRating,
  };


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
            <QRCodeCard companyName={companyData.name} reviewUrl={companyData.reviewUrl} />
          </div>
        </div>
        
        <FeedbackTable feedback={feedback} />
      </div>
    </DashboardLayout>
  );
}
