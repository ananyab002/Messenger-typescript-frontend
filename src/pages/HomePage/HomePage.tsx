import { Outlet } from "react-router-dom";
import Contacts from "../../components/contacts/Contacts";
import "./homePage.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const HomePage = () => {
  const queryClient = new QueryClient();
  return (
    <div className="container">
      <QueryClientProvider client={queryClient}>
        <Contacts />
        <Outlet />
      </QueryClientProvider>
    </div>
  );
};

export default HomePage;
