import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import Records from "@/pages/records";
import RecordTypes from "@/pages/record-types";
import RecordDetail from "@/pages/record-detail";
import AddRecord from "@/pages/add-record";
import EditRecord from "@/pages/edit-record";
import Scanner from "@/pages/scanner";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/records" component={Records} />
        <Route path="/records/:id" component={RecordDetail} />
        <Route path="/records/add" component={AddRecord} />
        <Route path="/records/:id/edit" component={EditRecord} />
        <Route path="/scanner" component={Scanner} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
