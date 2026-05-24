'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const contactDetails = {
  email: 'work.arjitgupta@gmail.com',
  phone: '+91 9648118280',
};

export function ContactCard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.a
              href={`mailto:${contactDetails.email}`}
              className="group"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="p-6 bg-muted/50 rounded-xl border border-transparent group-hover:border-primary/50 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-muted-foreground transition-colors group-hover:text-primary">
                      {contactDetails.email}
                    </p>
                  </div>
                </div>
              </div>
            </motion.a>
            <motion.a
              href={`tel:${contactDetails.phone.replace(/\s/g, '')}`}
              className="group"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="p-6 bg-muted/50 rounded-xl border border-transparent group-hover:border-accent/50 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-lg">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Mobile</h3>
                    <p className="text-muted-foreground transition-colors group-hover:text-accent">
                      {contactDetails.phone}
                    </p>
                  </div>
                </div>
              </div>
            </motion.a>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
