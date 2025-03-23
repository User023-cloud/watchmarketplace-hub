
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import Features from '@/components/sections/Features';
import Newsletter from '@/components/sections/Newsletter';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FeaturedProducts />
        <Features />
        <Newsletter />
      </motion.div>
    </Layout>
  );
};

export default Index;
