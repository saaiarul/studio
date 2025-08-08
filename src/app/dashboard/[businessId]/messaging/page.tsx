
import { DashboardLayout } from '@/components/DashboardLayout';
import { MessagingComposer } from '@/components/messaging/MessagingComposer';
import { getBusinessById, getCustomersByBusinessId } from '@/lib/data';
import { notFound } from 'next/navigation';

type MessagingPageProps = {
    params: {
        businessId: string;
    }
}

export default async function MessagingPage({ params }: MessagingPageProps) {
  const companyData = await getBusinessById(params.businessId);
  
  if (!companyData) {
    notFound();
  }

  const customers = await getCustomersByBusinessId(params.businessId);

  return (
    <DashboardLayout role="company">
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Messaging</h1>
                <p className="text-muted-foreground">Send messages to your customers for {companyData.name}.</p>
            </div>
            <MessagingComposer customers={customers} credits={companyData.credits} />
        </div>
    </DashboardLayout>
  );
}
