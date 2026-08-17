import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Route, Switch } from "wouter";

const PublicDemo = lazy(() => import("./pages/PublicDemo"));
const Review = lazy(() => import("./pages/Review"));
const Submission = lazy(() => import("./pages/Submission"));

function RouteFallback() { return <div className="grid min-h-screen place-items-center bg-[#f7f8f5]"><div className="size-7 animate-spin rounded-full border-2 border-[#cbe2da] border-t-[#176457]" /></div>; }
function Router() { return <Switch><Route path="/" component={Home} /><Route path="/review/:id">{() => <Suspense fallback={<RouteFallback />}><Review /></Suspense>}</Route><Route path="/demo/:id">{() => <Suspense fallback={<RouteFallback />}><PublicDemo /></Suspense>}</Route><Route path="/submission">{() => <Suspense fallback={<RouteFallback />}><Submission /></Suspense>}</Route><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster richColors position="top-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
