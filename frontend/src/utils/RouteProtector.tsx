import { Outlet, Navigate} from "react-router-dom";

export const RouteProtector = ({isAllowed,redirectTo='/login'}:{isAllowed:boolean,redirectTo?:string})=>{
    if(!isAllowed){
        return <Navigate to={redirectTo} replace/>
    }
    return <Outlet/>
}