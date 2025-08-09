
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AddBusinessDialog } from '@/components/admin/AddBusinessDialog';
import { BusinessTable } from '@/components/admin/BusinessTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBusinesses, Business } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AdminPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const biz = await getBusinesses();
                setBusinesses(biz);
            } catch (err) {
                setError("Failed to fetch businesses. Please check your connection and Supabase setup.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBusinesses();
    }, []);

    const handleBusinessAdded = (newBusiness: Business) => {
        setBusinesses(prev => [...prev, newBusiness]);
    }

    const handleBusinessUpdated = (updatedBusiness: Business) => {
        setBusinesses(prev => prev.map(b => b.id === updatedBusiness.id ? updatedBusiness : b));
    }

    const renderContent = () => {
        if (isLoading) {
            return <p>Loading businesses...</p>;
        }
        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }
        if (businesses.length === 0) {
            return <p className="text-center text-muted-foreground">No businesses found. Add one to get started!</p>
        }
        return <BusinessTable businesses={businesses} onBusinessUpdated={handleBusinessUpdated} />;
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
                {renderContent()}
            </CardContent>
        </Card>
    </DashboardLayout>
  );
}
