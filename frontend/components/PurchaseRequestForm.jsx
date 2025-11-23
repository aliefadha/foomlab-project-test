"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { createPurchaseRequest } from "@/lib/api";

const purchaseRequestSchema = z.object({
  warehouse: z.string().min(1, "Warehouse is required"),
  requestDate: z.date({
    required_error: "Request date is required",
  }),
  products: z.array(
    z.object({
      productId: z.string().min(1, "Product is required"),
      quantity: z.string().min(1, "Quantity is required").refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        "Quantity must more than 0"
      ),
    })
  ).min(1, "At least one product is required")
  .refine(
    (products) => {
      const productIds = products.map((p) => p.productId);
      return productIds.length === new Set(productIds).size;
    },
    "Products must be unique"
  ),
});

export default function PurchaseRequestForm({
  isOpen,
  onOpenChange,
  availableProducts,
  availableWarehouses,
  onSuccess,
}) {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(purchaseRequestSchema),
    defaultValues: {
      warehouse: "",
      requestDate: undefined,
      products: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      await createPurchaseRequest({
        warehouse_id: parseInt(data.warehouse),
        products: data.products.map(product => ({
          product_id: parseInt(product.productId),
          quantity: parseInt(product.quantity),
        })),
      });

      toast('Purchase request created successfully!');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Failed to create purchase request:', error);
      toast('Failed to create purchase request. Please try again.');
    }
  };

  const handleAddProduct = () => {
    const updated = [...selectedProducts, { productId: "", quantity: "" }];
    setSelectedProducts(updated);
    setValue("products", updated);
  };

  const handleRemoveProduct = (index) => {
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
    setValue("products", updated);
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    setSelectedProducts(updated);
    setValue("products", updated);
  };

  const handleClose = () => {
    reset();
    setSelectedProducts([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Purchase Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse</Label>
              <Controller
                name="warehouse"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="warehouse">
                      <SelectValue placeholder="Select a warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWarehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.warehouse && (
                <p className="text-sm text-red-500">{errors.warehouse.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestDate">Request Date</Label>
              <Controller
                name="requestDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="requestDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.requestDate && (
                <p className="text-sm text-red-500">{errors.requestDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Products</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            {selectedProducts.length > 0 ? (
              <div className="rounded-md border mt-3 max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[150px]">Quantity</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Select
                              value={product.productId}
                              onValueChange={(value) => handleProductChange(index, "productId", value)}
                            >
                              <SelectTrigger className={errors.products?.[index]?.productId ? "border-red-500" : ""}>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableProducts.map((p) => (
                                  <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.products?.[index]?.productId && (
                              <p className="text-xs text-red-500">{errors.products[index].productId.message}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Input
                              type="number"
                              placeholder="0"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                              className={errors.products?.[index]?.quantity ? "border-red-500" : ""}
                            />
                            {errors.products?.[index]?.quantity && (
                              <p className="text-xs text-red-500">{errors.products[index].quantity.message}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No products added.
              </p>
            )}
            {errors.products && (
              <p className="text-sm text-red-500">{errors.products.message}</p>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
