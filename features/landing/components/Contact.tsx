"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingPageStore } from "@/store/useLandingPageStore";

export function Contact() {
  const openContactModal = useLandingPageStore(
    (state) => state.openContactModal
  );

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Ready to transform your workforce management?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed mb-8">
              Get started with WorkTrackr today and see the difference in your
              construction operations.
            </p>
            <Button
              size="lg"
              onClick={openContactModal}
              className="gradient-button text-white px-8 py-6 text-lg font-semibold rounded-xl"
            >
              Contact Sales
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Mail,
                title: "Email Us",
                content: "sales@worktrackr.com",
                link: "mailto:sales@worktrackr.com",
              },
              {
                icon: Phone,
                title: "Call Us",
                content: "+1 (555) 123-4567",
                link: "tel:+15551234567",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                content: "San Francisco, CA",
                link: "#",
              },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-background transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.content}</p>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
