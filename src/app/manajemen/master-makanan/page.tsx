'use client';

import { useState, useEffect } from 'react';
import { useFoods, useDeleteFood } from '@/hooks/food/useFoods';
import { Food } from '@/types/food/food.types';
import FoodTable from '@/components/food/FoodTable';
import CreateFoodDialog from '@/components/food/CreateFoodDialog';
import EditFoodDialog from '@/components/food/EditFoodDialog';
import DeleteFoodDialog from '@/components/food/DeleteFoodDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useDebounce } from '@/hooks/useDebounce';

export default function MasterMakananPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);

    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [search, setSearch] = useState<string>('');

    const debouncedSearch = useDebounce(search, 150);

    const { data, isFetching, error } = useFoods({ page, per_page: perPage, search: debouncedSearch });

    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (debouncedSearch !== '') setIsSearching(true);
        else setIsSearching(false);
    }, [debouncedSearch]);

    useEffect(() => {
        if (!isFetching) setIsSearching(false);
    }, [isFetching]);
    const deleteMutation = useDeleteFood();

    const handleEdit = (food: Food) => {
        setSelectedFood(food);
        setEditDialogOpen(true);
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setIdToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (idToDelete === null) return;
        try {
            await deleteMutation.mutateAsync(idToDelete);
            showSuccessToast('Makanan berhasil dihapus');
        } catch (error) {
            showErrorToast(error);
        } finally {
            setDeleteDialogOpen(false);
            setIdToDelete(null);
        }
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-500">
                        Error: {error instanceof Error ? error.message : 'Terjadi kesalahan'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Master Makanan</h1>
                    <p className="text-gray-500 mt-1">
                        Kelola data makanan dan minuman di sini
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Makanan
                </Button>
            </div>

            <div className="flex items-center justify-between mt-4 gap-4">
                <div />
                <div className="flex-1 max-w-sm">
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-500">Total Makanan</div>
                    <div className="text-2xl font-bold">{data?.meta?.total ?? data?.data.length ?? 0}</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border p-6">
                <FoodTable
                    data={data?.data || []}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isFetching={isFetching}
                    serverSearch={{ value: search, onChange: (v) => { setSearch(v); setPage(1); }, isLoading: isSearching }}
                    serverPagination={data?.meta ? {
                        meta: {
                            page: data.meta.current_page,
                            per_page: data.meta.per_page,
                            last_page: data.meta.last_page,
                            total: data.meta.total,
                        },
                        onServerPageChange: (p: number) => setPage(p),
                        onPerPageChange: (pp: number) => { setPerPage(pp); setPage(1); }
                    } : undefined}
                />
            </div>

            {/* Dialogs */}
            <CreateFoodDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
            <EditFoodDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                food={selectedFood}
            />

            {/* Delete confirmation dialog */}
            <DeleteFoodDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                itemName={data?.data.find((f) => f.id === idToDelete)?.name || null}
            />
        </div>
    );
}
