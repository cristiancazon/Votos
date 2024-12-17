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
  fiscal: string;
  mesa: string;
  lista: string;
  cantidad: number;
  voto?: string;
}
