import React from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalEditV1 from './GoalEditV1';
import GoalEditV2 from './v2/GoalEditV2';
import GoalGuard from './GoalGuard';

const GoalEdit = () => {
    const { version } = useGoals();
    return (
        <GoalGuard
            customMessage={{
                title: "Legacy Goal Locked",
                description: "Legacy goals are read-only and frozen in the current system state."
            }}
        >
            {version === 'V1' ? <GoalEditV1 /> : <GoalEditV2 />}
        </GoalGuard>
    );
};

export default GoalEdit;
