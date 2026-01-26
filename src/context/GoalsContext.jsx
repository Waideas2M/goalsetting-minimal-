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
    }
];

export const GoalsProvider = ({ children }) => {
    const [goals, setGoals] = useState(initialGoals);

    const addGoal = (goalData) => {
        const newGoal = {
            id: Math.random().toString(36).substr(2, 9),
            title: goalData.title,
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

    return (
        <GoalsContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, duplicateGoal, archiveGoal }}>
            {children}
        </GoalsContext.Provider>
    );
};
