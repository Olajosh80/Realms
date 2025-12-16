"use client";
import React, { useState, useEffect } from "react";
import AddGoodsForm from "@/components/admin/AddGoodsForm";
import GoodsTable from "@/components/admin/GoodsTable";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/supabase";

export default function GoodsPage() {
  const [goods, setGoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, division:divisions(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoods(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product
  const handleAddGood = async (newGood: any) => {
    try {
      const productData = {
        name: newGood.name,
        slug: newGood.name.toLowerCase().replace(/\s+/g, '-'),
        description: newGood.description || '',
        price: parseFloat(newGood.price),
        compare_at_price: newGood.discount ? parseFloat(newGood.price) * (1 + parseFloat(newGood.discount) / 100) : null,
        images: newGood.image ? [newGood.image] : [],
        category: newGood.category,
        division_id: null, // You can add division selector
        in_stock: newGood.status === 'Active',
        featured: false,
        tags: Array.isArray(newGood.tags) ? newGood.tags : [],
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchProducts(); // Refresh list
      alert('Product added successfully!');
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert('Failed to add product: ' + error.message);
    }
  };

  // Delete a product
  const handleDeleteGood = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProducts(); // Refresh list
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Manage Products</h1>
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <AddGoodsForm onAddGood={handleAddGood} />
          <GoodsTable goods={goods} onDelete={handleDeleteGood} />
        </div>
      )}
    </div>
  );
}
