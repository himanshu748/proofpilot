import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PublicDemo from "./pages/PublicDemo";
import Review from "./pages/Review";
import Submission from "./pages/Submission";
import { Route, Switch } from "wouter";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/review/:id" component={Review} /><Route path="/demo/:id" component={PublicDemo} /><Route path="/submission" component={Submission} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster richColors position="top-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
