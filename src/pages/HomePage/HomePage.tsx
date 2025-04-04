import { Outlet } from "react-router-dom";
import Contacts from "../../components/contacts/Contacts";
import "./homePage.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SelectedContactContextProvider } from "../../context/SelectedContactContext";
const HomePage = () => {
  const queryClient = new QueryClient();
  return (
    <div className="container">
      <QueryClientProvider client={queryClient}>
        <SelectedContactContextProvider>
          <Contacts />
          <Outlet />
        </SelectedContactContextProvider>
      </QueryClientProvider>
    </div>
  );
};

export default HomePage;
