import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp } from "lucide-react";

const fetchBabyNames = async () => {
  // Simulating API call
  return [
    { id: 1, name: 'Olivia', votes: 0 },
    { id: 2, name: 'Liam', votes: 0 },
    { id: 3, name: 'Emma', votes: 0 },
    { id: 4, name: 'Noah', votes: 0 },
    { id: 5, name: 'Ava', votes: 0 },
  ];
};

const Index = () => {
  const queryClient = useQueryClient();
  const [votedNames, setVotedNames] = useState(new Set());

  const { data: babyNames, isLoading, isError } = useQuery({
    queryKey: ['babyNames'],
    queryFn: fetchBabyNames,
  });

  const voteMutation = useMutation({
    mutationFn: (nameId) => {
      // Simulating API call
      return Promise.resolve(nameId);
    },
    onSuccess: (nameId) => {
      queryClient.setQueryData(['babyNames'], (oldData) => {
        return oldData.map((name) =>
          name.id === nameId ? { ...name, votes: name.votes + 1 } : name
        );
      });
      setVotedNames((prev) => new Set(prev).add(nameId));
    },
  });

  const handleVote = (nameId) => {
    if (!votedNames.has(nameId)) {
      voteMutation.mutate(nameId);
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">Error fetching baby names</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Baby Name Voting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {babyNames.map((name) => (
          <Card key={name.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{name.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl mb-4">Votes: {name.votes}</p>
              <Button
                onClick={() => handleVote(name.id)}
                disabled={votedNames.has(name.id)}
                className="w-full"
              >
                <ThumbsUp className="mr-2 h-4 w-4" /> Vote
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
