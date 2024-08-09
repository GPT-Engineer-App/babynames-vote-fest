import { Baby, List } from "lucide-react";
import Index from "./pages/Index.jsx";
import VotedNames from "./pages/VotedNames.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Baby Names",
    to: "/",
    icon: <Baby className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Voted Names",
    to: "/voted",
    icon: <List className="h-4 w-4" />,
    page: <VotedNames />,
  },
];
