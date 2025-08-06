import { DashboardLayout } from '@/components/DashboardLayout';
import { CustomerList } from '@/components/settings/CustomerList';
import { ReviewPageEditor } from '@/components/settings/ReviewPageEditor';
import { getBusinessById, getCustomersByBusinessId } from '@/lib/data';
import { notFound } from 'next/navigation';

type SettingsPageProps = {
    params: {
        businessId: string;
    }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const companyData = await getBusinessById(params.businessId);
  
  if (!companyData) {
    notFound();
  }

  const customers = await getCustomersByBusinessId(params.businessId);

  return (
    <DashboardLayout role="company">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Settings</h1>
          <p className="text-muted-foreground">Manage your account and review page settings for {companyData.name}.</p>
        </div>
        <ReviewPageEditor businessId={params.businessId} />
        <CustomerList customers={customers} />
      </div>
    </DashboardLayout>
  );
}
