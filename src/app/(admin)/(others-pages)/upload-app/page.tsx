"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getAppVersions } from "@/app/actions/backoffice";
import { AppVersion } from "@/app/lib/types";

import { useEffect, useState } from "react";
import AppVersionTable from "@/components/tables/appVersion/app-version-table";

export default function GestionAppVersions() {
  const [appVersions, setAppVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchAppVersions() {
      try {
        const data = await getAppVersions();
        if (isMounted) {
          setAppVersions(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    }

    fetchAppVersions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <PageBreadcrumb pageTitle="Liste des versions de l'application" />
      <div className="mt-10">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        ) : (
          <AppVersionTable appVersions={appVersions} />
        )}
      </div>
    </div>
  );
}
