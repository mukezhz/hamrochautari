import { Navigate, useNavigate } from 'react-router-dom'
import { getUser } from '../utils/auth'

interface Props {
    component: React.ComponentType
    path?: string
}

export const PrivateRoute: React.FC<Props> = ({ component: RouteComponent }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token')
    const redirect = localStorage.getItem('redirect')
    if (token && redirect) {
        localStorage.removeItem('redirect')
        navigate(redirect)
    }
    const auth = getUser()
    if (auth && token !== '') {
        return (
            <>
                <RouteComponent />
            </>
        )
    }
    return <Navigate to="/login" />
}