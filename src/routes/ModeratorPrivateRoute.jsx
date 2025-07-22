import { Navigate, useLocation } from 'react-router-dom';
import  useAuth  from '../hooks/UseAuth';
import TextOrCardLoader from '../components/TextOrcardLoader'

const ModeratorPrivateRoute = ({ children }) => {
  const { user, loading  } = useAuth();
  const location = useLocation();
  if (loading || !user?.role) {
    return <div><TextOrCardLoader></TextOrCardLoader></div>; // Or a spinner component
  }


  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if(user?.role!=='moderator'){
    return <Navigate to="/message" state={{ message: 'Moderator' }} replace />;
  }
  return children;
};

export default ModeratorPrivateRoute;