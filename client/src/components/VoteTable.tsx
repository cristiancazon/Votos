import { useEffect } from "react";
function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 128;
}

import { useForm } from "react-hook-form";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { VotingList, Official, VoteRecord } from "@/types";

interface VoteTableProps {
  lists: VotingList[];
  official: Official;
  onSubmit: (votes: VoteRecord[]) => void;
  isSubmitting: boolean;
}

export function VoteTable({ lists, official, onSubmit, isSubmitting }: VoteTableProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Record<string, number>>({
    defaultValues: lists.reduce((acc, list) => ({
      ...acc,
      [list.id.toString()]: 0
    }), {} as Record<string, number>)
  });

  useEffect(() => {
    reset();
  }, [lists, reset]);

  const onSubmitForm = (data: Record<string, number>) => {
    const votes: VoteRecord[] = Object.entries(data)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([id_lista, cantidad]) => ({
        id_fiscal: official.id,
        lista_id: parseInt(id_lista),
        cantidad
      }));
    onSubmit(votes);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-2xl font-bold">Vote Recording</h2>
        <p className="text-sm text-muted-foreground">
          Official: {official.nombre} {official.apellido}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead>Lista</TableHead>
                  <TableHead>Votos</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {lists.map((list) => (
                <TableRow key={list.id}>
                  <TableCell 
                    style={{ 
                      backgroundColor: list.color,
                      color: isLightColor(list.color) ? '#000' : '#fff'
                    }}
                  >
                    {list.nombre}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      {...register(`${list.id}`, {
                        required: "Required",
                        min: { value: 0, message: "Must be positive" },
                        valueAsNumber: true
                      })}
                      className="w-24"
                    />
                    {errors[list.id] && (
                      <p className="text-sm text-red-500">{errors[list.id]?.message}</p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Votes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}