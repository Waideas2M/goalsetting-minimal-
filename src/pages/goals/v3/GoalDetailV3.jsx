import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const GoalDetailV3 = () => {
    const { id } = useParams();
    return <Navigate to={`/goals/${id}/overview`} replace />;
};

export default GoalDetailV3;
