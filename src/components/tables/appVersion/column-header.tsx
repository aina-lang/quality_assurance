"use client";

import { AppVersion } from "@/app/lib/types"; // Assure-toi que le type est correct
import { createColumnHelper } from "@tanstack/react-table";
import Swal from "sweetalert2";
import { deleteAppVersion } from "@/app/actions/backoffice";
import { Trash2, Edit2, Eye, Download } from "lucide-react";

const columnHelper = createColumnHelper<AppVersion>();

export const appVersionColumns = (
  selectedIds: number[],
  setSelectedIds: (ids: number[]) => void
) => [
    // Multi-sélection
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getRowModel().rows.every(row => selectedIds.includes(row.original.id))}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(table.getRowModel().rows.map(row => row.original.id));
            } else {
              setSelectedIds([]);
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds([...selectedIds, row.original.id]);
            } else {
              setSelectedIds(selectedIds.filter(id => id !== row.original.id));
            }
          }}
        />
      ),
    }),

    columnHelper.accessor("os", { header: "OS", enableSorting: true }),
    columnHelper.accessor("version", { header: "Version", enableSorting: true }),
    columnHelper.accessor("size", {
      header: "Taille",
      enableSorting: true,
    }),
    columnHelper.accessor("cpu_requirement", { header: "CPU", enableSorting: true }),
    columnHelper.accessor("ram_requirement", { header: "RAM", enableSorting: true }),
    columnHelper.accessor("storage_requirement", { header: "Stockage", enableSorting: true }),
    columnHelper.display({
      id: "download",
      header: "Télécharger",
      cell: ({ row }) => (
        <a
          href={row.original.download_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
        >
          <Download className="w-4 h-4" />
          <span>Télécharger</span>
        </a>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleDelete = async (id: number) => {
          const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: `Vous allez supprimer la version "${row.original.version}" pour ${row.original.os}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
            reverseButtons: true,
          });

          if (result.isConfirmed) {
            try {
              await deleteAppVersion(id);
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Version supprimée !",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
            } catch (error) {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Erreur lors de la suppression !",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
            }
          }
        };

        return (
          <div className="flex space-x-2">
            <a
              href={`/admin/backoffice/app-versions/view?id=${row.original.id}`}
              title="Voir"
            >
              <Eye className="w-5 h-5 text-blue-600 hover:text-blue-700" />
            </a>
            <a
              href={`/admin/backoffice/app-versions/edit?id=${row.original.id}`}
              title="Modifier"
            >
              <Edit2 className="w-5 h-5 text-green-600 hover:text-green-700" />
            </a>
            <button onClick={() => handleDelete(row.original.id)} title="Supprimer">
              <Trash2 className="w-5 h-5 text-red-600 hover:text-red-700" />
            </button>
          </div>
        );
      },
    }),
  ];
