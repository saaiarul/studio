
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AddBusinessDialog } from '@/components/admin/AddBusinessDialog';
import { BusinessTable } from '@/components/admin/BusinessTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBusinesses, Business } from '@/lib/data';

export default function AdminPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBusinesses = async () => {
            setIsLoading(true);
            const biz = await getBusinesses();
            setBusinesses(biz);
            setIsLoading(false);
        };
        fetchBusinesses();
    }, []);

    const handleBusinessAdded = (newBusiness: Business) => {
        setBusinesses(prev => [...prev, newBusiness]);
    }

    const handleBusinessUpdated = (updatedBusiness: Business) => {
        setBusinesses(prev => prev.map(b => b.id === updatedBusiness.id ? updatedBusiness : b));
    }

  return (
    <DashboardLayout role="admin">
        <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <AddBusinessDialog onBusinessAdded={handleBusinessAdded} />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Manage Businesses</CardTitle>
                <CardDescription>View, edit, or add new businesses to the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <p>Loading businesses...</p>
                ) : (
                    <BusinessTable businesses={businesses} onBusinessUpdated={handleBusinessUpdated} />
                )}
            </CardContent>
        </Card>
    </DashboardLayout>
  );
}
