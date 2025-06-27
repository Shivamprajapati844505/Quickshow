import { createContext, useContext, useState } from "react";
import { axios } from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const useNavigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startWith("/admin")) {
        useNavigate("/");
        toast.error("You are not authorized to acces admin dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

const fetchShows = async() =>{
    try {
        const {data} =await axios.get('/api/show/all')
        if(data.success){
            setShows(data.shows)
        }
    } catch (error) {
        
    }
}
  
  
  useEffect(() => {
    if (user) {
      fetchIsAdmin();
    }
  }, [user]);

  const value = { axios };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
