import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import '../goals.css';

const GoalTabsV3 = () => {
    const { id } = useParams();

    return (
        <div className="tabs-nav" style={{
            marginTop: '0.5rem',
            marginBottom: '0',
            borderBottom: '1px solid #eee',
            display: 'flex',
            gap: '2rem'
        }}>
            <NavLink
                to={`/goals/${id}/overview`}
                className={({ isActive }) => `tab-btn-v2 ${isActive ? 'active' : ''}`}
                style={tabStyle}
            >
                Overview
            </NavLink>
            <NavLink
                to={`/goals/${id}/causes`}
                className={({ isActive }) => `tab-btn-v2 ${isActive ? 'active' : ''}`}
                style={tabStyle}
            >
                Investigate causes
            </NavLink>
            <NavLink
                to={`/goals/${id}/interventions`}
                className={({ isActive }) => `tab-btn-v2 ${isActive ? 'active' : ''}`}
                style={tabStyle}
            >
                Interventions
            </NavLink>
            <NavLink
                to={`/goals/${id}/evaluation`}
                className={({ isActive }) => `tab-btn-v2 ${isActive ? 'active' : ''}`}
                style={tabStyle}
            >
                Evaluation
            </NavLink>
        </div>
    );
};

const tabStyle = ({ isActive }) => ({
    padding: '0.75rem 0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.85rem',
    color: isActive ? '#1B3AEC' : '#666',
    borderBottom: isActive ? '2px solid #1B3AEC' : '2px solid transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    marginBottom: '-1px' // Align with the container border
});

export default GoalTabsV3;
