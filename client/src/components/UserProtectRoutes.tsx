import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const UserProtectRoutes = () => {
    const { currentUser } = useSelector((state: any)=> state.user)
    console.log(currentUser)
    console.log("💕💕💕💕💕💕💕 private route user")
      return currentUser ? <Outlet /> : <Navigate to={"/login"} />;
}

export default UserProtectRoutes