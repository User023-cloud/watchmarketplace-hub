
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/product-card';
import SectionHeading from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample product data
const allProducts = [
  {
    id: '1',
    name: 'Chronographe Precision',
    price: 3499.99,
    imageSrc: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Chronographe',
    featured: true,
    bestseller: false,
    new: false,
  },
  {
    id: '2',
    name: 'Classique Élégance',
    price: 2899.99,
    imageSrc: 'https://images.unsplash.com/photo-1548359638-e51353ca6d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Classique',
    featured: false,
    bestseller: true,
    new: false,
  },
  {
    id: '3',
    name: 'Sport Aventure',
    price: 1999.99,
    imageSrc: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Sport',
    featured: false,
    bestseller: false,
    new: true,
  },
  {
    id: '4',
    name: 'Diver Professional',
    price: 4299.99,
    imageSrc: 'https://images.unsplash.com/photo-1530465548467-0991968a53a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Plongée',
    featured: true,
    bestseller: false,
    new: false,
  },
  {
    id: '5',
    name: 'Skeleton Automatique',
    price: 5699.99,
    imageSrc: 'https://images.unsplash.com/photo-1607242864136-4122d19fee10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Squelette',
    featured: false,
    bestseller: false,
    new: true,
  },
  {
    id: '6',
    name: 'Heritage Vintage',
    price: 3899.99,
    imageSrc: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Vintage',
    featured: false,
    bestseller: true,
    new: false,
  },
];

const categories = [
  { id: 'chronograph', name: 'Chronographe' },
  { id: 'classic', name: 'Classique' },
  { id: 'sport', name: 'Sport' },
  { id: 'diving', name: 'Plongée' },
  { id: 'skeleton', name: 'Squelette' },
  { id: 'vintage', name: 'Vintage' },
];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    let matchesCategory = true;
    if (activeFilters.length > 0) {
      matchesCategory = activeFilters.some(filter => 
        product.category.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    return matchesSearch && matchesPrice && matchesCategory;
  });
  
  const toggleCategory = (categoryName: string) => {
    if (activeFilters.includes(categoryName)) {
      setActiveFilters(activeFilters.filter(cat => cat !== categoryName));
    } else {
      setActiveFilters([...activeFilters, categoryName]);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 10000]);
    setActiveFilters([]);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Notre Boutique" 
            subtitle="Découvrez notre collection complète de montres d'exception." 
          />
          
          {/* Filters section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="w-full md:w-1/3 relative">
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </Button>
              
              {(searchTerm || priceRange[0] > 0 || priceRange[1] < 10000 || activeFilters.length > 0) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>
          
          {/* Expanded filters */}
          {showFilters && (
            <motion.div 
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm mb-8 border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Prix</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 10000]}
                      min={0}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(priceRange[0])}</span>
                      <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Catégories</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={category.id}
                          checked={activeFilters.includes(category.name)}
                          onCheckedChange={() => toggleCategory(category.name)}
                        />
                        <Label htmlFor={category.id}>{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredProducts.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
              <Button onClick={clearFilters}>Réinitialiser les filtres</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
