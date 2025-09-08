import "./App.css";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { useToken } from "./store/user/userSlice.js";


export default function App() {
  const token = useToken();
  const isAuth = token && (token.length > 0);

  return <AppRoutes isAuth={isAuth}  />;
}