import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const GoalDetailV2 = () => {
    const { id } = useParams();
    return <Navigate to={`/goals/${id}/overview`} replace />;
};

export default GoalDetailV2;
