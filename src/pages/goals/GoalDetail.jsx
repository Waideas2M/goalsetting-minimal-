import React from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalDetailV1 from './GoalDetailV1';
import GoalDetailV2 from './v2/GoalDetailV2';
import GoalGuard from './GoalGuard';

const GoalDetail = () => {
    const { version } = useGoals();
    return (
        <GoalGuard>
            {version === 'V1' ? <GoalDetailV1 /> : <GoalDetailV2 />}
        </GoalGuard>
    );
};

export default GoalDetail;
