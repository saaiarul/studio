
import { DashboardLayout } from '@/components/DashboardLayout';
import { getBusinessById, getFeedbackByBusinessIdWithFullData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { FeedbackTrends } from '@/components/analytics/FeedbackTrends';
import { WordCloud } from '@/components/analytics/WordCloud';
import { SatisfactionBreakdown } from '@/components/analytics/SatisfactionBreakdown';
import { FeedbackHeatmap } from '@/components/analytics/FeedbackHeatmap';

type AnalyticsPageProps = {
    params: {
        businessId: string;
    }
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const businessData = await getBusinessById(params.businessId);
  if (!businessData) {
    notFound();
  }

  const feedbackData = await getFeedbackByBusinessIdWithFullData(params.businessId);

  return (
    <DashboardLayout role="company">
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Feedback Analytics</h1>
                <p className="text-muted-foreground">Deep dive into your customer feedback for {businessData.name}.</p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2">
                <FeedbackTrends feedback={feedbackData} />
                <SatisfactionBreakdown feedback={feedbackData} />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <WordCloud feedback={feedbackData} />
                <FeedbackHeatmap feedback={feedbackData} />
            </div>
        </div>
    </DashboardLayout>
  );
}
