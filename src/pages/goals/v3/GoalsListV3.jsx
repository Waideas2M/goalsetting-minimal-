import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoals, SCHOOLS, SCHOOL_YEARS } from '../../../context/GoalsContext';
import '../goals.css';

const GoalsListV3 = () => {
    const { goals } = useGoals();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = React.useState('All');
    const [schoolFilter, setSchoolFilter] = React.useState('All');
    const [yearFilter, setYearFilter] = React.useState('All');

    // Filter to show only V2 goals (V3 is a copy of V2 for comparison iteration)
    const filteredGoals = goals.filter(goal => {
        if (goal.version !== 'V2') return false;
        if (statusFilter !== 'All' && goal.status !== statusFilter) return false;
        if (schoolFilter !== 'All' && goal.school !== schoolFilter) return false;
        if (yearFilter !== 'All' && goal.schoolYear !== yearFilter) return false;
        return true;
    });

    return (
        <div className="goals-container">
            <div className="goals-header">
                <h1 className="goals-title">GOALS</h1>
                <Link to="/goals/new" className="btn-primary">
                    + Create goal
                </Link>
            </div>

            <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select className="form-select" style={{ width: 'auto', minWidth: '150px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                    <option value="Archived">Archived</option>
                </select>
                <select className="form-select" style={{ width: 'auto', minWidth: '200px' }} value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)}>
                    <option value="All">All Schools</option>
                    {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="form-select" style={{ width: 'auto', minWidth: '150px' }} value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                    <option value="All">All Years</option>
                    {SCHOOL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            <div style={{ marginTop: '0rem' }}>
                <table className="goals-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Goal Title</th>
                            <th style={{ width: '25%' }}>School</th>
                            <th style={{ width: '15%' }}>School Year</th>
                            <th style={{ width: '20%' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGoals.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>
                                    No goals found.
                                </td>
                            </tr>
                        ) : (
                            filteredGoals.map((goal) => (
                                <tr key={goal.id} onClick={() => navigate(`/goals/${goal.id}/overview`)} style={{ cursor: 'pointer' }}>
                                    <td style={{ fontWeight: '600', color: '#111' }}>{goal.title}</td>
                                    <td style={{ color: '#666', fontSize: '0.9rem' }}>{goal.school}</td>
                                    <td style={{ color: '#666', fontSize: '0.9rem' }}>{goal.schoolYear}</td>
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
        </div>
    );
};

export default GoalsListV3;
