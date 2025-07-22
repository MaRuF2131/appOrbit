import MorderatorStatsContent from "../components/MorderatorOverview";
import AdminStatsContent from "../components/AdminOverview";
import UserStatsContent from "../components/UserOverview";
import useAuth from "../hooks/UseAuth"
const Overview = () => {
  const {user}=useAuth();
  return (
      user?.role==='admin'?<AdminStatsContent></AdminStatsContent>: user?.role==='user'?<UserStatsContent></UserStatsContent>:<MorderatorStatsContent></MorderatorStatsContent>
     
  )
}

export default Overview
