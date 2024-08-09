import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import { Progress } from "@/components/ui/progress";

const variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exitLike: { opacity: 0, x: 100, y: -100, rotate: 20, transition: { duration: 0.5, ease: "easeOut" } },
  exitDislike: { opacity: 0, x: -100, y: -100, rotate: -20, transition: { duration: 0.5, ease: "easeOut" } },
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

const fetchBabyNames = async () => {
  // Simulating API call with a larger list of names
  const names = [
    { id: 1, name: 'Olivia' }, { id: 2, name: 'Liam' }, { id: 3, name: 'Emma' },
    { id: 4, name: 'Noah' }, { id: 5, name: 'Ava' }, { id: 6, name: 'Sophia' },
    { id: 7, name: 'Jackson' }, { id: 8, name: 'Isabella' }, { id: 9, name: 'Lucas' },
    { id: 10, name: 'Mia' }, { id: 11, name: 'Ethan' }, { id: 12, name: 'Harper' },
    { id: 13, name: 'Aiden' }, { id: 14, name: 'Amelia' }, { id: 15, name: 'Oliver' },
    { id: 16, name: 'Evelyn' }, { id: 17, name: 'Elijah' }, { id: 18, name: 'Charlotte' },
    { id: 19, name: 'Grayson' }, { id: 20, name: 'Abigail' }, { id: 21, name: 'Ezra' },
    { id: 22, name: 'Emily' }, { id: 23, name: 'James' }, { id: 24, name: 'Elizabeth' },
    { id: 25, name: 'Benjamin' }, { id: 26, name: 'Mila' }, { id: 27, name: 'Mason' },
    { id: 28, name: 'Ella' }, { id: 29, name: 'William' }, { id: 30, name: 'Avery' },
    { id: 31, name: 'Samuel' }, { id: 32, name: 'Sofia' }, { id: 33, name: 'Joseph' },
    { id: 34, name: 'Camila' }, { id: 35, name: 'Henry' }, { id: 36, name: 'Aria' },
    { id: 37, name: 'Owen' }, { id: 38, name: 'Scarlett' }, { id: 39, name: 'Dylan' },
    { id: 40, name: 'Victoria' }, { id: 41, name: 'Wyatt' }, { id: 42, name: 'Madison' },
    { id: 43, name: 'Carter' }, { id: 44, name: 'Luna' }, { id: 45, name: 'Sebastian' },
    { id: 46, name: 'Grace' }, { id: 47, name: 'Jack' }, { id: 48, name: 'Chloe' },
    { id: 49, name: 'Daniel' }, { id: 50, name: 'Penelope' }
  ];
  return names.sort((a, b) => a.name.localeCompare(b.name));
};

const Index = () => {
  const queryClient = useQueryClient();
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [exitAnimation, setExitAnimation] = useState('');
  const [votedNameIds, setVotedNameIds] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const votedNames = JSON.parse(localStorage.getItem('votedNames') || '[]');
    setVotedNameIds(votedNames.map(vote => vote.id));
  }, []);

  const { data: allBabyNames, isLoading, isError } = useQuery({
    queryKey: ['babyNames'],
    queryFn: fetchBabyNames,
  });

  const babyNames = allBabyNames ? allBabyNames.filter(name => !votedNameIds.includes(name.id)) : [];

  const voteMutation = useMutation({
    mutationFn: (vote) => {
      // Simulating API call
      return Promise.resolve(vote);
    },
    onSuccess: (vote) => {
      const votedNames = JSON.parse(localStorage.getItem('votedNames') || '[]');
      const existingVoteIndex = votedNames.findIndex(v => v.id === vote.id);
      if (existingVoteIndex !== -1) {
        votedNames[existingVoteIndex] = vote;
      } else {
        votedNames.push(vote);
      }
      localStorage.setItem('votedNames', JSON.stringify(votedNames));
      // Dispatch a storage event to notify other tabs/windows
      window.dispatchEvent(new Event('storage'));
      queryClient.invalidateQueries('votedNames');
      setVotedNameIds(prevIds => [...prevIds, vote.id]);

      setTimeout(() => {
        setCurrentNameIndex(0);
        setExitAnimation('');
      }, 200);
    },
  });

  const handleVote = (liked) => {
    if (babyNames && babyNames[currentNameIndex]) {
      setExitAnimation(liked ? 'exitLike' : 'exitDislike');
      voteMutation.mutate({ 
        id: babyNames[currentNameIndex].id, 
        name: babyNames[currentNameIndex].name, 
        liked 
      });
    }
  };

  useEffect(() => {
    if (babyNames) {
      const newProgress = ((currentNameIndex + 1) / babyNames.length) * 100;
      setProgress(newProgress);

      if (newProgress === 100) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [currentNameIndex, babyNames]);

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">Error fetching baby names</div>;

  const currentName = babyNames && babyNames[currentNameIndex];

  if (babyNames.length === 0) {
    return <div className="text-center mt-8">No more names to vote on!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Progress value={progress} className="w-full max-w-md mb-8" />
      <AnimatePresence mode="wait">
        {currentName && (
          <motion.div
            key={currentName.id}
            variants={variants}
            initial="initial"
            animate="animate"
            exit={exitAnimation}
            className="w-full max-w-md"
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl text-center">{currentName.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center space-x-4">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    onClick={() => handleVote(true)}
                    className="bg-green-500 hover:bg-green-600 transition-all duration-200"
                  >
                    <ThumbsUp className="mr-2 h-5 w-5" /> Like
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    onClick={() => handleVote(false)}
                    className="bg-red-500 hover:bg-red-600 transition-all duration-200"
                  >
                    <ThumbsDown className="mr-2 h-5 w-5" /> Dislike
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {babyNames && babyNames.length === 0 && (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">All names voted!</h2>
          <p>Great job! You've voted on all the baby names.</p>
        </div>
      )}
    </div>
  );
};

export default Index;
