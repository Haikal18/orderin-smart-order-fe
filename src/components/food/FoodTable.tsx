'use client';

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Food } from '@/types/food/food.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface ServerPaginationMeta {
    page: number;
    per_page: number;
    last_page: number;
    total: number;
}

interface ServerSearchProps {
    value: string;
    onChange: (v: string) => void;
    isLoading?: boolean;
}

interface FoodTableProps {
    data: Food[];
    onEdit: (food: Food) => void;
    onDelete: (id: number) => void;
    /**
     * If provided, FoodTable will render server-side pagination controls and
     * call onServerPageChange when the page changes.
     */
    serverPagination?: {
        meta: ServerPaginationMeta;
        onServerPageChange: (page: number) => void;
        /** optional callback to change items per page */
        onPerPageChange?: (perPage: number) => void;
    };
    serverSearch?: ServerSearchProps;
    isFetching?: boolean;
}

export default function FoodTable({ data, onEdit, onDelete, serverPagination, serverSearch, isFetching }: FoodTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns: ColumnDef<Food>[] = [
        {
            accessorKey: 'image_url',
            header: 'Gambar',
            cell: ({ row }) => {
                const imageUrl = row.getValue('image_url') as string | null;
                return (
                    <div className="w-16 h-16 relative">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={row.original.name}
                                fill
                                className="object-cover rounded"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nama
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'category',
            header: 'Kategori',
            cell: ({ row }) => {
                const category = row.getValue('category') as string;
                const categoryLabels: Record<string, string> = {
                    food: 'Makanan',
                    beverage: 'Minuman',
                    dessert: 'Dessert',
                };
                return (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {categoryLabels[category] || category}
                    </span>
                );
            },
        },
        {
            accessorKey: 'price',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Harga
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const price = parseFloat(row.getValue('price'));
                const formatted = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                }).format(price);
                return <div className="font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: 'is_available',
            header: 'Status',
            cell: ({ row }) => {
                const isAvailable = row.getValue('is_available') as boolean;
                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs ${
                            isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(row.original)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(row.original.id)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    // When serverPagination is provided we control pagination state so
    // React Table's pageIndex/pageSize reflect the server values and the
    // table shows the expected number of rows.
    const controlledPagination = serverPagination
        ? { pageIndex: Math.max(0, serverPagination.meta.page - 1), pageSize: serverPagination.meta.per_page }
        : undefined;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        // keep table pagination in sync with server when server-side pagination is active
        state: {
            sorting,
            columnFilters,
            ...(controlledPagination ? { pagination: controlledPagination } : {}),
        },
    });

    return (
        <div className="space-y-4 relative">
            <div className="flex items-center gap-4">
                {serverSearch ? (
                    <div className="relative max-w-sm w-full">
                        <Input
                            placeholder="Cari nama makanan..."
                            value={serverSearch.value}
                            onChange={(e) => serverSearch.onChange(e.target.value)}
                            className="w-full"
                        />
                        {serverSearch.isLoading && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-slate-700" />
                            </div>
                        )}
                    </div>
                ) : (
                    <Input
                        placeholder="Cari nama makanan..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn('name')?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </div>

            <div className="rounded-md border overflow-x-auto relative">
                {/* show full-table overlay only for page/initial fetches — not for server-side search */}
                {isFetching && !(serverSearch?.isLoading) && (
                    <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
                    </div>
                )}

                <table className="w-full min-w-[700px]">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b bg-gray-50">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-4 py-3 text-left">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="h-24 text-center text-gray-500"
                                >
                                    Tidak ada data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                {serverPagination ? (
                    <>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <div className="text-sm text-gray-700">
                                Halaman {serverPagination.meta.page} dari {serverPagination.meta.last_page} — {` `}{serverPagination.meta.total} item
                            </div>

                            {serverPagination.onPerPageChange && (
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-slate-600">Items per page</label>
                                    <div className="w-28">
                                        <Select value={String(serverPagination.meta.per_page)} onValueChange={(v) => serverPagination.onPerPageChange?.(Number(v))}>
                                            <SelectTrigger>
                                                <span className="px-2">{serverPagination.meta.per_page}</span>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                                <SelectItem value="100">100</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => serverPagination.onServerPageChange(serverPagination.meta.page - 1)}
                                disabled={serverPagination.meta.page <= 1 || isFetching}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => serverPagination.onServerPageChange(serverPagination.meta.page + 1)}
                                disabled={serverPagination.meta.page >= serverPagination.meta.last_page || isFetching}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-sm text-gray-700">Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}</div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
