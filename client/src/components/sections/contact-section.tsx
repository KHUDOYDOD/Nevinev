import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    },
  });

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    // This would be replaced with a real API call
    setTimeout(() => {
      toast({
        title: t('contact.success_title'),
        description: t('contact.success_message'),
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <section id="contacts" className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('contact.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
        
        <div className="max-w-4xl mx-auto flex flex-wrap">
          <div className="w-full md:w-1/2 p-4">
            <div className="bg-white rounded-xl p-6 h-full shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <i className="fab fa-telegram-plane text-xl text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Telegram</h3>
                  <p className="text-gray-600">@tradepo_support</p>
                </div>
              </div>
              <p className="text-gray-500 mb-4">{t('contact.telegram_text')}</p>
              <a 
                href="https://t.me/tradepo_support" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary font-medium hover:text-primary-dark"
              >
                {t('contact.write_telegram')}
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 p-4">
            <div className="bg-white rounded-xl p-6 h-full shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-envelope text-xl text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Email</h3>
                  <p className="text-gray-600">support@tradepo.ru</p>
                </div>
              </div>
              <p className="text-gray-500 mb-4">{t('contact.email_text')}</p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contact.form.name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contact.form.name_placeholder')} {...field} />
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
                        <FormLabel>{t('contact.form.email')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contact.form.email_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contact.form.message')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t('contact.form.message_placeholder')} 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
