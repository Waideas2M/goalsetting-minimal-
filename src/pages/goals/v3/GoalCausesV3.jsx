import React, { useState, useEffect } from 'react';
import { useGoals } from '../../../context/GoalsContext';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const SUCCESS_FACTORS = [
    { label: 'Health-promoting learning environment', value: 'Health-promoting learning environment' },
    { label: 'Compensatory measures', value: 'Compensatory measures' },
    { label: 'Competent leadership', value: 'Competent leadership' },
    { label: 'Professional development', value: 'Professional development' },
    { label: 'Systematic quality work with a focus on teaching', value: 'Systematic quality work with a focus on teaching' },
    { label: 'Clear division of roles and responsibilities', value: 'Clear division of roles and responsibilities' },
    { label: 'Trusting climate', value: 'Trusting climate' },
    { label: 'Not applicable', value: 'not_applicable' }
];

const REFLECTION_QUESTIONS = {
    'Health-promoting learning environment': [
        'How does the school environment support both learning and students’ mental, social, and physical well-being?',
        'How does the school actively promote well-being and a sense of belonging in teaching situations?',
        'How is student attendance analyzed and followed up, and how is absence linked to teaching, the learning environment, and students’ experience of meaningfulness?'
    ],
    'Compensatory measures': [
        'How do teachers differentiate instruction day by day to meet each student’s knowledge level and needs?',
        'What concrete teaching interventions or compensatory methods are used for students who are falling behind?',
        'How do teachers use observations and formative assessment to adapt teaching in practice?'
    ],
    'Competent leadership': [
        'How does school leadership support teachers in developing teaching quality?',
        'How are goals, expectations, and follow-up around teaching communicated by leadership?',
        'How does leadership ensure that decisions are based on analysis of student learning and teaching outcomes?'
    ],
    'Professional development': [
        'How are peer supervision, classroom observations, and reflection on teaching quality organized?',
        'How are new didactic methods tested and evaluated in the classroom?',
        'How does the school leader ensure that professional development leads to concrete changes in teaching?'
    ],
    'Systematic quality work with a focus on teaching': [
        'How are data and observations used to continuously improve teaching?',
        'How is student learning followed step by step and used to adjust teaching content and methods?',
        'How does the school leader ensure that teaching is varied, progressive, and includes different learning strategies?'
    ],
    'Clear division of roles and responsibilities': [
        'Do all educators clearly understand their responsibilities in teaching and student support?',
        'Are roles for support, follow-up, and teaching development clear and functional in practice?',
        'How is the division of responsibilities reviewed and adjusted when needed?'
    ],
    'Trusting climate': [
        'How do teachers collaborate with each other and with students to support learning?',
        'Do students and staff feel safe expressing ideas, questions, and challenges in teaching situations?',
        'How are conflicts between students and between colleagues handled in a learning-oriented way?'
    ],
    'not_applicable': []
};

const CONFIDENCE_LEVELS = [
    { value: 'Certain', label: 'Certain — strongly supported by current data and consistent observations' },
    { value: 'Uncertain', label: 'Uncertain — some indications, but evidence is mixed or incomplete' },
    { value: 'Need more data', label: 'Need more data — not enough data or observations to assess reliably' }
];

const HypothesisForm = ({ initialData, onSave, onCancel, isEditing = false }) => {
    // 1. PRE-RENDER NORMALIZATION
    // This happens immediately during component initialization
    const validSuccessFactorValues = SUCCESS_FACTORS.map(f => f.value);

    const getNormalizedData = (raw) => {
        const factor = validSuccessFactorValues.includes(raw?.successFactor)
            ? raw.successFactor
            : 'not_applicable';

        const qArray = Array.isArray(raw?.questions) ? raw.questions : [];

        return {
            title: raw?.title || '',
            successFactor: factor,
            confidenceLevel: raw?.confidenceLevel || '',
            questions: qArray
        };
    };

    const normalized = getNormalizedData(initialData);

    // 2. STATE INITIALIZATION (DERIVED FROM NORMALIZED DATA)
    const [formData, setFormData] = useState({
        ...normalized,
        _answersPersistence: (() => {
            const persistence = {};
            if (normalized.successFactor !== 'not_applicable' && normalized.questions.length > 0) {
                const factorAnswers = {};
                normalized.questions.forEach(q => {
                    factorAnswers[q.question] = q.answer || '';
                });
                persistence[normalized.successFactor] = factorAnswers;
            }
            return persistence;
        })()
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.confidenceLevel) {
            alert('Please fill in the statement and confidence level.');
            return;
        }

        let finalQuestions = [];
        if (formData.successFactor !== 'not_applicable') {
            const definedQuestions = REFLECTION_QUESTIONS[formData.successFactor] || [];
            const answers = formData._answersPersistence[formData.successFactor] || {};

            if (definedQuestions.length > 0) {
                const allAnswered = definedQuestions.every(q => answers[q] && answers[q].trim());
                if (!allAnswered) {
                    alert('Please answer all reflection questions for the selected success factor.');
                    return;
                }
                finalQuestions = definedQuestions.map(q => ({ question: q, answer: answers[q] }));
            }
        }

        onSave({
            title: formData.title,
            successFactor: formData.successFactor,
            confidenceLevel: formData.confidenceLevel,
            questions: finalQuestions
        });
    };

    return (
        <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #1B3AEC22' }}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Hypothesis Statement *</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Example: Students may struggle to apply reading strategies independently."
                        rows="2"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Success Factor (Skolverket) *</label>
                    <select
                        className="form-select"
                        value={formData.successFactor}
                        onChange={(e) => setFormData({ ...formData, successFactor: e.target.value })}
                        required
                    >
                        {SUCCESS_FACTORS.map(factor => (
                            <option key={factor.value} value={factor.value}>{factor.label}</option>
                        ))}
                    </select>
                </div>

                {formData.successFactor !== 'not_applicable' && (
                    <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e0e7ff', marginBottom: '1.5rem', borderLeft: '4px solid #1B3AEC' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#1B3AEC', margin: '0 0 1rem 0', fontWeight: '800' }}>Reflection Questions</h4>
                        {(REFLECTION_QUESTIONS[formData.successFactor] || []).map((q, idx) => (
                            <div key={idx} className="form-group" style={{ marginBottom: idx === 2 ? 0 : '1rem' }}>
                                <label className="form-label" style={{ fontSize: '0.8rem', color: '#444' }}>{q} *</label>
                                <textarea
                                    className="form-textarea"
                                    rows="2"
                                    value={formData._answersPersistence[formData.successFactor]?.[q] || ''}
                                    onChange={(e) => {
                                        const factor = formData.successFactor;
                                        const currentFactorAnswers = { ...(formData._answersPersistence[factor] || {}) };
                                        currentFactorAnswers[q] = e.target.value;
                                        setFormData({
                                            ...formData,
                                            _answersPersistence: {
                                                ...formData._answersPersistence,
                                                [factor]: currentFactorAnswers
                                            }
                                        });
                                    }}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Confidence Level *</label>
                    {CONFIDENCE_LEVELS.map((level) => (
                        <div key={level.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#444' }}>
                            <input
                                type="radio"
                                name={`conf-${isEditing ? 'edit' : 'add'}`}
                                id={`conf-${level.value}-${isEditing ? 'edit' : 'add'}`}
                                value={level.value}
                                checked={formData.confidenceLevel === level.value}
                                onChange={(e) => setFormData({ ...formData, confidenceLevel: e.target.value })}
                                style={{ marginRight: '0.6rem' }}
                                required
                            />
                            <label htmlFor={`conf-${level.value}-${isEditing ? 'edit' : 'add'}`} style={{ cursor: 'pointer' }}>{level.label}</label>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn-primary">{isEditing ? 'Update Hypothesis' : 'Save Hypothesis'}</button>
                    <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #000',
    paddingBottom: '0.8rem'
};

const sectionTitleStyle = {
    fontSize: '1rem',
    margin: 0,
    textTransform: 'uppercase',
    color: '#000',
    letterSpacing: '0.08em',
    fontWeight: '800'
};

export const HypothesesSection = ({ goal }) => {
    const { id } = goal;
    const { addHypothesis, updateHypothesis, deleteHypothesis, canAddHypothesis, addEvidence, removeEvidence, canAddEvidence } = useGoals();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadContextId, setUploadContextId] = useState(null);

    const isArchived = goal.status === 'Archived';
    const allowedToModify = canAddHypothesis(goal);
    const evidenceAllowed = canAddEvidence(goal, 'hypothesis');
    const goalEvidence = goal.evidence || [];

    const handleAddClick = () => {
        if (isArchived) return;
        setIsAdding(true);
    };

    const handleSaveNew = (data) => {
        addHypothesis(id, data);
        setIsAdding(false);
    };

    const handleUpdateExisting = (hId, data) => {
        updateHypothesis(id, hId, data);
        setEditingId(null);
    };

    const handleDelete = (e, hId) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const affectedInterventions = (goal.interventions || []).filter(i =>
            (i.hypothesisIds || []).includes(hId) && (i.hypothesisIds || []).length === 1
        );

        let confirmMessage = "Are you sure you want to delete this hypothesis?";
        if (affectedInterventions.length > 0) {
            const names = affectedInterventions.map(i => `"${i.description}"`).join(", ");
            confirmMessage = `ATTENTION: Deleting this hypothesis will also PERMANENTLY delete the following linked interventions: ${names}\n\nThis action cannot be undone. Do you want to proceed?`;
        }

        setTimeout(() => {
            if (window.confirm(confirmMessage)) {
                deleteHypothesis(id, hId);
                setEditingId(null);
            }
        }, 10);
    };

    const openUploadModal = (contextId) => {
        setUploadContextId(contextId);
        setIsUploadModalOpen(true);
    };

    const handleAddEvidence = (evData) => {
        addEvidence(id, {
            ...evData,
            contextType: 'hypothesis',
            contextId: uploadContextId
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Hypotheses</h2>
                {!isAdding && !editingId && (
                    <button
                        onClick={handleAddClick}
                        disabled={isArchived}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 0.8rem',
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            color: '#444',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: isArchived ? 'default' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!isArchived) {
                                e.currentTarget.style.borderColor = '#1B3AEC';
                                e.currentTarget.style.color = '#1B3AEC';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isArchived) {
                                e.currentTarget.style.borderColor = '#ddd';
                                e.currentTarget.style.color = '#444';
                            }
                        }}
                    >
                        <PlusIcon />
                        Add hypothesis
                    </button>
                )}
            </div>

            {/* Section Description */}
            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.95rem', color: '#444', marginBottom: '0.25rem' }}>Why might this be happening?</div>
                <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.4' }}>A reasoned assumption about possible causes, based on the situation analysis. Hypotheses can change over time.</div>
            </div>

            {isAdding && (
                <HypothesisForm
                    initialData={{ successFactor: 'not_applicable' }}
                    onSave={handleSaveNew}
                    onCancel={() => setIsAdding(false)}
                />
            )}

            <div className="hypotheses-list">
                {!goal.hypotheses || goal.hypotheses.length === 0 ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', border: '1px dashed #eee', borderRadius: '10px', background: '#fafafa', color: '#999' }}>
                        <p style={{ marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                            Add hypotheses to guide your actions.
                        </p>
                        {!isAdding && (
                            <button
                                className="btn-primary"
                                onClick={handleAddClick}
                                disabled={isArchived}
                                style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add first hypothesis
                            </button>
                        )}
                    </div>
                ) : (
                    goal.hypotheses.map((h, index) => {
                        const hEvidence = goalEvidence.filter(ev => ev.contextType === 'hypothesis' && ev.contextId === h.id);

                        return (
                            <div key={h.id} style={{ padding: '0', marginBottom: '1rem' }}>
                                {editingId === h.id ? (
                                    <HypothesisForm
                                        initialData={h}
                                        isEditing={true}
                                        onSave={(data) => handleUpdateExisting(h.id, data)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                ) : (
                                    <div style={{ padding: '1.25rem', border: '1px solid #eee', borderRadius: '10px', background: 'white' }}>
                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <div style={{ width: '24px', height: '24px', background: '#f5f5f5', color: '#888', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', flexShrink: 0 }}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '1rem', color: '#111', marginBottom: '0.5rem', lineHeight: '1.4' }}>{h.title}</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                        <span style={{ background: '#f9f9f9', color: '#555', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #eee' }}>
                                                            {SUCCESS_FACTORS.find(f => f.value === h.successFactor)?.label || h.successFactor}
                                                        </span>
                                                        <span style={{ background: '#f9f9f9', color: '#666', fontSize: '0.7rem', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #eee' }}>{h.confidenceLevel}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {allowedToModify && (
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <button
                                                        onClick={() => setEditingId(h.id)}
                                                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '0.6rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = '#1B3AEC'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                                                        title="Edit hypothesis"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDelete(e, h.id)}
                                                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '0.6rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                                                        title="Delete hypothesis"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ marginLeft: '2.5rem', marginTop: '1rem', borderTop: '1px solid #f9f9f9', paddingTop: '1rem' }}>
                                            <EvidenceList
                                                evidence={hEvidence}
                                                allowedToAdd={evidenceAllowed}
                                                onAdd={() => openUploadModal(h.id)}
                                                onRemove={evidenceAllowed ? (evId) => removeEvidence(id, evId) : null}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <EvidenceUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onAdd={handleAddEvidence} contextType="hypothesis" contextId={uploadContextId} />
        </div>
    );
};

export const SituationAnalysisSection = ({ goal }) => {
    const { id } = goal;
    const { updateSituationAnalysis } = useGoals();
    const isArchived = goal.status === 'Archived';

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        dataSummary: '',
        affectedGroups: '',
        patternsOverTime: '',
        connectedFactors: ''
    });

    useEffect(() => {
        if (goal.situationAnalysis) {
            setFormData(goal.situationAnalysis);
        } else {
            setFormData({
                dataSummary: '',
                affectedGroups: '',
                patternsOverTime: '',
                connectedFactors: ''
            });
        }
    }, [goal.id, goal.situationAnalysis]);

    const handleSave = () => {
        updateSituationAnalysis(id, formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(goal.situationAnalysis || {
            dataSummary: '',
            affectedGroups: '',
            patternsOverTime: '',
            connectedFactors: ''
        });
        setIsEditing(false);
    };

    const isEmpty = !goal.situationAnalysis || (
        !goal.situationAnalysis.dataSummary &&
        !goal.situationAnalysis.affectedGroups &&
        !goal.situationAnalysis.patternsOverTime &&
        !goal.situationAnalysis.connectedFactors
    );

    return (
        <div style={{ marginBottom: '0rem' }}>
            <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>
                    Situation Analysis
                    <span style={{ fontSize: '0.75rem', color: '#999', textTransform: 'none', fontWeight: '400', marginLeft: '0.6rem', letterSpacing: 'normal' }}>(optional)</span>
                </h2>
                {!isEditing && !isEmpty && (
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isArchived}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 0.8rem',
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            color: '#444',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: isArchived ? 'default' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!isArchived) {
                                e.currentTarget.style.borderColor = '#1B3AEC';
                                e.currentTarget.style.color = '#1B3AEC';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isArchived) {
                                e.currentTarget.style.borderColor = '#ddd';
                                e.currentTarget.style.color = '#444';
                            }
                        }}
                    >
                        <EditIcon />
                        Edit
                    </button>
                )}
            </div>

            {/* Section Description */}
            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.95rem', color: '#444', marginBottom: '0.25rem' }}>What is happening right now?</div>
                <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.4' }}>A brief description of what you observe in data, practice, or everyday school life before drawing conclusions.</div>
            </div>

            <div style={{ background: 'white', borderRadius: '10px', padding: isEditing ? '0' : '0' }}>
                {isEditing ? (
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>What does the data show so far?</label>
                                <textarea className="form-textarea" rows="3" value={formData.dataSummary} onChange={(e) => setFormData({ ...formData, dataSummary: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Affected Groups</label>
                                <textarea className="form-textarea" rows="3" value={formData.affectedGroups} onChange={(e) => setFormData({ ...formData, affectedGroups: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Patterns over time</label>
                                <textarea className="form-textarea" rows="3" value={formData.patternsOverTime} onChange={(e) => setFormData({ ...formData, patternsOverTime: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Connected Factors</label>
                                <textarea className="form-textarea" rows="3" value={formData.connectedFactors} onChange={(e) => setFormData({ ...formData, connectedFactors: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1.25rem' }}>
                                <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
                                <button className="btn-primary" onClick={handleSave} disabled={isArchived}>Save analysis</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {isEmpty ? (
                            <div style={{ padding: '2.5rem', textAlign: 'center', border: '1px dashed #eee', borderRadius: '10px', background: '#fafafa' }}>
                                <p style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: '#999' }}>
                                    Describe what you observe before drawing conclusions.
                                </p>
                                <button
                                    className="btn-primary"
                                    onClick={() => setIsEditing(true)}
                                    disabled={isArchived}
                                    style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Add situation analysis
                                </button>
                            </div>
                        ) : (
                            <div style={{ padding: '1.25rem 1.5rem', border: '1px solid #eee', borderRadius: '10px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <AnalysisField label="Key Observations" value={goal.situationAnalysis?.dataSummary} />
                                    <AnalysisField label="Affected Groups" value={goal.situationAnalysis?.affectedGroups} />
                                    <AnalysisField label="Trends" value={goal.situationAnalysis?.patternsOverTime} />
                                    <AnalysisField label="Connected Factors" value={goal.situationAnalysis?.connectedFactors} />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const AnalysisField = ({ label, value }) => (
    <div>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#111', marginBottom: '0.5rem', letterSpacing: '0.06em', fontWeight: '800' }}>{label}</h4>
        <div style={{ fontSize: '0.9rem', color: '#333', lineHeight: '1.5' }}>{value || '—'}</div>
    </div>
);
