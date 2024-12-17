export interface Official {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
}

export interface VotingList {
  id: number;
  nombre: string;
  color: string;
}

export interface VoteRecord {
  id_fiscal: number;
  id_lista: number;
  cantidad: number;
}
