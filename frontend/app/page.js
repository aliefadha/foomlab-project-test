"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductTable from "@/components/ProductTable";
import PurchaseRequestTable from "@/components/PurchaseRequestTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "products";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleTabChange = (value) => {
    router.push(`/?tab=${value}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="purchaseRequests">Purchase Request</TabsTrigger>
          </TabsList>
          {tab === "purchaseRequests" && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Purchase Request
            </Button>
          )}
        </div>
        <TabsContent value="products">
          <ProductTable />
        </TabsContent>
        <TabsContent value="purchaseRequests">
          <PurchaseRequestTable
            isCreateModalOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
