import React, { useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import GoalVersionSwitch from '../../../components/GoalVersionSwitch';
import GoalTabsV3 from './GoalTabsV3';
import GoalStatusModal from '../../../components/GoalStatusModal';
import '../goals.css';

const V3PageLayout = ({ title, children, backLink = "/goals", isItemView = false, breadcrumbs = null, actions = null }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { goals, duplicateGoal, reopenGoal } = useGoals();
    const [showModal, setShowModal] = useState(false);

    const goal = id && id !== 'new' ? goals.find(g => g.id === id) : null;
    const isGoalView = !!goal;

    const handleDuplicate = (e) => {
        e.preventDefault();
        const newId = duplicateGoal(id);
        navigate(`/goals/${newId}/overview`);
    };

    const handleEditClick = (e) => {
        if (!goal) return;
        const isClosed = goal.status === 'Closed';
        const isArchived = goal.status === 'Archived';

        if (isArchived) {
            e.preventDefault();
            return;
        }
        if (isClosed) {
            e.preventDefault();
            setShowModal(true);
        }
    };

    const handleReopen = () => {
        reopenGoal(id);
        setShowModal(false);
    };

    const isEditing = window.location.pathname.endsWith('/edit');

    const location = useLocation();
    const path = location.pathname;
    let sectionName = '';

    if (path.endsWith('/overview')) sectionName = 'Overview';
    else if (path.endsWith('/causes')) sectionName = 'Investigate causes';
    else if (path.includes('/interventions')) sectionName = 'Interventions';
    else if (path.endsWith('/evaluations')) sectionName = 'Evaluation';
    else if (path.endsWith('/edit')) sectionName = 'Edit Goal';

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: 'white' }}>
            <GoalVersionSwitch />

            <div className="goals-container" style={{ paddingTop: '3rem' }}>
                {/* Row 1: Breadcrumb Navigation */}
                <div style={{ marginBottom: '1.25rem' }}>
                    {breadcrumbs ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#666' }}>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <span style={{ fontSize: '0.8rem', color: '#999' }}>›</span>}
                                    {crumb.to ? (
                                        <Link
                                            to={crumb.to}
                                            style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                maxWidth: '300px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                            title={crumb.label}
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span style={{ color: '#999' }}>{crumb.label}</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : isGoalView ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#666' }}>
                            <Link to="/goals" style={{ textDecoration: 'none', color: 'inherit' }}>Goals</Link>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>›</span>
                            <Link
                                to={`/goals/${goal.id}/overview`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    maxWidth: '300px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                title={goal.title}
                            >
                                {goal.title}
                            </Link>
                            {sectionName && (
                                <>
                                    <span style={{ fontSize: '0.8rem', color: '#999' }}>›</span>
                                    <span style={{ color: '#999' }}>{sectionName}</span>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link to={backLink} className="back-link" style={{ display: 'inline-block', color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>← Back</Link>
                    )}
                </div>

                {isGoalView && !isItemView ? (
                    <div className="goal-authoritative-header" style={{ marginBottom: '2.5rem' }}>
                        {/* Row 2: Title, Status and Actions Group */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                            gap: '2rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                minWidth: 0
                            }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '1.75rem',
                                    fontWeight: '600',
                                    lineHeight: '1.25',
                                    color: '#000',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {isEditing ? `Edit: ${goal.title}` : goal.title}
                                </h2>
                                {!isEditing && (
                                    <span className={`status-badge status-${goal.status}`} style={{
                                        fontSize: '0.7rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        color: '#666',
                                        background: '#f9f9f9',
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {goal.status}
                                    </span>
                                )}
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                alignItems: 'center',
                                flexShrink: 0,
                                whiteSpace: 'nowrap'
                            }}>
                                <button
                                    className="btn-secondary"
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                    onClick={handleDuplicate}
                                >
                                    Duplicate goal
                                </button>
                                {!isEditing && (
                                    <Link
                                        to={`/goals/${id}/edit`}
                                        className={`btn-secondary ${goal.status === 'Archived' ? 'disabled' : ''}`}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                        onClick={handleEditClick}
                                    >
                                        Edit goal
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Row 3: Tabs */}
                        {!isEditing && <GoalTabsV3 />}
                    </div>
                ) : isItemView ? (
                    <div className="goal-authoritative-header" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '2rem' }}>
                            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '600', lineHeight: '1.25', color: '#000' }}>
                                {title}
                            </h1>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
                                {actions}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="goals-header" style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <h1 className="goals-title" style={{ fontSize: '1.75rem', fontWeight: '600', margin: 0 }}>{title}</h1>
                    </div>
                )}

                <div className="v2-content-area" style={{
                    padding: '2rem',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    minHeight: '300px',
                    background: 'white'
                }}>
                    {children}
                </div>
            </div>

            <GoalStatusModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onReopen={handleReopen}
            />
        </div>
    );
};

export default V3PageLayout;
