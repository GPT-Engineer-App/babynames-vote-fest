import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const VotedNames = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: votedNames, isLoading, isError } = useQuery({
    queryKey: ['votedNames'],
    queryFn: () => {
      const votes = JSON.parse(localStorage.getItem('votedNames') || '[]');
      const uniqueVotes = new Map();
      votes.forEach(vote => uniqueVotes.set(vote.id, vote));
      return Array.from(uniqueVotes.values());
    },
  });

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">Error fetching voted names</div>;

  const filteredNames = votedNames
    ?.filter(vote => {
      const matchesFilter = 
        filter === 'all' || 
        (filter === 'liked' && vote.liked) || 
        (filter === 'disliked' && !vote.liked);
      const matchesSearch = vote.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={filter} onValueChange={setFilter} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
          <TabsTrigger value="disliked">Disliked</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Input
        type="text"
        placeholder="Search names..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {filteredNames && filteredNames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredNames.map((vote) => (
            <Card key={vote.id} className={`shadow-md ${vote.liked ? 'bg-green-50' : 'bg-red-50'}`}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  {vote.name}
                  {vote.liked ? (
                    <ThumbsUp className="text-green-500 h-5 w-5" />
                  ) : (
                    <ThumbsDown className="text-red-500 h-5 w-5" />
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center">No {filter === 'all' ? 'voted' : filter} names found.</p>
      )}
    </div>
  );
};

export default VotedNames;
