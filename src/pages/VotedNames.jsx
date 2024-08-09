import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VotedNames = () => {
  const [filter, setFilter] = useState('all');
  const { data: votedNames, isLoading, isError } = useQuery({
    queryKey: ['votedNames'],
    queryFn: () => {
      const votes = JSON.parse(localStorage.getItem('votedNames') || '[]');
      // Create a map to store the most recent vote for each name
      const uniqueVotes = new Map();
      votes.forEach(vote => uniqueVotes.set(vote.id, vote));
      return Array.from(uniqueVotes.values());
    },
  });

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">Error fetching voted names</div>;

  const filteredNames = votedNames?.filter(vote => {
    if (filter === 'liked') return vote.liked;
    if (filter === 'disliked') return !vote.liked;
    return true;
  });

  return (
    <div>
      <Tabs value={filter} onValueChange={setFilter} className="w-full max-w-md mx-auto mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
          <TabsTrigger value="disliked">Disliked</TabsTrigger>
        </TabsList>
      </Tabs>
      {filteredNames && filteredNames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNames.map((vote) => (
            <Card key={vote.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">{vote.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {vote.liked ? (
                  <ThumbsUp className="text-green-500 h-6 w-6" />
                ) : (
                  <ThumbsDown className="text-red-500 h-6 w-6" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNames && filteredNames.length === 0 ? (
        <p className="text-center">No {filter === 'all' ? 'voted' : filter} names found.</p>
      ) : (
        <p className="text-center">No voted names yet.</p>
      )}
    </div>
  );
};

export default VotedNames;
