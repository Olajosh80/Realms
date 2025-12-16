"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, Users, ShoppingCart } from "lucide-react";
import { PencilSquareIcon } from "@heroicons/react/24/outline"

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Manage Goods", href: "/admin/goods", icon: <Package size={18} /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingCart size={18} /> },
    { name: "Users", href: "/admin/users", icon: <Users size={18} /> },
    { name: "Blog", href: "/admin/Blog", icon: <PencilSquareIcon className="w-5 h-5 text-white"/> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="h-screen w-64 bg-gradient-blue dark:border-gray-800 p-5 text-white">
      <h1 className="mb-8 text-xl font-bold text-white">Admin Portal</h1>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-200 hover:text-white hover:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
             
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
