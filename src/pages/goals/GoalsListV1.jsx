import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoals } from '../../context/GoalsContext';
import GoalVersionSwitch from '../../components/GoalVersionSwitch';
import './goals.css';

const GoalsListV1 = () => {
    const { goals } = useGoals();
    const navigate = useNavigate();

    const [filterStatus, setFilterStatus] = useState('All');

    const filteredGoals = goals.filter(goal => {
        if (filterStatus !== 'All' && goal.status !== filterStatus) return false;
        return true;
    });

    return (
        <div className="goals-container">
            <div className="goals-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 className="goals-title">GOALS</h1>
                    <GoalVersionSwitch />
                </div>
                <Link to="/goals/new" className="btn-primary">
                    + Create new goal
                </Link>
            </div>

            <div className="filters-bar">
                <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>

            <table className="goals-table">
                <thead>
                    <tr>
                        <th style={{ width: '40%' }}>Goal Title</th>
                        <th>Scope</th>
                        <th>Period</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredGoals.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: '#777', padding: '2rem' }}>
                                No goals found.
                            </td>
                        </tr>
                    ) : (
                        filteredGoals.map((goal) => (
                            <tr key={goal.id} onClick={() => navigate(`/goals/${goal.id}`)}>
                                <td style={{ fontWeight: '600' }}>{goal.title}</td>
                                <td>
                                    {goal.scope}
                                    {goal.scope === 'Class-related' && <span style={{ color: '#666', fontSize: '0.85em', display: 'block' }}>{goal.className}</span>}
                                </td>
                                <td>{goal.period.startDate} — {goal.period.endDate}</td>
                                <td>
                                    <span className={`status-badge status-${goal.status}`}>
                                        {goal.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GoalsListV1;
