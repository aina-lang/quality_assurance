"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    useReactTable,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Download } from "lucide-react";
import { AppVersion } from "@/app/lib/types"; // Type pour app_versions
import { deleteAppVersion } from "@/app/actions/backoffice";
import Link from "next/link";

interface AppVersionTableProps {
    appVersions: AppVersion[];
}

const AppVersionTable: React.FC<AppVersionTableProps> = ({ appVersions }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [grouping, setGrouping] = useState<string[]>([]);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const filteredData = useMemo(() => {
        if (!globalFilter) return appVersions;
        const lowercasedFilter = globalFilter.toLowerCase();
        return appVersions.filter((v) =>
            Object.values(v).some(
                (value) =>
                    value !== null &&
                    value !== undefined &&
                    value.toString().toLowerCase().includes(lowercasedFilter)
            )
        );
    }, [appVersions, globalFilter]);

    const handleDelete = async (id: number, version: string, os: string) => {
        const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: `Vous allez supprimer la version "${version}" pour ${os}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
        });

        if (result.isConfirmed) {
            try {
                await deleteAppVersion(id);
                Swal.fire({
                    title: "Supprimé !",
                    text: "La version a été supprimée avec succès.",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 2000,
                });
            } catch (error) {
                Swal.fire({
                    title: "Erreur !",
                    text: "Impossible de supprimer la version.",
                    icon: "error",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        }
    };

    const columns: ColumnDef<AppVersion>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getRowModel().rows.every(row => selectedIds.includes(row.original.id))}
                    onChange={(e) => {
                        if (e.target.checked) setSelectedIds(table.getRowModel().rows.map(r => r.original.id));
                        else setSelectedIds([]);
                    }}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.original.id)}
                    onChange={(e) => {
                        if (e.target.checked) setSelectedIds([...selectedIds, row.original.id]);
                        else setSelectedIds(selectedIds.filter(id => id !== row.original.id));
                    }}
                />
            ),
        },
        { accessorKey: "id", header: "ID" },
        { accessorKey: "os", header: "OS" },
        { accessorKey: "version", header: "Version" },
        {
            accessorKey: "size",
            header: "Taille",
            cell: info => {
                const size = Number(info.getValue());
                if (size < 1024) return size + " B";
                const kb = size / 1024;
                if (kb < 1024) return kb.toFixed(2) + " KB";
                const mb = kb / 1024;
                if (mb < 1024) return mb.toFixed(2) + " MB";
                const gb = mb / 1024;
                return gb.toFixed(2) + " GB";
            }
        },
        { accessorKey: "cpu_requirement", header: "CPU" },
        { accessorKey: "ram_requirement", header: "RAM" },
        { accessorKey: "storage_requirement", header: "Stockage" },
        {
            id: "download",
            header: "Télécharger",
            cell: ({ row }) => (
                <a href={row.original.download_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                </a>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link href={`/admin/backoffice/app-versions/edit?id=${row.original.id}`} title="Modifier" className="text-green-600 hover:text-green-800">
                        <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(row.original.id, row.original.version, row.original.os)} className="text-red-600 hover:text-red-800" title="Supprimer">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { sorting, columnFilters, columnVisibility, grouping },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGroupingChange: setGrouping,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    className="border rounded px-3 py-1 w-full sm:w-64"
                />
                {selectedIds.length > 0 && (
                    <button onClick={() => console.log("Bulk delete", selectedIds)} className="bg-red-600 text-white px-3 py-1 rounded">
                        Supprimer ({selectedIds.length})
                    </button>
                )}

                <Link href={"/upload-app/add"}>
                    Uploader une nouvelle version de QA APP
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="border-b px-4 py-2 text-left">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, idx) => (
                            <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="border-b px-4 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination simplifiée */}
            <div className="flex justify-between mt-4">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 border rounded">Précédent</button>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 border rounded">Suivant</button>
            </div>
        </div>
    );
};

export default AppVersionTable;
