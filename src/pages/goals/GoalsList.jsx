import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoals } from '../../context/GoalsContext';
import './goals.css';

const GoalsList = () => {
    const { goals } = useGoals();
    const navigate = useNavigate();

    const [filterStatus, setFilterStatus] = useState('All');
    const [filterSchool, setFilterSchool] = useState('All');
    const [filterYear, setFilterYear] = useState('All');

    const statusOrder = ['Draft', 'Active', 'Completed', 'Archived'];

    const filteredAndSortedGoals = goals
        .filter(goal => {
            if (filterStatus !== 'All' && goal.status !== filterStatus) return false;
            if (filterSchool !== 'All' && goal.school !== filterSchool) return false;
            if (filterYear !== 'All' && goal.schoolYear !== filterYear) return false;
            return true;
        })
        .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

    return (
        <div className="goals-container">
            <div className="goals-header">
                <h1 className="goals-title">Goals</h1>
                <Link to="/goals/new" className="btn-primary">
                    + Create new goal
                </Link>
            </div>

            <div className="filters-bar" style={{ flexWrap: 'wrap', background: '#f9f9f9', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>School</label>
                    <select
                        className="filter-select"
                        value={filterSchool}
                        onChange={(e) => setFilterSchool(e.target.value)}
                    >
                        <option value="All">All Schools</option>
                        <option value="Springdale Primary School">Springdale Primary School</option>
                        <option value="Northview High">Northview High</option>
                        <option value="Sunny Side Elementary">Sunny Side Elementary</option>
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>School Year</label>
                    <select
                        className="filter-select"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                    >
                        <option value="All">All Years</option>
                        <option value="2024–2025">2024–2025</option>
                        <option value="2025–2026">2025–2026</option>
                        <option value="2026–2027">2026–2027</option>
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Status</label>
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

                {/* Reset Link */}
                <button
                    onClick={() => { setFilterStatus('All'); setFilterSchool('All'); setFilterYear('All'); }}
                    style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#666', cursor: 'pointer', fontSize: '0.8rem', padding: '1rem 0 0 0' }}
                >
                    Reset to defaults
                </button>
            </div>

            <table className="goals-table" style={{ marginTop: '1.5rem' }}>
                <thead>
                    <tr>
                        <th style={{ width: '35%' }}>Goal Title</th>
                        <th>School</th>
                        <th>Year</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedGoals.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: '#777', padding: '3rem' }}>
                                <div style={{ marginBottom: '0.5rem' }}>No goals found for the selected filters.</div>
                                <button className="btn-secondary" onClick={() => { setFilterStatus('All'); setFilterSchool('All'); setFilterYear('All'); }}>Clear All Filters</button>
                            </td>
                        </tr>
                    ) : (
                        filteredAndSortedGoals.map((goal) => (
                            <tr key={goal.id} onClick={() => navigate(`/goals/${goal.id}`)}>
                                <td style={{ fontWeight: '600' }}>
                                    {goal.title}
                                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#666', fontWeight: 'normal', marginTop: '0.2rem' }}>{goal.scope}</span>
                                </td>
                                <td style={{ fontSize: '0.9rem' }}>{goal.school}</td>
                                <td style={{ fontSize: '0.9rem' }}>{goal.schoolYear}</td>
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

export default GoalsList;
