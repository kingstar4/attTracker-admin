"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Demo() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">See WorkTrackr in action</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Watch how easy it is to manage attendance and track your construction workforce.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-border group cursor-pointer"
          >
            {/* Demo Mockup */}
            <div className="aspect-video bg-gradient-to-br from-primary via-primary/90 to-accent/80 flex items-center justify-center relative">
              <img
                src="/construction-attendance-dashboard-interface.jpg"
                alt="WorkTrackr Dashboard Demo"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-white hover:bg-white/90 text-primary shadow-2xl group-hover:scale-110 transition-transform"
                >
                  <Play className="w-8 h-8 ml-1" fill="currentColor" />
                </Button>
              </div>
            </div>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-accent/0 group-hover:border-accent/50 transition-colors pointer-events-none" />
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: "Quick Setup", description: "Get started in under 5 minutes" },
              { title: "Easy to Use", description: "Intuitive interface for all skill levels" },
              { title: "Mobile Ready", description: "Works on any device, anywhere" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
