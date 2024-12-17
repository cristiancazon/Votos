import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { VotingList } from "@/types";
import { api } from "@/lib/api";

interface VoteSummary {
  lista: string;
  total: number;
}

export function Dashboard() {
  const { data: votingLists } = useQuery({
    queryKey: ["votingLists"],
    queryFn: api.getVotingLists,
  });

  const { data: voteSummaries, isLoading } = useQuery({
    queryKey: ["voteSummaries"],
    queryFn: api.getVoteSummaries,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Resumen Total de Votos</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#64748B]">
            <TableHead className="text-white font-bold">Lista</TableHead>
            <TableHead className="text-white font-bold text-right">Total de Votos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voteSummaries?.map((summary: VoteSummary, index: number) => {
            const list = votingLists?.find(l => l.id.toString() === summary.lista);
            return (
              <TableRow 
                key={summary.lista}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <TableCell>
                  <span 
                    className="px-4 py-1 rounded"
                    style={{
                      backgroundColor: list?.color,
                      color: list?.color ? (isLightColor(list.color) ? '#000' : '#fff') : 'inherit'
                    }}
                  >
                    {list?.nombre || summary.lista}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{summary.total}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
