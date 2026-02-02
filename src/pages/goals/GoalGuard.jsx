import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGoals } from '../../context/GoalsContext';

const GoalGuard = ({ children, customMessage = null }) => {
    const { id } = useParams();
    const { version, goals } = useGoals();

    // Find the goal to check its native version
    const goal = goals.find(g => g.id === id);

    // If goal doesn't exist (e.g. sample routes or newly created), just let it through
    if (!goal) return children;

    const isV1Goal = goal?.version === 'V1';

    // If we're in V2 mode but trying to access a V1 goal, block it.
    if (version === 'V2' && isV1Goal) {
        return (
            <div className="goals-container">
                <Link to="/goals" className="back-link">← Back to Goals</Link>
                <div style={{
                    padding: '4rem',
                    textAlign: 'center',
                    border: '2px solid #333',
                    background: '#f9f9f9',
                    marginTop: '2rem'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        {customMessage ? customMessage.title : "Legacy Goal Disabled"}
                    </h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>
                        {customMessage ? customMessage.description : "This goal belongs to the legacy experience and is currently frozen."}
                    </p>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        To access this goal, enable the <strong>Legacy Experience</strong> in system settings.
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default GoalGuard;
