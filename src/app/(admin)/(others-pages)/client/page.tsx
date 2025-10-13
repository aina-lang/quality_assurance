"use client";;
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getClients } from "@/app/actions/backoffice";
import { Client } from "@/app/lib/types";
import ClientTable from "@/components/tables/client/client-table";
import { useEffect, useState } from "react";

export default function GestionClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchClients() {
      try {
        const data = await getClients();
        if (isMounted) {
          setClients(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchClients();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <PageBreadcrumb pageTitle="Liste clients" />
      <div className="overflow-x-auto mt-10">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <ClientTable clients={clients} />
        )}
      </div>
    </div>
  );
}
