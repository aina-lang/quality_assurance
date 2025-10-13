"use client";

import { Client } from "@/app/lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import Swal from "sweetalert2";
import { deleteClient } from "@/app/actions/backoffice";
import { Trash2, Edit2, Eye } from "lucide-react";

const columnHelper = createColumnHelper<Client>();

export const clientColumns = (
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
    // columnHelper.accessor("id", { header: "ID", enableSorting: true }),
    columnHelper.accessor("company_name", { header: "Nom de l'Entreprise", enableSorting: true }),
    columnHelper.accessor("email", { header: "Email", enableSorting: true }),
    columnHelper.accessor("account_type", { header: "Type de Compte", enableSorting: true }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleDelete = async (id: number, name: string) => {
          const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: `Vous allez supprimer le client "${name}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
            reverseButtons: true,
          });

          if (result.isConfirmed) {
            try {
              await deleteClient(id);
              new Audio("/sounds/notification.mp3").play(); // Son de notification
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Client supprimé !",
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
            <a href={`/admin/(others-pages)/client/view?id=${row.original.id}`} title="Voir">
              <Eye className="w-5 h-5 text-blue-600 hover:text-blue-700" />
            </a>
            <a href={`/admin/(others-pages)/client/edit?id=${row.original.id}`} title="Modifier">
              <Edit2 className="w-5 h-5 text-green-600 hover:text-green-700" />
            </a>
            <button
              onClick={() => handleDelete(row.original.id, row.original.company_name)}
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5 text-red-600 hover:text-red-700" />
            </button>
          </div>
        );
      },
    }),
  ];
