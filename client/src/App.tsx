import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "./lib/store";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import NovoRegistro from "@/pages/NovoRegistro";
import Historico from "@/pages/Historico";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { currentUser } = useAppContext();
  const [, setLocation] = useLocation();

  if (!currentUser) {
    setLocation("/login");
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => (
          <Layout>
            <ProtectedRoute component={Home} />
          </Layout>
        )}
      </Route>
      <Route path="/novo">
        {() => (
          <Layout backTo="/">
            <ProtectedRoute component={NovoRegistro} />
          </Layout>
        )}
      </Route>
      <Route path="/historico">
        {() => (
          <Layout backTo="/">
            <ProtectedRoute component={Historico} />
          </Layout>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Router />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
