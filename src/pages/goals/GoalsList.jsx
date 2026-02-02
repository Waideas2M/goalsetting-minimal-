import React from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalsListV1 from './GoalsListV1';
import GoalsListV2 from './v2/GoalsListV2';

const GoalsList = () => {
    const { version } = useGoals();
    return version === 'V1' ? <GoalsListV1 /> : <GoalsListV2 />;
};

export default GoalsList;
