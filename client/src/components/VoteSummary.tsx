import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface VoteSummaryProps {
  onClose: () => void;
}

export function VoteSummary({ onClose }: VoteSummaryProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold">Carga Realizada Correctamente</h2>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-6">
          Los votos han sido registrados exitosamente en el sistema.
        </p>
        <div className="flex justify-center">
          <Button onClick={onClose}>Realizar Nueva Carga</Button>
        </div>
      </CardContent>
    </Card>
  );
}
