import axios from "axios";
import { Official, VotingList, VoteRecord } from "@/types";

const BASE_URL = "https://xer.pascalito.com.ar/items";
const API_KEY = import.meta.env.VITE_DIRECTUS_API_KEY;

if (!API_KEY) {
  throw new Error("Directus API key is not configured");
}

const axiosInstance = axios.create({
  headers: {
    'Authorization': API_KEY
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
    await Promise.all(
      votes.map(vote => 
        axiosInstance.post(`${BASE_URL}/votos`, vote)
      )
    );
  }
};
