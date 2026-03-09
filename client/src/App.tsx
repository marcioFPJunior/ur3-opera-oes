import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "./lib/store";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import AdminPanel from "@/pages/AdminPanel";
import Recebimento from "@/pages/Recebimento";
import RecebimentoRegistro from "@/pages/RecebimentoRegistro";
import Expedicao from "@/pages/Expedicao";
import ExpedicaoRegistro from "@/pages/ExpedicaoRegistro";
import Transbordo from "@/pages/Transbordo";
import TransbordoProduct from "@/pages/TransbordoProduct";
import TransbordoRegistro from "@/pages/TransbordoRegistro";
import HistoricoCategory from "@/pages/HistoricoCategory";
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

      {/* Admin Panel */}
      <Route path="/admin">
        {() => (
          <Layout backTo="/">
            <ProtectedRoute component={AdminPanel} />
          </Layout>
        )}
      </Route>

      {/* Recebimento Routes */}
      <Route path="/recebimento">
        {() => (
          <Layout backTo="/">
            <ProtectedRoute component={Recebimento} />
          </Layout>
        )}
      </Route>
      <Route path="/recebimento/novo">
        {() => (
          <Layout backTo="/recebimento">
            <ProtectedRoute component={RecebimentoRegistro} />
          </Layout>
        )}
      </Route>
      <Route path="/recebimento/historico">
        {() => (
          <Layout backTo="/recebimento">
            <ProtectedRoute component={HistoricoCategory} />
          </Layout>
        )}
      </Route>

      {/* Expedição Routes */}
      <Route path="/expedicao">
        {() => (
          <Layout backTo="/">
            <ProtectedRoute component={Expedicao} />
          </Layout>
        )}
      </Route>
      <Route path="/expedicao/novo">
        {() => (
          <Layout backTo="/expedicao">
            <ProtectedRoute component={ExpedicaoRegistro} />
          </Layout>
        )}
      </Route>
      <Route path="/expedicao/historico">
        {() => (
          <Layout backTo="/expedicao">
            <ProtectedRoute component={HistoricoCategory} />
          </Layout>
        )}
      </Route>

      {/* Transbordo Routes */}
      <Route path="/transbordo">
        {() => (
          <Layout backTo="/">
            <ProtectedRoute component={Transbordo} />
          </Layout>
        )}
      </Route>
      <Route path="/transbordo/:solvente">
        {() => (
          <Layout backTo="/transbordo">
            <ProtectedRoute component={TransbordoProduct} />
          </Layout>
        )}
      </Route>
      <Route path="/transbordo/:solvente/novo">
        {() => (
          <Layout backTo={`/transbordo/:solvente`}>
            <ProtectedRoute component={TransbordoRegistro} />
          </Layout>
        )}
      </Route>
      <Route path="/transbordo/:solvente/historico">
        {() => (
          <Layout backTo={`/transbordo/:solvente`}>
            <ProtectedRoute component={HistoricoCategory} />
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
