import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import GoalStatusModal from '../../../components/GoalStatusModal';
import '../goals.css';

const V3PageLayout = ({ title, children, backLink = "/goals", isItemView = false, breadcrumbs = null, actions = null }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { goals, duplicateGoal, reopenGoal, archiveGoal, closeGoal } = useGoals();
    const [showModal, setShowModal] = useState(false);

    const goal = id && id !== 'new' ? goals.find(g => g.id === id) : null;
    const isGoalView = !!goal;

    const handleDuplicate = (e) => {
        e.preventDefault();
        const newId = duplicateGoal(id);
        navigate(`/goals/${newId}`);
    };

    const handleReopen = () => { reopenGoal(id); setShowModal(false); };
    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setTimeout(() => {
            if (window.confirm('Mark goal as Closed? This will lock all fields.')) {
                closeGoal(id);
            }
        }, 10);
    };
    const handleDownload = () => alert("Download report functionality is under construction.");
    const handleArchive = (e) => {
        if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
        setTimeout(() => {
            if (window.confirm('Are you sure you want to archive this goal?')) {
                archiveGoal(id);
            }
        }, 10);
    };

    const isEditing = window.location.pathname.endsWith('/edit');

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: 'white' }}>
            <div className="goals-container" style={{ paddingTop: '3rem' }}>
                {/* Row 1: Breadcrumb Navigation */}
                <div style={{ marginBottom: '1.25rem' }}>
                    {breadcrumbs ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#666' }}>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <span style={{ fontSize: '0.8rem', color: '#999' }}>›</span>}
                                    {crumb.to ? <Link to={crumb.to} style={{ textDecoration: 'none', color: 'inherit', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={crumb.label}>{crumb.label}</Link> : <span style={{ color: '#999' }}>{crumb.label}</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : isGoalView ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#666' }}>
                            <Link to="/goals" style={{ textDecoration: 'none', color: 'inherit' }}>Goals</Link>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>›</span>
                            <Link to={`/goals/${goal.id}`} style={{ textDecoration: 'none', color: 'inherit', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={goal.title}>{goal.title}</Link>
                            {isEditing && <><span style={{ fontSize: '0.8rem', color: '#999' }}>›</span><span style={{ color: '#999' }}>Edit Goal</span></>}
                        </div>
                    ) : (
                        <Link to={backLink} className="back-link" style={{ display: 'inline-block', color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>← Back</Link>
                    )}
                </div>

                {isGoalView && !isItemView ? (
                    <div className="goal-authoritative-header" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', lineHeight: '1.25', color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {isEditing ? `Edit: ${goal.title}` : goal.title}
                                </h2>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap' }}>
                                {goal.status !== 'Archived' && (
                                    <button className="btn-secondary" disabled={goal.status === 'Active'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: goal.status === 'Active' ? 0.5 : 1, cursor: goal.status === 'Active' ? 'not-allowed' : 'pointer' }} onClick={handleArchive} title={goal.status === 'Active' ? "Cannot archive active goal" : "Archive Goal"}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                                        Archive
                                    </button>
                                )}
                                <button className="btn-secondary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }} onClick={handleDownload} title="Download Report">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Report
                                </button>
                                <button className="btn-secondary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }} onClick={() => navigate('/goals/new', { state: { sourceGoalId: id } })} title="Duplicate Goal">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    Copy
                                </button>
                                {goal.status === 'Active' && (
                                    <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '600', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1B3AEC', color: 'white', border: 'none', cursor: 'pointer' }} onClick={handleClose}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                        Mark as Closed
                                    </button>
                                )}
                                {goal.status === 'Closed' && (
                                    <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '600', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #ddd' }} onClick={() => setShowModal(true)}>
                                        Reopen Goal
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : isItemView ? (
                    <div className="goal-authoritative-header" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '2rem' }}>
                            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', lineHeight: '1.25', color: '#000' }}>{title}</h1>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>{actions}</div>
                        </div>
                    </div>
                ) : (
                    <div className="goals-header" style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <h1 className="goals-title" style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>{title}</h1>
                    </div>
                )}

                <div className="v2-content-area" style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '8px', minHeight: '300px', background: 'white' }}>
                    {children}
                </div>
            </div>
            <GoalStatusModal isOpen={showModal} onClose={() => setShowModal(false)} onReopen={handleReopen} />
        </div >
    );
};
export default V3PageLayout;
