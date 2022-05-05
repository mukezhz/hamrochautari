import { Navigate } from 'react-router-dom'
import { getUser } from '../utils/auth'

interface Props {
    component: React.ComponentType
    path?: string
}

export const PrivateRoute: React.FC<Props> = ({ component: RouteComponent }) => {
    const token = localStorage.getItem('access_token')
    const auth = getUser()
    if (auth && token != '') {
        return (
            <>
                <RouteComponent />
            </>
        )
    }
    return <Navigate to="/login" />
}