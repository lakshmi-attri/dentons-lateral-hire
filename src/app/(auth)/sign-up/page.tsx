'use client';

import { useState } from 'react';
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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setError('');

    const result = await signup(values.email, values.name, values.password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <header className="mb-10 text-center md:text-left">
        <h2 className="text-xl font-medium text-[#7c6b80]">
          Dentons Lateral Partner Integration Platform
        </h2>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-[#1c151d] mt-2">
          Create Your Account
        </h1>
        <p className="mt-4 text-base text-[#7c6b80]">
          Begin your integration process with Dentons.
        </p>
      </header>

      <main>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium leading-normal pb-2 text-[#1c151d]">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium leading-normal pb-2 text-[#1c151d]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium leading-normal pb-2 text-[#1c151d]">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
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
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </main>

      <footer className="mt-12 text-center">
        <p className="text-sm text-[#7c6b80]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p className="text-sm text-[#7c6b80] mt-3">
          Administrator?{" "}
          <Link
            href="/admin-sign-in"
            className="font-medium text-primary hover:underline"
          >
            Admin Login
          </Link>
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="#" className="text-xs text-[#7c6b80] hover:underline">
            Terms of Service
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
