import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { VotingList, VoteRecord } from "@/types";

interface VoteSummaryProps {
  votes: VoteRecord[];
  lists: VotingList[];
  onClose: () => void;
}

export function VoteSummary({ votes, lists, onClose }: VoteSummaryProps) {
  const totalVotes = votes.reduce((sum, vote) => sum + vote.cantidad, 0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#2C4A6E] text-white p-4 mb-4 rounded-t-lg">
        <h2 className="text-2xl font-bold text-center">Carga Realizada Correctamente</h2>
        <p className="text-center mt-2">Mesa N° {votes[0]?.mesa}</p>
      </div>
      
      <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#64748B]">
              <TableHead className="text-white font-bold">Lista</TableHead>
              <TableHead className="text-white font-bold text-right">Votos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {votes.map((vote, index) => {
              const list = lists.find(l => l.id.toString() === vote.lista);
              return (
                <TableRow 
                  key={vote.lista}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <TableCell className="font-medium">
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
            <TableRow className="bg-[#E2E8F0] font-bold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{totalVotes}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="p-4 flex justify-center">
          <Button 
            onClick={onClose}
            className="bg-[#2C4A6E] hover:bg-[#1E3A5F]"
          >
            Realizar Nueva Carga
          </Button>
        </div>
      </div>
    </div>
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
