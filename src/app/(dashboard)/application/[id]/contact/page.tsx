"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { contactSchema, type ContactFormData } from "@/lib/schemas/lcq/contact";
import { useLCQStore } from "@/stores/lcq-store";
import { useAuthStore } from "@/stores/auth-store";
import { US_STATES } from "@/types/lcq";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";

export default function ContactPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const contactInfo = useLCQStore((s) => s.contactInfo);
  const updateContactInfo = useLCQStore((s) => s.updateContactInfo);
  const loadApplication = useLCQStore((s) => s.loadApplication);
  const applicationType = useLCQStore((s) => s.applicationType);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (applicationId) {
      loadApplication(applicationId);
    }
  }, [user, applicationId, loadApplication, router]);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      legalFirstName: contactInfo.legalFirstName || "",
      legalMiddleName: contactInfo.legalMiddleName || "",
      legalLastName: contactInfo.legalLastName || "",
      alias: contactInfo.alias || "",
      aliasType: contactInfo.aliasType || null,
      streetAddress: contactInfo.streetAddress || "",
      city: contactInfo.city || "",
      state: contactInfo.state || "",
      zipCode: contactInfo.zipCode || "",
      personalEmail: contactInfo.personalEmail || "",
      personalPhone: contactInfo.personalPhone || "",
      preferredContact: contactInfo.preferredContact || "email",
      currentPractice: contactInfo.currentPractice || "",
      reasonForDentons: contactInfo.reasonForDentons || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((data) => {
      updateContactInfo(data as Partial<ContactFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form, updateContactInfo]);

  const hasAlias = form.watch("alias");

  const handleSubmit = async (): Promise<boolean> => {
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      updateContactInfo(data);
    }
    return isValid;
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">
          Contact Information
        </h1>
        <p className="text-[#7c6b80] mt-2">
          Please provide your personal contact details and information about your current practice.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <Form {...form}>
          <form className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="legalFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="First name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalMiddleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Middle Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Middle name (optional)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Last name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="alias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alias / Former Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="If applicable" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasAlias && hasAlias.length > 0 && (
                  <FormField
                    control={form.control}
                    name="aliasType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Name *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="alias">Alias</SelectItem>
                            <SelectItem value="former_name">Former Name</SelectItem>
                            <SelectItem value="nickname">Nickname</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Address
              </h3>

              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123 Main Street, Apt 4B" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="City" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12345 or 12345-6789" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Contact Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="personalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your.email@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="5551234567 (10 digits, no dashes)"
                          maxLength={10}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            field.onChange(digits);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferredContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Contact Method *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="phone" />
                          <Label htmlFor="phone">Phone</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Practice Information
              </h3>

              <FormField
                control={form.control}
                name="currentPractice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description of Your Current Practice
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your current practice, including areas of focus, types of clients, and notable matters..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <p className="text-sm text-[#7c6b80]">
                      {field.value?.length || 0} characters
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reasonForDentons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Why Are You Interested in Dentons?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Explain your reasons for considering Dentons and what you hope to achieve..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <p className="text-sm text-[#7c6b80]">
                      {field.value?.length || 0} characters
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/contact", applicationType) || ""}
          nextHref={getNextStep("/application/contact", applicationType) || ""}
          currentStep="/application/contact"
          onSubmit={handleSubmit}
          isValid={form.formState.isValid}
        />
        </CardContent>
      </Card>
    </div>
  );
}
