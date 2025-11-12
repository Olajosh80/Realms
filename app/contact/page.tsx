'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/ui/Hero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    content: '123 Business Avenue, Suite 100\nNew York, NY 10001',
  },
  {
    icon: Phone,
    title: 'Phone',
    content: '+1 (234) 567-890',
    link: 'tel:+1234567890',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'info@beyondrealms.com',
    link: 'mailto:info@beyondrealms.com',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    content: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([data]);
      
      if (error) throw error;
      
      setSubmitStatus('success');
      reset();
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero
          badge="Contact Us"
          title="Get in Touch"
          description="Have questions or want to learn more about our services? We'd love to hear from you."
          centered
        />
        
        {/* Contact Info Section */}
        <Section background="alt" padding="lg">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} padding="lg">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-rare-primary-light rounded-full mb-4">
                        <Icon className="h-6 w-6 text-rare-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-normal text-rare-primary mb-2">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="font-body text-sm text-rare-text-light hover:text-rare-primary transition-colors whitespace-pre-line"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="font-body text-sm text-rare-text-light whitespace-pre-line">
                          {info.content}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Section>
        
        {/* Contact Form Section */}
        <Section background="default" padding="lg">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-normal text-rare-primary mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Name *"
                    placeholder="Your name"
                    {...register('name')}
                    error={errors.name?.message}
                    fullWidth
                  />
                  
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email')}
                    error={errors.email?.message}
                    fullWidth
                  />
                  
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="+1 (234) 567-890"
                    {...register('phone')}
                    error={errors.phone?.message}
                    fullWidth
                  />
                  
                  <Input
                    label="Subject *"
                    placeholder="How can we help?"
                    {...register('subject')}
                    error={errors.subject?.message}
                    fullWidth
                  />
                  
                  <Textarea
                    label="Message *"
                    placeholder="Tell us more about your inquiry..."
                    {...register('message')}
                    error={errors.message?.message}
                    fullWidth
                    rows={6}
                  />
                  
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        Thank you for your message! We'll get back to you soon.
                      </p>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        Sorry, there was an error submitting your message. Please try again.
                      </p>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
              
              {/* Map */}
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-normal text-rare-primary mb-6">
                  Visit Our Office
                </h2>
                <div className="aspect-square bg-rare-background-alt rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9476519598093!2d-73.99185368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </>
  );
}

