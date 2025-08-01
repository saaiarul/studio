import { DashboardLayout } from '@/components/DashboardLayout';
import { AddBusinessDialog } from '@/components/admin/AddBusinessDialog';
import { BusinessTable } from '@/components/admin/BusinessTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBusinesses } from '@/lib/data';

export default async function AdminPage() {

    const businesses = await getBusinesses();

  return (
    <DashboardLayout role="admin">
        <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <AddBusinessDialog />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Manage Businesses</CardTitle>
                <CardDescription>View, edit, or add new businesses to the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <BusinessTable businesses={businesses} />
            </CardContent>
        </Card>
    </DashboardLayout>
  );
}
