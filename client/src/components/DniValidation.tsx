import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Official } from "@/types";
import { api } from "@/lib/api";

interface DniValidationProps {
  onValidated: (official: Official) => void;
}

export function DniValidation({ onValidated }: DniValidationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { dni: "" }
  });

  const onSubmit = async (data: { dni: string }) => {
    setIsLoading(true);
    try {
      const official = await api.validateOfficial(data.dni);
      onValidated(official);
      toast({
        title: "Validation successful",
        description: `Welcome ${official.nombre} ${official.apellido}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al validar el DNI";
      toast({
        title: "Error de Validación",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="bg-[#2C4A6E] text-white rounded-t-lg">
        <h2 className="text-2xl font-bold text-center">Validación de Fiscal</h2>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-[#334155] font-medium">Número de DNI</Label>
              <Input
                id="dni"
                {...register("dni", { 
                  required: "DNI es requerido",
                  pattern: {
                    value: /^\d{7,8}$/,
                    message: "Formato de DNI inválido"
                  }
                })}
                placeholder="Ingrese su DNI"
                className="w-full border-[#94A3B8] focus:border-[#2C4A6E] focus:ring-[#2C4A6E]"
              />
              {errors.dni && (
                <p className="text-sm text-red-500">{errors.dni.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#2C4A6E] hover:bg-[#1E3A5F] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Validando..." : "Validar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
