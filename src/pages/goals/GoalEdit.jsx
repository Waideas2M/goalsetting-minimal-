import React from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalEditV1 from './GoalEditV1';
import GoalEditV2 from './v2/GoalEditV2';
import GoalEditV3 from './v3/GoalEditV3';
import GoalGuard from './GoalGuard';

const GoalEdit = () => {
    const { version } = useGoals();

    let content;
    if (version === 'V1') content = <GoalEditV1 />;
    else if (version === 'V2') content = <GoalEditV2 />;
    else content = <GoalEditV3 />;

    return (
        <GoalGuard
            customMessage={{
                title: "Legacy Goal Locked",
                description: "Legacy goals are read-only and frozen in the current system state."
            }}
        >
            {content}
        </GoalGuard>
    );
};

export default GoalEdit;
