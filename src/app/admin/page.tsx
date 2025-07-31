import { DashboardLayout } from '@/components/DashboardLayout';
import { AddBusinessDialog } from '@/components/admin/AddBusinessDialog';
import { BusinessTable } from '@/components/admin/BusinessTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPage() {

    const businesses = [
        { id: 'comp-123', name: 'The Happy Cafe', ownerEmail: 'company@reviewroute.com', reviews: 28, avgRating: 2.8 },
        { id: 'comp-456', name: 'City Bookstore', ownerEmail: 'book@example.com', reviews: 152, avgRating: 3.1 },
        { id: 'comp-789', name: 'Tech Gadgets Inc.', ownerEmail: 'gadget@example.com', reviews: 45, avgRating: 2.5 },
    ];

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
