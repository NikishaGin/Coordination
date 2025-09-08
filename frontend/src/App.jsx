import "./App.css";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { useIsAuth } from "./store/user/userSlice.js";


export default function App() {
  const isAuth = useIsAuth();

  return <AppRoutes isAuth={isAuth}  />;
}