
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, QrCode, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast"
import { getBusinesses } from '@/lib/data';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email === 'admin@reviewdeep.com' && password === 'password') {
      toast({
        title: "Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      router.push('/admin');
      setIsLoading(false);
      return;
    }

    try {
      const businesses = await getBusinesses();
      const company = businesses.find(b => b.ownerEmail === email);

      if (company && company.password === password) {
         toast({
          title: "Login Successful",
          description: "Redirecting to your dashboard...",
        });
        router.push(`/dashboard/${company.id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password.",
        });
      }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Login Error",
            description: "Could not verify credentials. Please try again later.",
          });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-950 to-black bg-[length:200%_200%] animate-gradient">
      <Card className="w-full max-w-md mx-4 shadow-2xl bg-white/90 backdrop-blur-sm border-white/20 text-black">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <QrCode className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-black">ReviewDeep</h1>
          </div>
          <CardTitle className="text-2xl font-headline text-black">Unlock Your Dashboard</CardTitle>
          <CardDescription className="text-black/70">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black/90">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  className="pl-10 bg-black/10 border-black/20 focus:bg-black/20 text-black placeholder:text-black/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black/90">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  required 
                  className="pl-10 pr-10 bg-black/10 border-black/20 focus:bg-black/20 text-black placeholder:text-black/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
