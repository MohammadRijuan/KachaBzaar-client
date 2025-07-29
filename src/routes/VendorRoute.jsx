import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';


const VendorRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if (!user || role !== 'vendor') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }

    return children;
};

export default VendorRoute;