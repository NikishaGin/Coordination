import { useNavigate } from "react-router";
import resetStore from "./store/store.js"
import { AppRoutes } from "./routes/AppRoutes.jsx";
import "./App.css";
import { useLogoutOnTokenExpires } from "./utils/logoutOnTokenExpired.js";
//import { useLogoutOnServiceMode } from "./utils/logoutOnServiceMode.js";



export default function App() {
  const navigate = useNavigate();

  const logoutCall = () => {
    resetStore();
    navigate("/login");
  };

  useLogoutOnTokenExpires(logoutCall);
  //useLogoutOnServiceMode(logoutCall)


  return <AppRoutes />
}