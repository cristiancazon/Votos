import axios from "axios";
import { Official, VotingList, VoteRecord } from "@/types";

const BASE_URL = "https://xer.pascalito.com.ar/items";
const API_KEY = import.meta.env.VITE_DIRECTUS_API_KEY;

if (!API_KEY) {
  throw new Error("Directus API key is not configured");
}

const axiosInstance = axios.create({
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
});

export const api = {
  async validateOfficial(dni: string): Promise<Official> {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/fiscales`, {
        params: {
          filter: {
            dni: {
              _eq: dni
            }
          }
        }
      });
      
      if (!response.data.data?.length) {
        throw new Error("DNI no encontrado - Fiscal no registrado");
      }
      return response.data.data[0];
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Error de autenticación con Directus");
      }
      throw error;
    }
  },

  async getVotingLists(): Promise<VotingList[]> {
    const response = await axiosInstance.get(`${BASE_URL}/listas`, {
      params: {
        fields: ['id', 'nombre', 'color']
      }
    });
    return response.data.data;
  },

  async submitVotes(votes: VoteRecord[]): Promise<void> {
    // First create a single vote record
    const voteResponse = await axiosInstance.post(`${BASE_URL}/votos`, {
      fiscal: votes[0].fiscal,
      mesa: votes[0].mesa,
      line_listas: []
    });
    
    const votoId = voteResponse.data.data.id;
    
    // Then create all list_items related to this vote
    for (const vote of votes) {
      await axiosInstance.post(`${BASE_URL}/list_items`, {
        cantidad: vote.cantidad,
        lista: vote.lista,
        voto: votoId
      });
    }
  },

  async getVoteSummaries(): Promise<{ lista: string; total: number; }[]> {
    const response = await axiosInstance.get(`${BASE_URL}/list_items`, {
      params: {
        fields: ['lista', 'cantidad']
      }
    });
    
    // Agrupar y sumar los votos por lista
    const voteSummaries = response.data.data.reduce((acc: any, item: any) => {
      const lista = item.lista;
      if (!acc[lista]) {
        acc[lista] = 0;
      }
      acc[lista] += item.cantidad;
      return acc;
    }, {});

    return Object.entries(voteSummaries).map(([lista, total]) => ({
      lista,
      total: total as number
    }));
  },

  async getTableVotes(mesa: string): Promise<{ lista: string; cantidad: number; }[]> {
    // Primero obtenemos el voto correspondiente a la mesa
    const votoResponse = await axiosInstance.get(`${BASE_URL}/votos`, {
      params: {
        fields: ['id'],
        filter: {
          mesa: {
            _eq: mesa
          }
        }
      }
    });

    if (!votoResponse.data.data?.length) {
      return [];
    }

    const votoId = votoResponse.data.data[0].id;

    // Luego obtenemos los items de la lista para ese voto
    const response = await axiosInstance.get(`${BASE_URL}/list_items`, {
      params: {
        fields: ['lista', 'cantidad'],
        filter: {
          voto: {
            _eq: votoId
          }
        }
      }
    });
    
    return response.data.data.map((item: any) => ({
      lista: item.lista,
      cantidad: item.cantidad
    }));
  }
};
