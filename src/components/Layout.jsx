import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Index from "../pages/Index";
import VotedNames from "../pages/VotedNames";

const Layout = () => {
  const [activeTab, setActiveTab] = useState("vote");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Baby Name App</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vote">Vote Names</TabsTrigger>
          <TabsTrigger value="view">View Voted</TabsTrigger>
        </TabsList>
      </Tabs>
      {activeTab === "vote" ? <Index /> : <VotedNames />}
    </div>
  );
};

export default Layout;
