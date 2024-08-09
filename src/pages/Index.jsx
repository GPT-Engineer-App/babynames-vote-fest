import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import confetti from 'canvas-confetti';
import { Progress } from "@/components/ui/progress";
import { useSwipeable } from 'react-swipeable';

const variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
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
  const [votedNameIds, setVotedNameIds] = useState([]);
  const [progress, setProgress] = useState(0);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-30, 0, 30]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

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
      window.dispatchEvent(new Event('storage'));
      queryClient.invalidateQueries('votedNames');
      setVotedNameIds(prevIds => [...prevIds, vote.id]);
      setCurrentNameIndex(prevIndex => prevIndex + 1);
    },
  });

  const handleVote = (liked) => {
    if (babyNames && babyNames[currentNameIndex]) {
      voteMutation.mutate({ 
        id: babyNames[currentNameIndex].id, 
        name: babyNames[currentNameIndex].name, 
        liked 
      });
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleVote(false),
    onSwipedRight: () => handleVote(true),
    trackMouse: true
  });

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      handleVote(true);
    } else if (info.offset.x < -100) {
      handleVote(false);
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

  if (!currentName) {
    return <div className="text-center mt-8">No more names to vote on!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Progress value={progress} className="w-full max-w-md mb-8" />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentName.id}
          ref={cardRef}
          {...handlers}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full max-w-md cursor-grab active:cursor-grabbing"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center">{currentName.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center space-x-4">
              <p className="text-center text-gray-500">Swipe right to like, left to dislike</p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-center space-x-4">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={() => handleVote(false)}
            className="bg-red-500 hover:bg-red-600 transition-all duration-200"
          >
            <ThumbsDown className="mr-2 h-5 w-5" /> Dislike
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={() => handleVote(true)}
            className="bg-green-500 hover:bg-green-600 transition-all duration-200"
          >
            <ThumbsUp className="mr-2 h-5 w-5" /> Like
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
