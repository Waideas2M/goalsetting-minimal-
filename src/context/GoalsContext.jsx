import React, { createContext, useContext, useState, useEffect } from 'react';

const GoalsContext = createContext();

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (!context) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
};

const initialGoals = [
    {
        id: "goal-active-01",
        title: "Improve math understanding (fractions)",
        scope: "Class-related",
        className: "Grade 6",
        subject: "Mathematics",
        description: "Targeting deeper understanding of fractions and problem-solving through hands-on activities.",
        period: {
            startDate: "2026-02-01",
            endDate: "2026-05-30"
        },
        school: "Springdale Primary School",
        schoolYear: "2025–2026",
        status: "Active",
        initialEvidence: [
            { id: "ev-init-01", type: "file", url: "Fractions_Work_Sample_Baseline.pdf", description: "Initial work samples", dateAdded: "2026-02-01" }
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
                description: "Students rotate between stations focusing on fraction models and problem-solving.",
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
                    { id: "ev-mf1-1", type: "file", url: "Fractions_diagnostic_results.pdf", description: "Assessment results", dateAdded: "2026-03-10" },
                    { id: "ev-mf1-2", type: "file", url: "Group_work_station_photos.jpg", description: "Station setup", dateAdded: "2026-03-10" }
                ]
            }
        ],
        evaluation: null
    },
    {
        id: "goal-comp-01",
        title: "Decrease class absence",
        scope: "General",
        className: "Grade 6",
        subject: "General",
        description: "Focus on reducing unexcused absences and improving punctuality using incentive models.",
        period: {
            startDate: "2026-02-01",
            endDate: "2026-04-30"
        },
        school: "Springdale Primary School",
        schoolYear: "2025–2026",
        status: "Completed",
        initialEvidence: [],
        activities: [
            {
                id: "act-01",
                title: "Attendance incentive (daily reward)",
                description: "Test whether a small daily reward improves attendance patterns.",
                responsible: "Teacher",
                plannedReviewDate: "2026-03-01",
                status: "Completed"
            },
            {
                id: "act-02",
                title: "Class discussion on attendance",
                description: "Discuss routines and expectations with students.",
                responsible: "Teacher & Class",
                plannedReviewDate: "2026-02-15",
                status: "Completed"
            }
        ],
        followUps: [
            {
                id: "fu-01",
                date: "2026-02-20",
                observation: "Attendance improved slightly during the first two weeks.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-fu-01-1", type: "file", url: "Attendance_summary_Feb.pdf", description: "Feb Summary", dateAdded: "2026-02-20" },
                    { id: "ev-fu-01-2", type: "file", url: "Daily_attendance_log_extract.docx", description: "Daily log excerpt", dateAdded: "2026-02-20" }
                ]
            },
            {
                id: "fu-02",
                date: "2026-03-05",
                observation: "Improvement leveled off after the initial increase.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-fu-02-1", type: "file", url: "Attendance_trend_chart.png", description: "Attendance trend chart", dateAdded: "2026-03-05" }
                ]
            }
        ],
        evaluation: {
            achieved: "Partly",
            howWell: "The incentive model provided a temporary boost but was not sustainable long-term.",
            adjustmentNeeded: "Yes - new strategy needed for term 3.",
            reflection: "Incentives had a short-term effect. Further support strategies needed.",
            evidence: [
                { id: "ev-eval-1", type: "file", url: "Attendance_summary_Feb.pdf", description: "Baseline for comparison", dateAdded: "2026-04-30" },
                { id: "ev-eval-2", type: "file", url: "Attendance_trend_chart.png", description: "Final trend report", dateAdded: "2026-04-30" }
            ]
        }
    },
    {
        id: "goal-arch-01",
        title: "Improve reading comprehension",
        scope: "Class-related",
        className: "Grade 5",
        subject: "Swedish",
        description: "Intensive small-group reading sessions to boost Swedish comprehension levels.",
        period: {
            startDate: "2024-09-01",
            endDate: "2025-01-15"
        },
        school: "Springdale Primary School",
        schoolYear: "2024–2025",
        status: "Archived",
        initialEvidence: [
            { id: "ev-init-reading", type: "file", url: "Initial_Reading_Diagnostic.pdf", description: "Sept Diagnostic", dateAdded: "2024-09-01" }
        ],
        activities: [
            {
                id: "act-reading-01",
                title: "Guided reading sessions",
                description: "Weekly small-group reading with targeted texts.",
                responsible: "Teacher",
                plannedReviewDate: "2024-12-01",
                status: "Completed"
            }
        ],
        followUps: [
            {
                id: "fu-reading-01",
                date: "2024-11-15",
                observation: "Most students reached expected reading levels by end of term.",
                status: "Reviewed",
                evidence: [
                    { id: "ev-read-1", type: "file", url: "Reading_assessment_results.pdf", description: "Mid-term results", dateAdded: "2024-11-15" },
                    { id: "ev-read-2", type: "file", url: "Lesson_observation_notes.docx", description: "Notes from sessions", dateAdded: "2024-11-15" }
                ]
            }
        ],
        evaluation: {
            achieved: "Yes",
            howWell: "Target level achieved for 85% of pupils.",
            adjustmentNeeded: "No",
            reflection: "Structured reading sessions significantly improved comprehension.",
            evidence: []
        }
    }
];

export const GoalsProvider = ({ children }) => {
    const [goals, setGoals] = useState(initialGoals);

    const addGoal = (goalData) => {
        const newGoal = {
            id: Math.random().toString(36).substr(2, 9),
            title: goalData.title,
            school: goalData.school,
            schoolYear: goalData.schoolYear,
            scope: goalData.scope,
            className: goalData.className,
            subject: goalData.subject,
            description: goalData.description,
            period: goalData.period || { startDate: '', endDate: '' },
            status: goalData.status || 'Draft',
            activities: [],
            followUps: [],
            evaluation: null,
            initialEvidence: goalData.initialEvidence || []
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
            ...goalToCopy,
            id: Math.random().toString(36).substr(2, 9),
            title: `${goalToCopy.title} (Copy)`,
            status: 'Draft',
            period: { startDate: '', endDate: '' },
            followUps: [],
            evaluation: null,
            initialEvidence: [],
        };
        setGoals([...goals, newGoal]);
        return newGoal.id;
    };

    const archiveGoal = (id) => {
        updateGoal(id, { status: 'Archived' });
    };

    const reactivateGoal = (id) => {
        updateGoal(id, { status: 'Active' });
    };

    return (
        <GoalsContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, duplicateGoal, archiveGoal, reactivateGoal }}>
            {children}
        </GoalsContext.Provider>
    );
};
