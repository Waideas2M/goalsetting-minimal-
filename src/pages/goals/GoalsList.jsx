import React from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalsListV1 from './GoalsListV1';
import GoalsListV2 from './v2/GoalsListV2';
import GoalsListV3 from './v3/GoalsListV3';

const GoalsList = () => {
    const { version } = useGoals();

    if (version === 'V1') return <GoalsListV1 />;
    if (version === 'V2') return <GoalsListV2 />;
    return <GoalsListV3 />;
};

export default GoalsList;
