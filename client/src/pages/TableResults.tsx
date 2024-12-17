import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { VotingList } from "@/types";
import { api } from "@/lib/api";

interface SearchForm {
  mesa: string;
}

export function TableResults() {
  const [searchMesa, setSearchMesa] = useState<string>("");
  const { register, handleSubmit } = useForm<SearchForm>();

  const { data: votingLists } = useQuery({
    queryKey: ["votingLists"],
    queryFn: api.getVotingLists,
  });

  const { data: tableVotes, isLoading } = useQuery({
    queryKey: ["tableVotes", searchMesa],
    queryFn: () => api.getTableVotes(searchMesa),
    enabled: !!searchMesa
  });

  const onSubmit = (data: SearchForm) => {
    setSearchMesa(data.mesa);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Consulta por Mesa</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="mesa">Número de Mesa</Label>
              <Input
                id="mesa"
                {...register("mesa", {
                  required: "El número de mesa es requerido"
                })}
                placeholder="Ingrese el número de mesa"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : tableVotes && tableVotes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#64748B]">
                <TableHead className="text-white font-bold">Lista</TableHead>
                <TableHead className="text-white font-bold text-right">Votos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableVotes.map((vote) => {
                const list = votingLists?.find(l => l.id.toString() === vote.lista);
                return (
                  <TableRow key={vote.lista}>
                    <TableCell>
                      <span 
                        className="px-4 py-1 rounded"
                        style={{
                          backgroundColor: list?.color,
                          color: list?.color ? (isLightColor(list.color) ? '#000' : '#fff') : 'inherit'
                        }}
                      >
                        {list?.nombre || vote.lista}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{vote.cantidad}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : searchMesa && (
          <p className="text-center text-muted-foreground">No se encontraron votos para la mesa {searchMesa}</p>
        )}
      </CardContent>
    </Card>
  );
}

function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 128;
}
