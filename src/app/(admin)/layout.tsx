"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  session?: Session; // passer la session si disponible
}

export default function AdminLayout({ children, session }: AdminLayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Gestion responsive de la marge principale
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col xl:flex-row">
        {/* Sidebar et Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Contenu principal */}
        <div
          className={`flex-1 transition-all duration-300 relative ease-in-out ${mainContentMargin} overflow-x-hidden`}
        >
          {/* Header */}
          <AppHeader />
          {/* Contenu de la page */}
          <main className="p-4 sm:p-6 lg:p-8 mx-auto max-w-7xl w-full">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
