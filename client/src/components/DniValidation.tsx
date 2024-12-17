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
      toast({
        title: "Validation failed",
        description: "Please check your DNI and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Election Official Validation</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI Number</Label>
              <Input
                id="dni"
                {...register("dni", { 
                  required: "DNI is required",
                  pattern: {
                    value: /^\d{7,8}$/,
                    message: "Invalid DNI format"
                  }
                })}
                placeholder="Enter your DNI"
                className="w-full"
              />
              {errors.dni && (
                <p className="text-sm text-red-500">{errors.dni.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Validating..." : "Validate"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
