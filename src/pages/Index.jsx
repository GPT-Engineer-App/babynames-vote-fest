import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";

const fetchBabyNames = async () => {
  // Simulating API call
  return [
    { id: 1, name: 'Olivia' },
    { id: 2, name: 'Liam' },
    { id: 3, name: 'Emma' },
    { id: 4, name: 'Noah' },
    { id: 5, name: 'Ava' },
  ];
};

const Index = () => {
  const queryClient = useQueryClient();
  const [currentNameIndex, setCurrentNameIndex] = useState(0);

  const { data: babyNames, isLoading, isError } = useQuery({
    queryKey: ['babyNames'],
    queryFn: fetchBabyNames,
  });

  const voteMutation = useMutation({
    mutationFn: (vote) => {
      // Simulating API call
      return Promise.resolve(vote);
    },
    onSuccess: () => {
      setCurrentNameIndex((prevIndex) => (prevIndex + 1) % babyNames.length);
    },
  });

  const handleVote = (liked) => {
    if (babyNames && babyNames[currentNameIndex]) {
      voteMutation.mutate({ nameId: babyNames[currentNameIndex].id, liked });
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">Error fetching baby names</div>;

  const currentName = babyNames && babyNames[currentNameIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Baby Name Voting</h1>
      {currentName && (
        <motion.div
          key={currentName.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center">{currentName.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center space-x-4">
              <Button
                onClick={() => handleVote(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <ThumbsUp className="mr-2 h-5 w-5" /> Like
              </Button>
              <Button
                onClick={() => handleVote(false)}
                className="bg-red-500 hover:bg-red-600"
              >
                <ThumbsDown className="mr-2 h-5 w-5" /> Dislike
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
