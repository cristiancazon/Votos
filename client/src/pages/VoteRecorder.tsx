import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DniValidation } from "@/components/DniValidation";
import { VoteTable } from "@/components/VoteTable";
import { VoteSummary } from "@/components/VoteSummary";
import { Official, VoteRecord } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function VoteRecorder() {
  const [official, setOfficial] = useState<Official | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [submittedVotes, setSubmittedVotes] = useState<VoteRecord[]>([]);
  const { toast } = useToast();

  const { data: votingLists, isLoading } = useQuery({
    queryKey: ["votingLists"],
    queryFn: api.getVotingLists,
    enabled: !!official
  });

  const { mutate: submitVotes, isPending } = useMutation({
    mutationFn: (votes: VoteRecord[]) => {
      setSubmittedVotes(votes);
      return api.submitVotes(votes);
    },
    onSuccess: () => {
      setShowSummary(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record votes. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleNewVote = () => {
    setShowSummary(false);
    setOfficial(null);
    setSubmittedVotes([]);
  };

  if (showSummary && votingLists) {
    return <VoteSummary votes={submittedVotes} lists={votingLists} onClose={handleNewVote} />;
  }

  if (!official) {
    return <DniValidation onValidated={setOfficial} />;
  }

  if (isLoading || !votingLists) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <VoteTable
      lists={votingLists}
      official={official}
      onSubmit={submitVotes}
      isSubmitting={isPending}
    />
  );
}
