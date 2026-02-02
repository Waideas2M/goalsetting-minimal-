import React from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalCreateV1 from './GoalCreateV1';
import GoalCreateV2 from './v2/GoalCreateV2';

const GoalCreate = () => {
    const { version } = useGoals();
    return version === 'V1' ? <GoalCreateV1 /> : <GoalCreateV2 />;
};

export default GoalCreate;
