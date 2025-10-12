"use client"

import { motion } from "framer-motion"
import { Clock, Fingerprint, BarChart3, Users, Monitor, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Clock,
    title: "Real-time Attendance",
    description: "Track employee clock-ins and clock-outs instantly with live updates across all devices.",
  },
  {
    icon: Fingerprint,
    title: "Biometric Enrollment",
    description: "Secure biometric authentication ensures accurate attendance and prevents buddy punching.",
  },
  {
    icon: BarChart3,
    title: "Project Monitoring",
    description: "Monitor multiple construction sites and projects from a single, unified dashboard.",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "Manage your workforce efficiently with detailed profiles, schedules, and performance tracking.",
  },
  {
    icon: Monitor,
    title: "Kiosk Mode",
    description: "Deploy on-site kiosks for easy clock-in/out without requiring personal devices.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with industry standards to protect your data.",
  },
]

export function Features() {
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
            Everything you need to manage your workforce
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Powerful features designed specifically for construction companies to streamline operations and boost
            productivity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
