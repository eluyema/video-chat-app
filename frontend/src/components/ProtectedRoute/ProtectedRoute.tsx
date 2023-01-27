import React, {useContext, useEffect} from 'react';
import { Navigate, Route, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Providers/UserProvider/UserProvider';
import LoadingFrame from '../LoadingFrame/LoadingFrame';

interface IProtectedRoute {
    children: JSX.Element;
    redirectTo: string
}

const ProtectedRoute = ({ redirectTo, children}: IProtectedRoute) => {
    const { user, loading } = useContext(UserContext);
    console.log(user, loading)
    if (!user && !loading) {
        return <Navigate to={redirectTo} replace />
    }

    if(!user && loading) {
        return <LoadingFrame description="Checking your profile"/>
    }

    return children;
}

export default ProtectedRoute;