import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const VotedNames = () => {
  const { data: votedNames, isLoading, isError } = useQuery({
    queryKey: ['votedNames'],
    queryFn: () => JSON.parse(localStorage.getItem('votedNames') || '[]'),
  });

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">Error fetching voted names</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Voted Baby Names</h1>
      {votedNames && votedNames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {votedNames.map((vote) => (
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
    </div>
  );
};

export default VotedNames;
