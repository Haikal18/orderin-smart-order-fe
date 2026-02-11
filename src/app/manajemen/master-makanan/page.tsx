'use client';

import { useState } from 'react';
import { useFoods, useDeleteFood } from '@/hooks/food/useFoods';
import { Food } from '@/types/food/food.types';
import FoodTable from '@/components/food/FoodTable';
import CreateFoodDialog from '@/components/food/CreateFoodDialog';
import EditFoodDialog from '@/components/food/EditFoodDialog';
import DeleteFoodDialog from '@/components/food/DeleteFoodDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MasterMakananPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);

    const { data, isLoading, error } = useFoods();
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
            console.log('Makanan berhasil dihapus');
        } catch (error) {
            console.error('Error deleting food:', error);
        } finally {
            setDeleteDialogOpen(false);
            setIdToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Memuat data...</div>
                </div>
            </div>
        );
    }

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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-500">Total Makanan</div>
                    <div className="text-2xl font-bold">{data?.data.length || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-500">Tersedia</div>
                    <div className="text-2xl font-bold text-green-600">
                        {data?.data.filter((f) => f.is_available).length || 0}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-500">Tidak Tersedia</div>
                    <div className="text-2xl font-bold text-red-600">
                        {data?.data.filter((f) => !f.is_available).length || 0}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border p-6">
                <FoodTable
                    data={data?.data || []}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
