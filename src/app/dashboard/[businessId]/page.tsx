import { DashboardLayout } from '@/components/DashboardLayout';
import { QRCodeCard } from '@/components/dashboard/QRCodeCard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { GoogleLinkCard } from '@/components/dashboard/GoogleLinkCard';
import { getBusinessById } from '@/lib/data';
import { notFound } from 'next/navigation';

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

  const reviewStats = {
    totalReviews: 28,
    averageRating: 2.8,
  };

  const feedback = [
    { id: '1', rating: 3, comment: 'The latte was okay, but not exceptional. Service was a bit slow.', date: '2024-05-20' },
    { id: '2', rating: 1, comment: 'Cold food and the waiter was rude. Will not be coming back.', date: '2024-05-19' },
    { id: '3', rating: 2, comment: 'The place is nice, but the music was too loud.', date: '2024-05-18' },
    { id: '4', rating: 3, comment: '', date: '2024-05-17' },
  ];

  return (
    <DashboardLayout role="company">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">{companyData.name} Dashboard</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <StatsCards stats={reviewStats} />
            <GoogleLinkCard currentLink={companyData.googleReviewLink} />
          </div>
          <div className="md:col-span-1">
            <QRCodeCard companyName={companyData.name} reviewUrl={companyData.reviewUrl} />
          </div>
        </div>
        
        <FeedbackTable feedback={feedback} />
      </div>
    </DashboardLayout>
  );
}
