import React from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalDetailV1 from './GoalDetailV1';
import GoalDetailV2 from './v2/GoalDetailV2';
import GoalDetailV3 from './v3/GoalDetailV3';
import GoalGuard from './GoalGuard';

const GoalDetail = () => {
    const { version } = useGoals();

    let content;
    if (version === 'V1') content = <GoalDetailV1 />;
    else if (version === 'V2') content = <GoalDetailV2 />;
    else content = <GoalDetailV3 />;

    return (
        <GoalGuard>
            {content}
        </GoalGuard>
    );
};

export default GoalDetail;
