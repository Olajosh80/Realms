"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/supabase";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) throw updateError;
      
      setSuccess(`Order status updated to ${newStatus}`);
      await fetchOrders();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating order:', err);
      setError(err.message || 'Failed to update order status. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Orders Management</h2>
        
        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b dark:border-gray-700">
              <tr className="text-left">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <td className="p-4 font-mono text-xs">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="p-4 font-medium">{order.customer_name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{order.customer_email}</td>
                  <td className="p-4">{order.order_items?.length || 0} items</td>
                  <td className="p-4 font-semibold">${parseFloat(order.total_amount).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingOrder === order.id}
                        className={`px-2 py-1 text-xs rounded-lg font-medium ${getStatusColor(order.status)} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingOrder === order.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                      order.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {filter !== 'all' 
                      ? `No ${filter} orders found.`
                      : 'No orders found. Start processing orders to see them here.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
          <div className="text-2xl font-bold mt-1">{orders.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          <div className="text-2xl font-bold mt-1 text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Processing</div>
          <div className="text-2xl font-bold mt-1 text-blue-600">
            {orders.filter(o => o.status === 'processing').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Delivered</div>
          <div className="text-2xl font-bold mt-1 text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
        </div>
      </div>
    </div>
  );
}
