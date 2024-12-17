import axios from "axios";
import { Official, VotingList, VoteRecord } from "@/types";

const BASE_URL = "https://xer.pascalito.com.ar/items";

export const api = {
  async validateOfficial(dni: string): Promise<Official> {
    const response = await axios.get(`${BASE_URL}/fiscales?filter[dni][_eq]=${dni}`);
    if (!response.data.data?.length) {
      throw new Error("Invalid DNI - Official not found");
    }
    return response.data.data[0];
  },

  async getVotingLists(): Promise<VotingList[]> {
    const response = await axios.get(`${BASE_URL}/listas`);
    return response.data.data;
  },

  async submitVotes(votes: VoteRecord[]): Promise<void> {
    await Promise.all(
      votes.map(vote => 
        axios.post(`${BASE_URL}/votos`, vote)
      )
    );
  }
};
