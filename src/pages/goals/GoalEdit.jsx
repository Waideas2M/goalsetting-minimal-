import React from 'react';
import GoalEditV3 from './v3/GoalEditV3';
import GoalGuard from './GoalGuard';

const GoalEdit = () => {
    return (
        <GoalGuard>
            <GoalEditV3 />
        </GoalGuard>
    );
};

export default GoalEdit;
