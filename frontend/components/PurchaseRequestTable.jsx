"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import {
  getPurchaseRequests,
  getProducts,
  getWarehouses,
  updatePurchaseRequest,
  deletePurchaseRequest,
} from "@/lib/api";
import { toast } from "sonner";
import PurchaseRequestForm from "./PurchaseRequestForm";

export default function PurchaseRequestTable({ isCreateModalOpen, setIsCreateModalOpen }) {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingRequest, setDeletingRequest] = useState(null);

  const { data: purchaseRequests = [], isLoading: isPurchaseRequestsLoading } = useQuery({
    queryKey: ['purchaseRequests'],
    queryFn: async () => {
      const response = await getPurchaseRequests();
      return response.data;
    },
    refetchInterval: 2000,
    onError: (error) => {
      console.error('Failed to fetch purchase requests:', error);
      const errorMessage = error.message || 'Failed to load purchase requests';
      toast.error(errorMessage);
    },
  });

  const { data: availableProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await getProducts();
      return response.data;
    },
    onError: (error) => {
      console.error('Failed to fetch products:', error);
      const errorMessage = error.message || 'Failed to load products';
      toast.error(errorMessage);
    },
  });

  const { data: availableWarehouses = [] } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const response = await getWarehouses();
      return response.data;
    },
    onError: (error) => {
      console.error('Failed to fetch warehouses:', error);
      const errorMessage = error.message || 'Failed to load warehouses';
      toast.error(errorMessage);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await updatePurchaseRequest(id, { status });
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['purchaseRequests'] });

      const previousRequests = queryClient.getQueryData(['purchaseRequests']);

      queryClient.setQueryData(['purchaseRequests'], (old) =>
        old?.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );

      return { previousRequests };
    },
    onSuccess: () => {
      toast.success('Status updated successfully');
      setIsEditAlertOpen(false);
      setEditingRequest(null);
    },
    onError: (error, _variables, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(['purchaseRequests'], context.previousRequests);
      }
      console.error('Failed to update purchase request:', error);
      const errorMessage = error.message || 'Failed to update status';
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseRequests'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await deletePurchaseRequest(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['purchaseRequests'] });

      const previousRequests = queryClient.getQueryData(['purchaseRequests']);

      queryClient.setQueryData(['purchaseRequests'], (old) =>
        old?.filter((request) => request.id !== id)
      );

      return { previousRequests };
    },
    onSuccess: () => {
      toast.success('Purchase request deleted successfully');
      setIsDeleteAlertOpen(false);
      setDeletingRequest(null);
    },
    onError: (error, _variables, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(['purchaseRequests'], context.previousRequests);
      }
      console.error('Failed to delete purchase request:', error);
      const errorMessage = error.message || 'Failed to delete purchase request';
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseRequests'] });
    },
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleEdit = (request) => {
    if (request.status === "DRAFT") {
      setEditingRequest(request);
      setIsEditAlertOpen(true);
    }
  };

  const handleDelete = (request) => {
    setDeletingRequest(request);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingRequest) {
      deleteMutation.mutate(deletingRequest.id);
    }
  };

  const handleConfirmStatusChange = () => {
    if (editingRequest) {
      updateStatusMutation.mutate({
        id: editingRequest.id,
        status: 'PENDING'
      });
    }
  };

  const handlePurchaseRequestSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['purchaseRequests'] });
  };

  const loading = isPurchaseRequestsLoading;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Quantity Total</TableHead>
              <TableHead>Request Date</TableHead>
               <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : purchaseRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No purchase requests found
                </TableCell>
              </TableRow>
            ) : (
              purchaseRequests.map((request, index) => (
                <TableRow key={request.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{request.reference}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{format(new Date(request.createdAt), "dd-MM-yyyy")}</TableCell>
                   <TableCell>{request.status}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(request)}
                          disabled={request.status !== "DRAFT"}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(request)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Reference</p>
                  <p className="text-base">{selectedRequest.reference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantity Total</p>
                  <p className="text-base">{selectedRequest.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Request Date</p>
                  <p className="text-base">{format(new Date(selectedRequest.createdAt), "dd-MM-yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-base">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedRequest.status === "DRAFT" ? "bg-gray-100 text-gray-800" :
                      selectedRequest.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Products</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRequest.purchase_request_item.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{product.product.name}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isEditAlertOpen} onOpenChange={setIsEditAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Status to Pending?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Request?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PurchaseRequestForm
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        availableProducts={availableProducts}
        availableWarehouses={availableWarehouses}
        onSuccess={handlePurchaseRequestSuccess}
      />
    </>
  );
}
