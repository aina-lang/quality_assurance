
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import { Client } from "@/app/lib/types";
import { deleteClient } from "@/app/actions/backoffice";
import Link from "next/link";

interface ClientTableProps {
  clients: Client[];
}

const ClientTable: React.FC<ClientTableProps> = ({ clients }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [grouping, setGrouping] = useState<string[]>([]);
  const isMounted = useRef<boolean>(true);

  // Track component mount state to prevent state updates on unmounted component
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Global filter function
  const filteredData = useMemo(() => {
    if (!globalFilter) return clients;
    const lowercasedFilter = globalFilter.toLowerCase();
    return clients.filter((client) =>
      Object.values(client).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [clients, globalFilter]);

  const handleDelete = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Vous allez supprimer le client "${name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      reverseButtons: true,
      customClass: {
        popup: "bg-white dark:bg-gray-800 rounded-lg shadow-lg",
        title: "text-lg font-semibold text-gray-800 dark:text-gray-200",
        htmlContainer: "text-gray-600 dark:text-gray-300",
        confirmButton: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
        cancelButton: "bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteClient(id);
        Swal.fire({
          title: "Supprimé !",
          text: "Le client a été supprimé avec succès.",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "bg-green-100 dark:bg-green-800 border-l-4 border-green-500",
            title: "text-green-800 dark:text-green-200 font-medium",
            htmlContainer: "text-green-700 dark:text-green-300",
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Erreur !",
          text: "Impossible de supprimer le client.",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "bg-red-100 dark:bg-red-800 border-l-4 border-red-500",
            title: "text-red-800 dark:text-red-200 font-medium",
            htmlContainer: "text-red-700 dark:text-red-300",
          },
        });
      }
    }
  };

  const columns: ColumnDef<Client>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getRowModel().rows.every((row) =>
            selectedIds.includes(row.original.id)
          )}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (isMounted.current) {
              if (e.target.checked) {
                setSelectedIds(table.getRowModel().rows.map((r) => r.original.id));
              } else {
                setSelectedIds([]);
              }
            }
          }}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (isMounted.current) {
              if (e.target.checked) {
                setSelectedIds((prev) => [...prev, row.original.id]);
              } else {
                setSelectedIds((prev) =>
                  prev.filter((id) => id !== row.original.id)
                );
              }
            }
          }}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
    },
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
      enableColumnFilter: true,
      
      cell: ({ row }) => (
        <span className="font-mono text-gray-700 dark:text-gray-300">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "company_name",
      header: "Nom de l'Entreprise",
      enableSorting: true,
      enableColumnFilter: true,
      enableGrouping: true,
      cell: ({ row }) => (
        <span className="font-medium text-gray-800 dark:text-gray-200">{row.original.company_name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ row }) => (
        <a href={`mailto:${row.original.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
          {row.original.email}
        </a>
      ),
    },
    {
      accessorKey: "account_type",
      header: "Type de Compte",
      enableSorting: true,
      enableColumnFilter: true,
      enableGrouping: true,
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-200">
          {row.original.account_type}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() =>
              Swal.fire({
                title: "Client",
                text: `ID: ${row.original.id}\nEntreprise: ${row.original.company_name}\nEmail: ${row.original.email}`,
                icon: "info",
                position: "center",
                toast: false,
                showConfirmButton: true,
                confirmButtonText: "Fermer",
                customClass: {
                  popup: "bg-white dark:bg-gray-800 rounded-lg shadow-lg",
                  title: "text-lg font-semibold text-gray-800 dark:text-gray-200",
                  htmlContainer: "text-gray-600 dark:text-gray-300",
                  confirmButton: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
                },
              })
            }
            title="Voir"
          >
            <Eye className="h-5 w-5" />
          </button>
          <Link
            href={`/admin/(others-pages)/client/edit?id=${row.original.id}`}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Modifier"
          >
            <Edit className="h-5 w-5" />
          </Link>
          <button
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            onClick={() => handleDelete(row.original.id, row.original.company_name)}
            title="Supprimer"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      grouping,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      if (isMounted.current) {
        setColumnFilters(updater);
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        title: "Aucune sélection",
        text: "Veuillez sélectionner au moins un client.",
        icon: "warning",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500",
          title: "text-yellow-800 dark:text-yellow-200 font-medium",
          htmlContainer: "text-yellow-700 dark:text-yellow-300",
        },
      });
      return;
    }
    const result = await Swal.fire({
      title: `Supprimer ${selectedIds.length} client(s) ?`,
      text: `Vous êtes sur le point de supprimer ${selectedIds.length} client(s).`,
      icon: "warning",
      position: "top-end",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      customClass: {
        popup: "bg-white dark:bg-gray-800 rounded-lg shadow-lg",
        title: "text-lg font-semibold text-gray-800 dark:text-gray-200",
        htmlContainer: "text-gray-600 dark:text-gray-300",
        confirmButton: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
        cancelButton: "bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400",
      },
    });
    if (result.isConfirmed) {
      try {
        // Placeholder for bulk delete API call
        console.log(`Deleting clients with IDs: ${selectedIds}`);
        if (isMounted.current) {
          setSelectedIds([]);
        }
        Swal.fire({
          title: "Supprimé !",
          text: "Les clients sélectionnés ont été supprimés.",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "bg-green-100 dark:bg-green-800 border-l-4 border-green-500",
            title: "text-green-800 dark:text-green-200 font-medium",
            htmlContainer: "text-green-700 dark:text-green-300",
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Erreur !",
          text: "Impossible de supprimer les clients.",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "bg-red-100 dark:bg-red-800 border-l-4 border-red-500",
            title: "text-red-800 dark:text-red-200 font-medium",
            htmlContainer: "text-red-700 dark:text-red-300",
          },
        });
      }
    }
  };

  return (
    <div className=" bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            value={globalFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (isMounted.current) {
                setGlobalFilter(e.target.value);
              }
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
          />
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              if (isMounted.current) {
                setGrouping(e.target.value ? [e.target.value] : []);
              }
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-48"
          >
            <option value="">Aucun groupement</option>
            <option value="company_name">Par Entreprise</option>
            <option value="account_type">Par Type de Compte</option>
          </select>
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <Trash2 className="h-5 w-5" />
            Supprimer ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Aucun client trouvé.
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-gray-100 dark:bg-gray-700">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border-b border-gray-200 dark:border-gray-600 p-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getCanSort() && (
                            <button
                              onClick={header.column.getToggleSortingHandler()}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              {{
                                asc: <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />,
                                desc: <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <ChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                              )}
                            </button>
                          )}
                        </div>
                        {header.column.getCanFilter() && (
                          <input
                            type="text"
                            value={(header.column.getFilterValue() ?? "") as string}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              if (isMounted.current) {
                                header.column.setFilterValue(e.target.value);
                              }
                            }}
                            placeholder={`Filtrer ${header.column.columnDef.header}`}
                            className="mt-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${
                      index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                    } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-gray-200 dark:border-gray-600 p-4 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {"<"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {">>"}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page{" "}
                <strong>
                  {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                </strong>
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  if (isMounted.current) {
                    table.setPageSize(Number(e.target.value));
                  }
                }}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {[10, 20, 50].map((ps: number) => (
                  <option key={ps} value={ps}>
                    Montrer {ps}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientTable;
