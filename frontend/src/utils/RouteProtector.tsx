import { Outlet, Navigate} from "react-router-dom";
import LoadingPage from "../components/LoadingPage";

export const RouteProtector = ({
  isAllowed, 
  redirectTo = '/not-allowed', 
  isLoading = false
}:{
    isAllowed:boolean,
    redirectTo?:string,
    isLoading?:boolean
}) => {
    if (isLoading) return <LoadingPage />;  

    if (!isAllowed) {
        return <Navigate to={redirectTo} replace />;
    }
    return <Outlet />;
}