import { Route, Routes } from "react-router-dom";
import { Home  } from "../pages/dashboard";
import { Login } from "../pages/login";
import { Register } from "../pages/register";
export const AppRouter = () => {
    return (
    <Routes>
        <Route exact path = "/" element = {<Home />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />} />
    </Routes>
    )
}