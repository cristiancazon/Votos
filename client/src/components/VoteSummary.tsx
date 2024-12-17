import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { VotingList, VoteRecord } from "@/types";

interface VoteSummaryProps {
  votes: VoteRecord[];
  lists: VotingList[];
  onClose: () => void;
}

export function VoteSummary({ votes, lists, onClose }: VoteSummaryProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold">Carga Realizada Correctamente</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lista</TableHead>
              <TableHead className="text-right">Votos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {votes.map((vote) => {
              const list = lists.find(l => l.id.toString() === vote.lista);
              return (
                <TableRow key={vote.lista}>
                  <TableCell
                    style={{
                      backgroundColor: list?.color,
                      color: list?.color ? (isLightColor(list.color) ? '#000' : '#fff') : 'inherit'
                    }}
                  >
                    {list?.nombre || vote.lista}
                  </TableCell>
                  <TableCell className="text-right">{vote.cantidad}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onClose}>Realizar Nueva Carga</Button>
      </CardFooter>
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
