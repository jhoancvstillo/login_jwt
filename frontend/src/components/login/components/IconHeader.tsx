import { CardTitle, CardDescription } from "@/components/ui/card";
import { UtensilsCrossed } from 'lucide-react';

export default function IconHeader() {
  return (
    <>
      <div className="flex justify-center mb-4">
        <UtensilsCrossed className="h-12 w-12 text-amber-500" />
      </div>
      <CardTitle className="text-3xl font-bold text-amber-500">RestaurantOS</CardTitle>
      <CardDescription className="text-gray-400">
        Ingresa a tu cuenta para gestionar tu restaurante
      </CardDescription>
    </>
  );
}
