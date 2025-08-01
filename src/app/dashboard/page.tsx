import { redirect } from 'next/navigation';

// NOTE: This page is no longer directly used.
// Company users are redirected to /dashboard/[businessId] after login.
// This file can be removed if a generic /dashboard route is not needed.
export default function DashboardRedirectPage() {
  // A real implementation would get the logged-in user's businessId
  // and redirect. For now, we'll redirect to a default.
  redirect('/dashboard/comp-123');
}
