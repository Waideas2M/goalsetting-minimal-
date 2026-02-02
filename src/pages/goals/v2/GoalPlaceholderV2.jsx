import React from 'react';
import { Link } from 'react-router-dom';
import GoalVersionSwitch from '../../components/GoalVersionSwitch';
import './goals.css';

const GoalPlaceholderV2 = ({ title }) => {
    return (
        <div className="goals-container">
            <Link to="/goals" className="back-link">← Back to Goals</Link>

            <div className="goals-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 className="goals-title">{title}</h1>
                    <GoalVersionSwitch />
                </div>
            </div>

            <div style={{
                padding: '4rem',
                textAlign: 'center',
                border: '2px dashed #ccc',
                color: '#999',
                marginTop: '2rem'
            }}>
                <h2>{title} Canvas</h2>
                <p>The goal experience will be implemented here.</p>
            </div>
        </div>
    );
};

export default GoalPlaceholderV2;
