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

    const filteredGoals = goals.filter(goal => {
        if (statusFilter !== 'All' && goal.status !== statusFilter) return false;
        if (schoolFilter !== 'All' && goal.school !== schoolFilter) return false;
        if (yearFilter !== 'All' && goal.schoolYear !== yearFilter) return false;
        return true;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fb', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111', margin: 0, letterSpacing: '-0.02em' }}>Goals</h1>
                    <Link to="/goals/new" style={{ background: '#1B3AEC', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(27, 58, 236, 0.2)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create goal
                    </Link>
                </div>

                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e0e7ff', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666', marginRight: '0.5rem' }}>FILTER BY:</span>
                    <select style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', color: '#444', minWidth: '140px', background: 'white' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Closed">Closed</option>
                        <option value="Archived">Archived</option>
                    </select>
                    <select style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', color: '#444', minWidth: '180px', background: 'white' }} value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)}>
                        <option value="All">All Schools</option>
                        {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', color: '#444', minWidth: '140px', background: 'white' }} value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                        <option value="All">All Years</option>
                        {SCHOOL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {(statusFilter !== 'All' || schoolFilter !== 'All' || yearFilter !== 'All') && (
                        <button
                            onClick={() => { setStatusFilter('All'); setSchoolFilter('All'); setYearFilter('All'); }}
                            style={{ background: 'none', border: 'none', color: '#1B3AEC', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500', marginLeft: 'auto' }}
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                <div style={{ background: 'white', border: '1px solid #e0e7ff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e0e7ff' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Goal Title</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>School</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Year</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', width: '40px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGoals.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
                                        <div style={{ marginBottom: '0.5rem', fontWeight: '500' }}>No goals found</div>
                                        <div style={{ fontSize: '0.85rem' }}>Try adjusting your filters or create a new goal.</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredGoals.map((goal) => (
                                    <tr
                                        key={goal.id}
                                        onClick={() => navigate(`/goals/${goal.id}`)}
                                        style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.1s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                                            {goal.title}
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '400', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                                {goal.description || 'No description'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>{goal.school}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>{goal.schoolYear}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em',
                                                background: goal.status === 'Active' ? '#dbeafe' : goal.status === 'Closed' ? '#d1fae5' : goal.status === 'Archived' ? '#f3f4f6' : '#f3f4f6',
                                                color: goal.status === 'Active' ? '#1e40af' : goal.status === 'Closed' ? '#065f46' : goal.status === 'Archived' ? '#374151' : '#374151'
                                            }}>
                                                {goal.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#9ca3af' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GoalsListV3;
