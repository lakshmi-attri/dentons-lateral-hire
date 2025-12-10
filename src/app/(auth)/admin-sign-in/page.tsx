'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/stores/auth-store';
import { Shield } from 'lucide-react';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminSignInPage() {
  const router = useRouter();
  const { login, seedAdminUser, isAuthenticated, isAdmin } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    seedAdminUser();

    if (isAuthenticated && isAdmin) {
      router.push('/admin');
    } else if (isAuthenticated && !isAdmin) {
      // If user is logged in but not admin, redirect to dashboard
      router.push('/dashboard');
    }
  }, [seedAdminUser, isAuthenticated, isAdmin, router]);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: AdminLoginFormValues) {
    setIsLoading(true);
    setError('');

    const result = await login(values.email, values.password);

    if (result.success) {
      // Check if the logged-in user is an admin
      const state = useAuthStore.getState();
      if (state.isAdmin && state.user?.role === 'admin') {
        router.push('/admin');
      } else {
        setError('Access denied. This page is for administrators only.');
        useAuthStore.getState().logout();
        setIsLoading(false);
      }
    } else {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <header className="mb-10 text-center md:text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-medium text-[#7c6b80]">
            Dentons Lateral Partner Integration Platform
          </h2>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-[#1c151d] mt-2">
          Admin Access
        </h1>
        <p className="mt-4 text-base text-[#7c6b80]">
          Sign in with your administrator credentials to access the recruiting committee view.
        </p>
      </header>

      <main>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert className="mb-6 border-[#a855f7] bg-[#a855f7]/10">
          <AlertDescription className="text-sm">
            <strong>Admin Login Credentials:</strong><br />
            Email: admin@dentons.com<br />
            Password: admin
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium leading-normal pb-2 text-[#1c151d]">
                    Admin Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your admin email address"
                      className="h-14 rounded-lg border-[#e5e0e7] bg-white text-[#1c151d] placeholder:text-[#7c6b80] p-4 text-base focus:ring-2 focus:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium leading-normal pb-2 text-[#1c151d]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-14 rounded-lg border-[#e5e0e7] bg-white text-[#1c151d] placeholder:text-[#7c6b80] p-4 text-base focus:ring-2 focus:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-14 rounded-lg bg-primary text-white text-base font-bold tracking-[0.015em] hover:bg-primary/90 transition-colors mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In as Admin'}
            </Button>
          </form>
        </Form>
      </main>

      <footer className="mt-12 text-center">
        <p className="text-sm text-[#7c6b80]">
          Not an administrator?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Partner/Staff Login
          </Link>
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/sign-up" className="text-xs text-[#7c6b80] hover:underline">
            Create Partner Account
          </Link>
          <span className="text-[#e5e0e7]">|</span>
          <Link href="#" className="text-xs text-[#7c6b80] hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

