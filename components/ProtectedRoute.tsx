import Router from "next/router";
import { useEffect , useState } from "react";
import supabase from "../supabase";


interface ProtectedRouteProps {
    allowedRoles?: string[]; // Specify the type for allowedRoles prop
    children: React.ReactNode;
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await supabase.auth.getSession();
            setSession(session);
        }
        fetchSession();
    }, [])
        
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes('admin')) {
      // Redirect to forbidden page if user does not have the required role
      Router.push('/404')
    }
  
    // Render the protected content if user is logged in and has the required role
    return <>{children}</>;
  };
  
  export default ProtectedRoute;