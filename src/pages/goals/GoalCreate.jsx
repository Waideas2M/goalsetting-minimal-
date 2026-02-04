import React from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalCreateV1 from './GoalCreateV1';
import GoalCreateV2 from './v2/GoalCreateV2';
import GoalCreateV3 from './v3/GoalCreateV3';

const GoalCreate = () => {
    const { version } = useGoals();

    if (version === 'V1') return <GoalCreateV1 />;
    if (version === 'V2') return <GoalCreateV2 />;
    return <GoalCreateV3 />;
};

export default GoalCreate;
