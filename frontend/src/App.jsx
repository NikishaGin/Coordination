import {useLogoutUser} from "./utils/logoutUser.js";
import {useSelector} from "react-redux";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import "./App.css";



export default function App() {
  const token = useSelector((state) => state.user.token)
  const isAuth = token && (token.length > 0)

  useLogoutUser(isAuth);

  return <AppRoutes isAuth={isAuth}  />
}