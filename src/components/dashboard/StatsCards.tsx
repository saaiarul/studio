
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';

type StatsCardsProps = {
  stats: {
    totalReviews: number;
    averageRating: number;
    credits: number;
  };
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Negative Feedback</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
          <p className="text-xs text-muted-foreground">Reviews with rating &lt; 4</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Based on all collected feedback</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Message Credits</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.credits}</div>
          <p className="text-xs text-muted-foreground">Contact admin to recharge</p>
        </CardContent>
      </Card>
    </div>
  );
}
