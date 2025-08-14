
import { DashboardLayout } from '@/components/DashboardLayout';
import { CustomerList } from '@/components/settings/CustomerList';
import { getBusinessById, getCustomersByBusinessId } from '@/lib/data';
import { notFound } from 'next/navigation';

type CustomersPageProps = {
    params: {
        businessId: string;
    }
}

export default async function CustomersPage({ params }: CustomersPageProps) {
  const companyData = await getBusinessById(params.businessId);
  
  if (!companyData) {
    notFound();
  }

  const customers = await getCustomersByBusinessId(params.businessId);

  return (
    <DashboardLayout role="company" business={companyData}>
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Customers</h1>
                <p className="text-muted-foreground">View the list of customers who have submitted feedback for {companyData.name}.</p>
            </div>
            <CustomerList customers={customers} />
        </div>
    </DashboardLayout>
  );
}
