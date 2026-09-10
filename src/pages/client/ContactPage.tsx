import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { siteConfig, whatsappLink } from "@/lib/site";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";

/**
 * Contact page. Messages are delivered through the channel the business
 * actually monitors: WhatsApp when a business number is configured, otherwise
 * the visitor's email client (mailto) with the message pre-filled. Either way
 * the message genuinely leaves the browser — nothing is faked.
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      formData.phone ? `Phone: ${formData.phone}` : null,
      `Subject: ${formData.subject}`,
      "",
      formData.message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const wa = whatsappLink(`Hello Vachoma Empire!\n\n${body}`);
    if (wa) {
      window.open(wa, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
        `Website enquiry: ${formData.subject}`
      )}&body=${encodeURIComponent(body)}`;
    }
  };

  const waAvailable = siteConfig.contact.phoneIntl !== "";

  return (
    <ClientLayout>
      <Seo
        title="Contact Us"
        description="Get in touch with Vachoma Empire in Port Harcourt — custom fashion enquiries, Bole orders, catering and feedback. We reply within 24 hours."
        path="/contact"
      />
      <div className="container mx-auto py-12 md:py-16">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Questions, custom orders or catering? Reach out — we reply within 24 hours.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Get In Touch</h2>
              <p className="text-muted-foreground">
                Fill out the form and it opens straight into a WhatsApp chat with our team
                {waAvailable ? "" : " — or your email app"}.
              </p>
            </div>

            <div>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5 text-primary" /> Our Location
              </h3>
              <address className="not-italic text-muted-foreground">
                <p>{siteConfig.contact.address}</p>
              </address>
              <div className="mt-3 overflow-hidden rounded-xl border">
                <iframe
                  title="Map of Port Harcourt, Rivers State"
                  src="https://maps.google.com/maps?q=Port%20Harcourt%2C%20Rivers%20State%2C%20Nigeria&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  className="h-52 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Contact Information</h3>
              <div className="space-y-2 text-muted-foreground">
                {siteConfig.contact.phoneDisplay && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${siteConfig.contact.phoneDisplay}`} className="hover:text-foreground">
                      {siteConfig.contact.phoneDisplay}
                    </a>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
                    {siteConfig.contact.email}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-primary" /> Business Hours
              </h3>
              <div className="space-y-1 text-muted-foreground">
                {siteConfig.contact.hours.map((h) => (
                  <p key={h}>{h}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 md:p-8 lg:col-span-3">
            <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                {waAvailable ? (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4" /> Send via WhatsApp
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send via Email
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {waAvailable
                  ? "This opens WhatsApp with your message ready to send."
                  : "This opens your email app with the message pre-filled."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ContactPage;
