import React, { createContext, useContext, useState, useEffect } from 'react';

const GoalsContext = createContext();

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (!context) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
};

export const MOCK_USERS = [
    { id: 'u1', name: 'Anna Andersson' },
    { id: 'u2', name: 'Bertil Bengtsson' },
    { id: 'u3', name: 'Carina Carlson' },
    { id: 'u4', name: 'David Danielsson' },
    { id: 'u5', name: 'Erik Eriksson' }
];

export const SCHOOLS = [
    'Northview Primary School',
    'Riverside Middle School',
    'Eastside Comprehensive School'
];

export const SCHOOL_YEARS = [
    '2024–2025',
    '2025–2026',
    '2026–2027'
];

export const DATA_BASIS_OPTIONS = [
    'Grades / Results',
    'Attendance / Absence',
    'Survey responses',
    'Socio-economic data',
    'Staff turnover'
];

const initialGoals = [
    {
        id: "goal-active-01",
        version: "V1",
        title: "Improve math understanding (fractions)",
        scope: "Class-related",
        className: "Grade 6",
        subject: "Mathematics",
        description: "Targeting deeper understanding of fractions and problem solving.",
        period: {
            startDate: "2026-02-01",
            endDate: "2026-05-30"
        },
        status: "Active",
        initialEvidence: [ // Evidence only attached at follow-up or creation context usually, but keeping structure clean
            { id: "ev-init-m1", type: "file", url: "Diagnostic_Test.pdf", description: "Test results", dateAdded: "2026-02-01" }
        ],
        activities: [
            {
                id: "m1",
                title: "Diagnostic test on fractions",
                description: "Short assessment to identify gaps before adjusting teaching.",
                responsible: "Teacher",
                plannedReviewDate: "2026-02-05",
                status: "Completed"
            },
            {
                id: "m2",
                title: "Group work stations",
                description: "Students rotate between stations focused on fraction concepts.",
                responsible: "Class",
                plannedReviewDate: "2026-03-15",
                status: "In progress"
            }
        ],
        followUps: [
            {
                id: "mf1",
                date: "2026-03-10",
                observation: "Group work is engaging students well, but some still struggle with word problems.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-mf1-1", type: "file", url: "Fractions_diagnostic_results.pdf", description: "Assessment data", dateAdded: "2026-03-10" },
                    { id: "ev-mf1-2", type: "file", url: "Group_work_station_photos.jpg", description: "Station setup", dateAdded: "2026-03-10" }
                ]
            },
            {
                id: "mf2",
                date: "2026-03-25",
                observation: "Students explain fraction models more confidently after repeated practice.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-mf2-1", type: "file", url: "Student_work_samples_week3.pdf", description: "Work samples", dateAdded: "2026-03-25" }
                ]
            }
        ],
        evaluation: null
    },
    {
        id: "goal-active-02",
        version: "V1",
        title: "Decrease class absence",
        scope: "Class-related",
        className: "Grade 6",
        subject: "General",
        description: "Focus on reducing unexcused absences and improving punctuality.",
        period: {
            startDate: "2026-02-01",
            endDate: "2026-04-30"
        },
        status: "Active",
        initialEvidence: [],
        activities: [
            {
                id: "act-new-01",
                title: "Introduce a new morning routine",
                description: "Establish a clear start-of-day sequence to help students settle.",
                responsible: "Teacher",
                plannedReviewDate: "2026-02-15",
                status: "Completed"
            },
            {
                id: "act-new-02",
                title: "Attendance incentive (daily reward)",
                description: "Test whether a small daily reward improves attendance patterns.",
                responsible: "Teacher",
                plannedReviewDate: "2026-03-01",
                status: "In progress"
            }
        ],
        followUps: [
            {
                id: "fu-01",
                date: "2026-02-20",
                observation: "Attendance improved slightly during the first two weeks.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-fu-01-1", type: "file", url: "Attendance_summary_Feb.pdf", description: "Summary report", dateAdded: "2026-02-20" },
                    { id: "ev-fu-01-2", type: "file", url: "Daily_attendance_log_extract.docx", description: "Log extract", dateAdded: "2026-02-20" }
                ]
            },
            {
                id: "fu-02",
                date: "2026-03-05",
                observation: "Improvement leveled off after initial increase.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-fu-02-1", type: "file", url: "Attendance_trend_chart.png", description: "Trend chart", dateAdded: "2026-03-05" }
                ]
            }
        ],
        evaluation: null
    },
    {
        id: "goal-comp-001",
        version: "V1",
        title: "Improve reading comprehension",
        scope: "Class-related",
        className: "Grade 6",
        subject: "Swedish",
        description: "Intensive reading period to boost comprehension levels.",
        period: {
            startDate: "2025-08-15",
            endDate: "2025-12-20"
        },
        status: "Completed",
        initialEvidence: [],
        activities: [
            { id: "act-read-01", title: "Daily reading log", description: "Students log 20 mins reading daily.", responsible: "Student", plannedReviewDate: "2025-09-01", status: "Completed" }
        ],
        followUps: [
            {
                id: "fu-comp-01",
                date: "2025-11-15",
                observation: "Most students reached expected reading levels by end of term.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-comp-01", type: "file", url: "Reading_assessment_results.pdf", description: "Assessment results", dateAdded: "2025-11-15" },
                    { id: "ev-comp-02", type: "file", url: "Lesson_observation_notes.docx", description: "Teacher notes", dateAdded: "2025-11-15" }
                ]
            }
        ],
        evaluation: {
            achieved: "Yes",
            howWell: "Goal exceeded expectations.",
            adjustmentNeeded: "No",
            reflection: "Great engagement from students.",
            evidence: []
        }
    },
    {
        id: "goal-arch-001",
        version: "V1",
        title: "Improve morning routines",
        scope: "General",
        className: "",
        subject: "",
        description: "General improvement of start-of-day procedures.",
        period: { startDate: "2025-01-10", endDate: "2025-06-10" },
        status: "Archived",
        initialEvidence: [],
        activities: [],
        followUps: [
            {
                id: "fu-arch-01",
                date: "2025-10-20",
                observation: "Morning start time became more consistent across the class.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-arch-01", type: "file", url: "Morning_routine_guidelines.pdf", description: "Guidelines doc", dateAdded: "2025-10-20" },
                    { id: "ev-arch-02", type: "file", url: "Classroom_schedule_photo.jpg", description: "Schedule photo", dateAdded: "2025-10-20" }
                ]
            }
        ],
        evaluation: { achieved: "Yes", howWell: "Good.", adjustmentNeeded: "No", reflection: "Done.", evidence: [] }
    },
    // --- V2 SEED DATA (MOCK) ---
    {
        id: "v2-goal-reading",
        version: "V2",
        title: "Improve reading comprehension in Grade 6",
        goalLead: "u1", // Anna Andersson
        scope: "Class-related",
        className: "Grade 6",
        subject: "Swedish",
        school: "Riverside Middle School",
        schoolYear: "2025–2026",
        description: "Focus on understanding longer texts and inferring meaning.",
        improvementFocus: "Students struggle to understand longer texts and infer meaning.",
        dataBasis: ["Grades / Results", "Attendance / Absence", "Staff turnover"],
        intendedDirection: "Improved comprehension and ability to discuss texts.",
        status: "Active",
        hypotheses: [
            { id: "h-r1", title: "Students lack explicit strategies for reading longer texts", notes: "", successFactor: "Professional development", confidenceLevel: "Uncertain", interventions: [] },
            { id: "h-r2", title: "Reading tasks are not sufficiently scaffolded", notes: "", successFactor: "Systematic quality work with a focus on teaching", confidenceLevel: "Certain", interventions: [] },
            { id: "h-r3", title: "Classroom discussions focus more on answers than reasoning", notes: "", successFactor: "Trusting climate", confidenceLevel: "Need more data", interventions: [] }
        ],
        interventions: [
            {
                id: "i-r1",
                description: "Introduce explicit reading strategy lessons",
                expectedEffect: "Students apply strategies when reading independently.",
                hypothesisIds: ["h-r1", "h-r2"],
                followUps: [
                    { id: "fu-r1-1", type: "Implementation", observation: "Lessons were implemented as planned; students engaged actively.", dateAdded: new Date(Date.now() - 86400000 * 5).toISOString() },
                    { id: "fu-r1-2", type: "Effect", observation: "Some students began referencing strategies during reading.", dateAdded: new Date(Date.now() - 86400000 * 2).toISOString() }
                ]
            },
            {
                id: "i-r2",
                description: "Structured text discussions using guiding questions",
                expectedEffect: "Deeper reasoning and shared understanding.",
                hypothesisIds: ["h-r2", "h-r3"],
                followUps: [
                    { id: "fu-r2-1", type: "Implementation", observation: "Structure was followed; questions promoted reasoning.", dateAdded: new Date(Date.now() - 86400000 * 4).toISOString() },
                    { id: "fu-r2-2", type: "Effect", observation: "Discussions showed more diverse viewpoints.", dateAdded: new Date(Date.now() - 86400000 * 1).toISOString() }
                ]
            }
        ],
        evaluations: [
            {
                id: "ev-r1",
                whatWorked: "Strategy instruction improved student awareness of how to approach texts.",
                whatDidntWork: "Discussions still involved the same students; participation was uneven.",
                whatNext: "Use smaller discussion groups and clearer participation structures.",
                dateAdded: new Date().toISOString()
            }
        ],
        evidence: [
            // Baseline Evidence
            { id: "e-r-b1", type: "file", name: "Grade_6_Reading_Baseline.pdf", url: "Grade_6_Reading_Baseline.pdf", description: "Initial assessment report", contextType: "goal", contextId: "v2-goal-reading", phase: "baseline", dateAdded: new Date(Date.now() - 86400000 * 10).toISOString() },
            { id: "e-r-b2", type: "chart", name: "Reading Score Distribution", chartId: "reading-scores-v1", description: "Current performance distribution", contextType: "goal", contextId: "v2-goal-reading", phase: "baseline", dateAdded: new Date(Date.now() - 86400000 * 10).toISOString() },
            // Hypotheses Evidence
            { id: "e-r-h1", type: "file", name: "Lesson_Observation.jpg", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80", description: "Observation of student engagement", contextType: "hypothesis", contextId: "h-r1", dateAdded: new Date(Date.now() - 86400000 * 8).toISOString() },
            { id: "e-r-h2", type: "chart", name: "Strategy Usage Chart", chartId: "strategy-usage-2025", description: "Compare current vs peer usage", contextType: "hypothesis", contextId: "h-r1", dateAdded: new Date(Date.now() - 86400000 * 8).toISOString() },
            // Follow-up Evidence
            { id: "e-r-fu1", type: "file", name: "Student_Artifact_A.png", url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80", description: "Annotated text sample", contextType: "follow-up", contextId: "fu-r1-2", dateAdded: new Date(Date.now() - 86400000 * 2).toISOString() },
            // Evaluation Evidence
            { id: "e-r-ev1", type: "chart", name: "Post-Intervention Progress", chartId: "progress-trend-final", description: "Final progress comparison", contextType: "evaluation", contextId: "ev-r1", dateAdded: new Date().toISOString() }
        ]
    },
    {
        id: "v2-goal-absence",
        version: "V2",
        title: "Reduce absenteeism in Grade 8",
        goalLead: "u3", // Carina Carlson
        scope: "Organization",
        className: "Grade 8",
        subject: "General",
        school: "Northview Primary School",
        schoolYear: "2024–2025",
        description: "Addressing high levels of short-term absenteeism across all subjects.",
        improvementFocus: "High levels of short-term absenteeism.",
        dataBasis: ["Attendance / Absence", "Survey responses", "Socio-economic data"],
        intendedDirection: "More consistent student attendance.",
        status: "Closed",
        hypotheses: [
            { id: "h-a1", title: "Students lack motivation to attend certain lessons", notes: "", successFactor: "Health-promoting learning environment", confidenceLevel: "Uncertain" },
            { id: "h-a2", title: "Follow-up on absence is inconsistent", notes: "", successFactor: "Clear division of roles and responsibilities", confidenceLevel: "Certain" }
        ],
        interventions: [
            {
                id: "i-a1",
                description: "Weekly attendance check-ins with mentors",
                expectedEffect: "Increased accountability and student support.",
                hypothesisIds: ["h-a1", "h-a2"],
                followUps: [
                    { id: "fu-a1-1", type: "Implementation", observation: "Mentors conducted check-ins regularly.", dateAdded: new Date(Date.now() - 86400000 * 30).toISOString() },
                    { id: "fu-a1-2", type: "Effect", observation: "Attendance improved for several students.", dateAdded: new Date(Date.now() - 86400000 * 20).toISOString() }
                ]
            }
        ],
        evaluations: [
            {
                id: "ev-a1",
                whatWorked: "Consistent follow-up clarified expectations and improved relationships.",
                whatDidntWork: "Structural factors outside school still affected some students.",
                whatNext: "Involve student health services earlier.",
                dateAdded: new Date(Date.now() - 86400000 * 5).toISOString()
            }
        ],
        evidence: [
            { id: "e-a-b1", type: "file", name: "Yearly_Attendance_Report.pdf", url: "Yearly_Attendance_Report.pdf", description: "Baseline attendance data", contextType: "goal", contextId: "v2-goal-absence", phase: "baseline", dateAdded: new Date(Date.now() - 86400000 * 40).toISOString() },
            { id: "e-a-ev1", type: "chart", name: "Attendance Outcome Chart", chartId: "attendance-outcome", description: "Growth in attendance rates", contextType: "evaluation", contextId: "ev-a1", dateAdded: new Date(Date.now() - 86400000 * 5).toISOString() }
        ]
    },
    {
        id: "v2-goal-collab",
        version: "V2",
        title: "Improve collaboration in teacher teams",
        goalLead: "u5", // Erik Eriksson
        scope: "Organization",
        className: "",
        subject: "General",
        school: "Eastside Comprehensive School",
        schoolYear: "2023–2024",
        description: "Enhancing shared planning and reflection in teaching teams.",
        improvementFocus: "Limited shared planning and reflection.",
        dataBasis: ["Staff turnover", "Survey responses"],
        intendedDirection: "Stronger professional collaboration.",
        status: "Archived",
        hypotheses: [
            { id: "h-c1", title: "Lack of structured time for collaboration", notes: "", successFactor: "Clear division of roles and responsibilities", confidenceLevel: "Certain" },
            { id: "h-c2", title: "Unclear expectations for team meetings", notes: "", successFactor: "Competent leadership", confidenceLevel: "Uncertain" }
        ],
        interventions: [
            {
                id: "i-c1",
                description: "Introduce fixed agendas and rotating facilitation",
                expectedEffect: "More focused and productive meetings.",
                hypothesisIds: ["h-c1", "h-c2"],
                followUps: [
                    { id: "fu-c1-1", type: "Implementation", observation: "Meeting structure was followed consistently.", dateAdded: new Date().toISOString() }
                ]
            }
        ],
        evaluations: [
            {
                id: "ev-c1",
                whatWorked: "Clear structure supported shared responsibility.",
                whatDidntWork: "Time pressure still limited depth.",
                whatNext: "Reduce agenda scope and protect meeting time.",
                dateAdded: new Date().toISOString()
            }
        ],
        evidence: [
            { id: "e-c-b1", type: "file", name: "Staff_Survey_Results.pdf", url: "Staff_Survey_Results.pdf", description: "Collaborative culture survey", contextType: "goal", contextId: "v2-goal-collab", phase: "baseline", dateAdded: new Date(Date.now() - 86400000 * 60).toISOString() }
        ]
    },
    {
        id: "v2-goal-reading-new-cycle",
        version: "V2",
        title: "Improve reading comprehension in Grade 6 (new cycle)",
        goalLead: "u1",
        scope: "Class-related",
        className: "Grade 6",
        subject: "Swedish",
        school: "Riverside Middle School",
        schoolYear: "2026–2027",
        description: "",
        improvementFocus: "Students struggle to understand longer texts and make inferences.",
        dataBasis: ["Grades / Results", "Attendance / Absence"],
        intendedDirection: "Students demonstrate stronger comprehension and can explain their reasoning when reading texts.",
        status: "Draft",
        hypotheses: [],
        interventions: [],
        evaluations: [],
        evidence: []
    }
];

export const GoalsProvider = ({ children }) => {
    const [goals, setGoals] = useState(initialGoals);
    const [version, setVersion] = useState('V2');
    const [isV1Unlocked, setIsV1Unlocked] = useState(false);

    const addGoal = (goalData) => {
        const newGoal = {
            id: Math.random().toString(36).substr(2, 9),
            version: 'V2',
            title: goalData.title,
            goalLead: goalData.goalLead || '',
            scope: goalData.scope,
            className: goalData.className,
            subject: goalData.subject,
            school: goalData.school || '',
            schoolYear: goalData.schoolYear || '',
            description: goalData.description || '',
            improvementFocus: goalData.improvementFocus || '',
            dataBasis: goalData.dataBasis || [],
            intendedDirection: goalData.intendedDirection || '',
            situationAnalysis: {
                dataSummary: '',
                affectedGroups: '',
                patternsOverTime: '',
                connectedFactors: ''
            },
            period: goalData.period || { startDate: '', endDate: '' },
            status: goalData.status || 'Draft',
            hypotheses: [],
            interventions: [],
            evaluations: [],
            evidence: goalData.evidence || [], // Support baseline evidence during creation
            activities: [], // Legacy V1
            followUps: [], // Legacy V1
            evaluation: null, // Legacy V1
            initialEvidence: [] // Legacy V1
        };
        setGoals([...goals, newGoal]);
        return newGoal.id;
    };

    const updateGoal = (id, updates) => {
        setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
    };

    const deleteGoal = (id) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const duplicateGoal = (id) => {
        const goalToCopy = goals.find(g => g.id === id);
        if (!goalToCopy) return;

        const newGoal = {
            id: Math.random().toString(36).substr(2, 9),
            version: goalToCopy.version || 'V2',
            title: `${goalToCopy.title} (new cycle)`,
            goalLead: goalToCopy.goalLead || '',
            school: goalToCopy.school || '',
            schoolYear: '', // User must select new year
            improvementFocus: goalToCopy.improvementFocus || '',
            dataBasis: goalToCopy.dataBasis || [],
            scope: goalToCopy.scope || '',
            className: goalToCopy.className || '',
            intendedDirection: goalToCopy.intendedDirection || '',
            situationAnalysis: { // Fresh analysis for new cycle
                dataSummary: '',
                affectedGroups: '',
                patternsOverTime: '',
                connectedFactors: ''
            },
            description: '',
            status: 'Draft',
            period: { startDate: '', endDate: '' },
            hypotheses: [],
            interventions: [],
            evaluations: [],
            evidence: [], // Always a clean slate
            followUps: [], // Legacy compat
            activities: [], // Legacy compat
            evaluation: null, // Legacy compat
            initialEvidence: [],
        };
        setGoals([...goals, newGoal]);
        return newGoal.id;
    };

    const archiveGoal = (id) => {
        updateGoal(id, { status: 'Archived' });
    };

    // V2 Status & Action Guards
    const canEditGoal = (goal) => goal?.status === 'Draft' || goal?.status === 'Active';
    const canEditGoalLead = (goal) => goal?.status === 'Draft' || goal?.status === 'Active';
    const canAddHypothesis = (goal) => goal?.status === 'Draft' || goal?.status === 'Active';
    const canAddIntervention = (goal) => (goal?.status === 'Active' || goal?.status === 'Draft') && (goal?.hypotheses?.length > 0);
    const canAddFollowUp = (goal) => goal?.status === 'Active';
    const canAddEvaluation = (goal) => goal?.status === 'Active' || goal?.status === 'Closed';
    const canCloseGoal = (goal) => goal?.status === 'Active' && (goal.evaluations?.length > 0);
    const canReopenGoal = (goal) => goal?.status === 'Closed';

    // Evidence Status Rule:
    // Draft/Active: Everywhere
    // Closed: Only Evaluation
    // Archived: Read-only
    const canAddEvidence = (goal, contextType) => {
        if (!goal) return false;
        if (goal.status === 'Archived') return false;
        if (goal.status === 'Closed') {
            return contextType === 'evaluation';
        }
        return true; // Draft or Active
    };

    const addEvidence = (goalId, evidenceData) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canAddEvidence(goal, evidenceData.contextType)) return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const newEvidence = {
                    id: Math.random().toString(36).substr(2, 9),
                    ...evidenceData,
                    dateAdded: new Date().toISOString()
                };
                return {
                    ...g,
                    evidence: [...(g.evidence || []), newEvidence]
                };
            }
            return g;
        }));
    };

    const addHypothesis = (goalId, hypothesisData) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canAddHypothesis(goal)) return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const newHypothesis = {
                    id: Math.random().toString(36).substr(2, 9),
                    title: hypothesisData.title,
                    notes: hypothesisData.notes || '',
                    interventions: []
                };
                return {
                    ...g,
                    hypotheses: [...(g.hypotheses || []), newHypothesis]
                };
            }
            return g;
        }));
    };

    const addIntervention = (goalId, interventionData) => {
        const goal = goals.find(g => g.id === goalId);
        const canActuallyAdd = goal.status === 'Active' || (goal.status === 'Draft' && goal.hypotheses?.length > 0);
        if (!canActuallyAdd) return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const newIntervention = {
                    id: Math.random().toString(36).substr(2, 9),
                    description: interventionData.description,
                    expectedEffect: interventionData.expectedEffect,
                    hypothesisIds: interventionData.hypothesisIds || [],
                    followUps: []
                };

                const newStatus = g.status === 'Draft' ? 'Active' : g.status;

                return {
                    ...g,
                    status: newStatus,
                    interventions: [...(g.interventions || []), newIntervention]
                };
            }
            return g;
        }));
    };

    const addFollowUp = (goalId, interventionId, followUpData) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canAddFollowUp(goal)) return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const updatedInterventions = (g.interventions || []).map(i => {
                    if (i.id === interventionId) {
                        return {
                            ...i,
                            followUps: [...(i.followUps || []), {
                                id: Math.random().toString(36).substr(2, 9),
                                type: followUpData.type,
                                observation: followUpData.observation,
                                checkpointDate: followUpData.checkpointDate || '',
                                dateAdded: new Date().toISOString()
                            }]
                        };
                    }
                    return i;
                });
                return { ...g, interventions: updatedInterventions };
            }
            return g;
        }));
    };

    const addEvaluation = (goalId, evalData) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canAddEvaluation(goal)) return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const newEvalId = Math.random().toString(36).substr(2, 9);
                const newEval = {
                    id: newEvalId,
                    whatWorked: evalData.whatWorked,
                    whatDidntWork: evalData.whatDidntWork,
                    whatNext: evalData.whatNext,
                    dateAdded: new Date().toISOString()
                };
                return {
                    ...g,
                    evaluations: [...(g.evaluations || []), newEval]
                };
            }
            return g;
        }));
    };

    const updateHypothesis = (goalId, hypothesisId, updates) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canAddHypothesis(goal)) return;
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    hypotheses: g.hypotheses.map(h => h.id === hypothesisId ? { ...h, ...updates } : h)
                };
            }
            return g;
        }));
    };

    const updateIntervention = (goalId, interventionId, updates) => {
        const goal = goals.find(g => g.id === goalId);
        if (goal.status !== 'Active') return;
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    interventions: g.interventions.map(i => i.id === interventionId ? { ...i, ...updates } : i)
                };
            }
            return g;
        }));
    };

    const updateEvaluation = (goalId, evalId, updates) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canAddEvaluation(goal)) return;
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    evaluations: g.evaluations.map(ev => ev.id === evalId ? { ...ev, ...updates } : ev)
                };
            }
            return g;
        }));
    };

    const closeGoal = (goalId) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canCloseGoal(goal)) return;
        setGoals(goals.map(g => g.id === goalId ? { ...g, status: 'Closed' } : g));
    };

    const reopenGoal = (goalId) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canReopenGoal(goal)) return;
        setGoals(goals.map(g => g.id === goalId ? { ...g, status: 'Active' } : g));
    };

    const deleteHypothesis = (goalId, hypothesisId) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canAddHypothesis(goal)) return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const newHypotheses = g.hypotheses.filter(h => h.id !== hypothesisId);
                // Remove linkage from interventions
                const newInterventions = g.interventions.map(i => ({
                    ...i,
                    hypothesisIds: (i.hypothesisIds || []).filter(hid => hid !== hypothesisId)
                }));
                return {
                    ...g,
                    hypotheses: newHypotheses,
                    interventions: newInterventions
                };
            }
            return g;
        }));
    };

    const deleteIntervention = (goalId, interventionId) => {
        const goal = goals.find(g => g.id === goalId);
        if (goal.status === 'Archived' || goal.status === 'Closed') return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    interventions: g.interventions.filter(i => i.id !== interventionId)
                };
            }
            return g;
        }));
    };

    const deleteFollowUp = (goalId, interventionId, followUpId) => {
        const goal = goals.find(g => g.id === goalId);
        if (!canAddFollowUp(goal)) return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const newInterventions = g.interventions.map(i => {
                    if (i.id === interventionId) {
                        return {
                            ...i,
                            followUps: i.followUps.filter(f => f.id !== followUpId)
                        };
                    }
                    return i;
                });
                return { ...g, interventions: newInterventions };
            }
            return g;
        }));
    };

    const deleteEvaluation = (goalId, evaluationId) => {
        const goal = goals.find(g => g.id === goalId);
        if (goal.status === 'Archived') return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    evaluations: g.evaluations.filter(e => e.id !== evaluationId)
                };
            }
            return g;
        }));
    };

    const removeEvidence = (goalId, evidenceId) => {
        const goal = goals.find(g => g.id === goalId);
        if (goal.status === 'Archived') return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    evidence: g.evidence.filter(e => e.id !== evidenceId)
                };
            }
            return g;
        }));
    };

    const updateSituationAnalysis = (goalId, analysisData) => {
        const goal = goals.find(g => g.id === goalId);
        if (goal.status === 'Archived') return;

        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return { ...g, situationAnalysis: analysisData };
            }
            return g;
        }));
    };

    return (
        <GoalsContext.Provider value={{
            goals,
            version,
            setVersion,
            isV1Unlocked,
            setIsV1Unlocked,
            addGoal,
            updateGoal,
            deleteGoal,
            duplicateGoal,
            archiveGoal,
            addEvidence,
            removeEvidence,
            addHypothesis,
            deleteHypothesis,
            addIntervention,
            deleteIntervention,
            addFollowUp,
            deleteFollowUp,
            addEvaluation,
            deleteEvaluation,
            updateHypothesis,
            updateSituationAnalysis,
            updateIntervention,
            updateEvaluation,
            closeGoal,
            reopenGoal,
            canEditGoal,
            canEditGoalLead,
            canAddHypothesis,
            canAddIntervention,
            canAddFollowUp,
            canAddEvaluation,
            canCloseGoal,
            canReopenGoal,
            canAddEvidence
        }}>
            {children}
        </GoalsContext.Provider>
    );
};

