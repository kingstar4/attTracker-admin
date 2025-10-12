"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Michael Rodriguez",
    role: "Construction Manager",
    company: "BuildRight Construction",
    content:
      "WorkTrackr has transformed how we manage our workforce. The biometric system eliminated time theft and the real-time reporting saves us hours every week.",
    rating: 5,
    image: "/construction-manager-portrait.png",
  },
  {
    name: "Sarah Chen",
    role: "Project Director",
    company: "Metro Infrastructure",
    content:
      "Managing multiple sites used to be a nightmare. Now I can see attendance across all projects instantly. The ROI was immediate.",
    rating: 5,
    image: "/female-project-director-portrait.jpg",
  },
  {
    name: "James Thompson",
    role: "Site Supervisor",
    company: "Skyline Builders",
    content:
      "The kiosk mode is perfect for our sites. Workers love how easy it is to clock in, and I love the accurate data for payroll.",
    rating: 5,
    image: "/site-supervisor-portrait.jpg",
  },
];

const companies = [
  { name: "BuildRight", logo: "/construction-company-logo.png" },
  { name: "Metro Infrastructure", logo: "/infrastructure-company-logo.png" },
  { name: "Skyline Builders", logo: "/builders-company-logo.jpg" },
  { name: "Foundation Pro", logo: "/foundation-company-logo.jpg" },
  { name: "Steel & Stone", logo: "/steel-company-logo.jpg" },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Trusted by construction leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Join hundreds of construction companies already using WorkTrackr to
            manage their workforce.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2">
                <CardContent className="p-8">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-accent text-accent"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-border pt-16"
        >
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
            Trusted by leading construction companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {companies.map((company, index) => (
              <img
                key={index}
                src={company.logo || "/placeholder.svg"}
                alt={company.name}
                className="h-8 grayscale hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
