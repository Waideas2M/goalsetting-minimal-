import React, { createContext, useContext, useState } from 'react';

const GoalsContext = createContext();

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (!context) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
};

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

const initialGoals = [
    {
        id: "goal-active-03",
        title: "Increase Mathematics Scores",
        description: "Targeted intervention for Year 6 mathematics to improve problem-solving skills in preparation for national assessments.",
        status: "Active",
        school: "Alviksskolan",
        schoolYear: "2024–2025",
        situationAnalysis: {
            dataSummary: "Low problem-solving scores identified in national tests and local diagnostics.",
            affectedGroups: "Students struggle with multi-step word problems and abstract reasoning.",
            patternsOverTime: "Teachers report a lack of shared strategies for problem solving across the grade level.",
            connectedFactors: "Time for deep learning is often compromised by a packed curriculum and fast-paced delivery."
        },
        hypotheses: [
            {
                id: "h-m2-1",
                title: "Structured workshops improve problem-solving techniques",
                successFactor: "Professional development",
                confidenceLevel: "Certain",
                questions: [
                    { question: 'How are peer supervision, classroom observations, and reflection on teaching quality organized?', answer: 'We have scheduled bi-weekly peer observations where math teachers observe each other\'s problem-solving workshops.' },
                    { question: 'How are new didactic methods tested and evaluated in the classroom?', answer: 'Teachers are piloting the "Polya" 4-step method and keeping detailed logs of student strategy use.' },
                    { question: 'How does the school leader ensure that professional development leads to concrete changes in teaching?', answer: 'Leadership reviews workshop outcomes during monthly pedagogical meetings and allocates time for shared planning.' }
                ]
            },
            {
                id: "h-m2-2",
                title: "Visual bar models reduce cognitive load in complex tasks",
                successFactor: "Systematic quality work with a focus on teaching",
                confidenceLevel: "Certain",
                questions: [
                    { question: 'How are data and observations used to continuously improve teaching?', answer: 'Diagnostic tests are analyzed weekly to identify which specific word problem types are causing the most visual confusion.' },
                    { question: 'How is student learning followed step by step and used to adjust teaching content and methods?', answer: 'Teachers collect student "scratch pads" to see if the bar models correctly represent the mathematical relationships before calculation.' },
                    { question: 'How does the school leader ensure that teaching is varied, progressive, and includes different learning strategies?', answer: 'The curriculum lead has mapped out a progression for visual modeling from Year 1 to Year 6 to ensure consistency.' }
                ]
            }
        ],
        interventions: [
            {
                id: "i-m2-1",
                description: "Weekly Problem-Solving Workshops for Year 6",
                expectedEffect: "Students apply heuristic strategies independently.",
                hypothesisIds: ["h-m2-1"],
                followUps: [
                    { id: "fu-m2-1", followUpPeriod: "After 1 month", indicator: "Student participation in workshops", assessment: "85% attendance recorded. Positive feedback from teachers." }
                ]
            },
            {
                id: "i-m2-2",
                description: "Integration of Singapore-style Bar Modelling into daily math lessons",
                expectedEffect: "Students can represent 80% of word problems visually before attempting calculation.",
                hypothesisIds: ["h-m2-2"],
                followUps: [
                    { id: "fu-m2-2", followUpPeriod: "After 2 months", indicator: "Visual representation accuracy in student workbooks", assessment: "" }
                ]
            }
        ],
        evaluationPlan: {
            period: "End of Spring Term",
            indicator: "National test results in mathematics and student strategy documentation.",
            whatWorked: "",
            whatDidntWork: "",
            whatNext: "",
            isClosed: false
        },
        evidence: [
            { id: "ev-m2-1", type: "file", name: "Diagnostic_Summary_Feb.pdf", url: "#", description: "Basline analytics", contextType: "goal", contextId: "goal-active-03", dateAdded: "2025-02-15T09:00:00Z" }
        ]
    },
    {
        id: "goal-draft-01",
        title: "Social-Emotional Well-being Pilot",
        description: "Design and implement a program to reduce playground conflicts and improve student agency.",
        status: "Draft",
        school: "Eastside Comprehensive School",
        schoolYear: "2026–2027",
        situationAnalysis: {
            dataSummary: "",
            affectedGroups: "",
            patternsOverTime: "",
            connectedFactors: ""
        },
        hypotheses: [],
        interventions: [],
        evaluationPlan: {
            period: "",
            indicator: "",
            whatWorked: "",
            whatDidntWork: "",
            whatNext: "",
            isClosed: false
        },
        evidence: []
    },
    {
        id: "goal-closed-01",
        title: "Reading Comprehension Strategy Pilot",
        description: "Improving inferencing skills in Grade 5 using the Reciprocal Teaching method.",
        status: "Closed",
        school: "Riverside Middle School",
        schoolYear: "2024–2025",
        situationAnalysis: {
            dataSummary: "Pre-assessment showed students could locate facts but struggled with inferring meaning.",
            affectedGroups: "Year 5 class (30 students).",
            patternsOverTime: "Persistent issue noted across multiple terms.",
            connectedFactors: "Previous focus was heavily on decoding rather than comprehension."
        },
        hypotheses: [
            {
                id: "h-r1",
                title: "Reciprocal Teaching roles empower students in small groups",
                successFactor: "Professional development",
                confidenceLevel: "Certain",
                questions: [
                    { question: 'How are peer supervision, classroom observations, and reflection on teaching quality organized?', answer: 'Staff meetings focused on video-recorded Reciprocal Teaching sessions to normalize the methodology.' },
                    { question: 'How are new didactic methods tested and evaluated in the classroom?', answer: 'The "Predictor" and "Summarizer" roles were tested over a 4-week cycle with varying text difficulties.' },
                    { question: 'How does the school leader ensure that professional development leads to concrete changes in teaching?', answer: 'Classroom walkthroughs confirm that roles are being used correctly and consistently across different English classes.' }
                ]
            },
            {
                id: "h-r2",
                title: "Explicit strategy modelling by teachers decreases dependency",
                successFactor: "Systematic quality work with a focus on teaching",
                confidenceLevel: "Certain",
                questions: [
                    { question: 'How are data and observations used to continuously improve teaching?', answer: 'Observations showed that students who saw 3+ models performed 20% better on independent inferencing tasks.' },
                    { question: 'How is student learning followed step by step and used to adjust teaching content and methods?', answer: 'Formative "exit tickets" measure which specific inferencing leap (cause/effect vs. character motive) is hardest.' },
                    { question: 'How does the school leader ensure that teaching is varied, progressive, and includes different learning strategies?', answer: 'Modeling techniques are shared in the digital resource bank to ensure all teachers have access to high-quality examples.' }
                ]
            }
        ],
        interventions: [
            {
                id: "i-r1",
                description: "Daily 20-min Reciprocal Teaching sessions",
                expectedEffect: "15% increase in comprehension scores.",
                hypothesisIds: ["h-r1"],
                followUps: [
                    { id: "fu-r1-1", followUpPeriod: "Weekly", indicator: "Correct use of Reciprocal Teaching roles", assessment: "Most students are now confident in their assigned roles." }
                ]
            },
            {
                id: "i-r2",
                description: "Weekly 'Think-Aloud' modelling sessions for complex texts",
                expectedEffect: "Students utilize 'Predictor' and 'Questioner' strategies independently.",
                hypothesisIds: ["h-r2"],
                followUps: [
                    { id: "fu-r1-2", followUpPeriod: "Mid-term", indicator: "Pre vs Post diagnostic scores", assessment: "Average improvement of 18% observed." }
                ]
            }
        ],
        evaluationPlan: {
            period: "End of Term 2",
            indicator: "Diagnostic reading comprehension tests and classroom observations.",
            whatWorked: "The structured roles made students more accountable. Modelling also reduced the 'blank stare' during difficult texts.",
            whatDidntWork: "Initial group formation was difficult; some social dynamics slowed down the academic progress.",
            whatNext: "Expand to Grade 4 next term with pre-established social groupings.",
            isClosed: true
        },
        evidence: [
            { id: "e-r1-report", type: "file", name: "Reading_Pilot_Results.pdf", url: "#", description: "Comprehensive analysis", contextType: "evaluation", contextId: "evaluation-plan", dateAdded: "2025-06-25T14:00:00Z" }
        ]
    },
    {
        id: "goal-archived-01",
        title: "School Garden Initiative (2024)",
        description: "Creating a learning garden to support the Biology curriculum for Grade 7.",
        status: "Archived",
        school: "Eastside Comprehensive School",
        schoolYear: "2023–2024",
        situationAnalysis: {
            dataSummary: "Biology results showed students struggled with plant biological processes.",
            affectedGroups: "Grade 7 (approx 120 students).",
            patternsOverTime: "Core concept struggle noted for several years.",
            connectedFactors: "Lack of hands-on connection to biological processes."
        },
        hypotheses: [
            {
                id: "h-g1",
                title: "Hands-on gardening improves concept retention in Biology",
                successFactor: "Systematic quality work with a focus on teaching",
                confidenceLevel: "Certain",
                questions: [
                    { question: 'How are data and observations used to continuously improve teaching?', answer: 'Quiz scores on photosynthesis were compared between garden-using groups and traditional classroom groups.' },
                    { question: 'How is student learning followed step by step and used to adjust teaching content and methods?', answer: 'Weekly garden journals are reviewed to check for misconceptions about nutrient cycles.' },
                    { question: 'How does the school leader ensure that teaching is varied, progressive, and includes different learning strategies?', answer: 'Management supports the outdoor learning initiative by providing specialized equipment and safety training.' }
                ]
            },
            {
                id: "h-g2",
                title: "Student-led maintenance improves environmental stewardship",
                successFactor: "Trusting climate",
                confidenceLevel: "Certain",
                questions: [
                    { question: 'How do teachers collaborate with each other and with students to support learning?', answer: 'Biology teachers and the school janitorial staff both mentor student "Garden Leaders".' },
                    { question: 'Do students and staff feel safe expressing ideas, questions, and challenges in teaching situations?', answer: 'Surveys show students feel they have a significant voice in what is planted and how the space is designed.' },
                    { question: 'How are conflicts between students and between colleagues handled in a learning-oriented way?', answer: 'Resource competition (e.g., watering times) is handled via a student-mediated scheduling council.' }
                ]
            }
        ],
        interventions: [
            {
                id: "i-g1",
                description: "Construction of 4 raised beds and initial planting cycle",
                expectedEffect: "Improved biology lab results for the botany unit.",
                hypothesisIds: ["h-g1"],
                followUps: [
                    { id: "fu-g1-1", followUpPeriod: "Monthly", indicator: "Plant growth and soil health metrics", assessment: "Initial beds built and potatoes growing well." }
                ]
            },
            {
                id: "i-g2",
                description: "Establishment of a weekly 'Green Team' garden elective",
                expectedEffect: "Sustainability of garden over the school holidays.",
                hypothesisIds: ["h-g2"],
                followUps: [
                    { id: "fu-g2-1", followUpPeriod: "Year-end", indicator: "Student participation rates and project completion", assessment: "Elective was oversubscribed; students completed all planned infrastructure projects." }
                ]
            }
        ],
        evaluationPlan: {
            period: "Year-end Review",
            indicator: "Biology Unit assessment scores and garden maintenance logs.",
            whatWorked: "Physical engagement was excellent. Botany scores rose by 22%.",
            whatDidntWork: "Summer maintenance failed despite the elective; many plants died in August.",
            whatNext: "Research automated watering systems if re-opening.",
            isClosed: true
        },
        evidence: []
    }
];

export const GoalsProvider = ({ children }) => {
    const [goals, setGoals] = useState(initialGoals);

    const addGoal = (goalData) => {
        // Clone hypotheses if provided (from template), ensuring new IDs
        const newHypotheses = (goalData.hypotheses || []).map(h => ({
            ...h,
            id: 'h-' + Math.random().toString(36).substr(2, 9),
            interventions: [] // Clear interventions if any were attached
        }));

        const newGoal = {
            id: Math.random().toString(36).substr(2, 9),
            title: goalData.title || '',
            school: goalData.school || '',
            schoolYear: goalData.schoolYear || '',
            description: goalData.description || '',
            situationAnalysis: goalData.situationAnalysis ? { ...goalData.situationAnalysis } : {
                dataSummary: '',
                affectedGroups: '',
                patternsOverTime: '',
                connectedFactors: ''
            },
            status: goalData.status || 'Draft',
            evaluationPlan: {
                period: '',
                indicator: '',
                whatWorked: '',
                whatDidntWork: '',
                whatNext: '',
                isClosed: false
            },
            hypotheses: newHypotheses,
            interventions: [], // Ensure empty
            followUps: [],     // Ensure empty
            evidence: goalData.evidence || [],
            isDuplicateReviewPending: !!goalData.fromTemplate
        };
        setGoals(prev => [...prev, newGoal]);
        return newGoal.id;
    };

    const updateGoal = (id, updates) => {
        setGoals(prev => prev.map(g => {
            if (g.id === id) {
                // Clear review pending on update
                return { ...g, ...updates, isDuplicateReviewPending: false };
            }
            return g;
        }));
    };

    const deleteGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    const duplicateGoal = (id) => {
        const goalToCopy = goals.find(g => g.id === id);
        if (!goalToCopy) return;

        const newGoal = {
            id: Math.random().toString(36).substr(2, 9),
            title: `${goalToCopy.title} (new cycle)`,
            school: goalToCopy.school || '',
            schoolYear: '',
            description: '',
            situationAnalysis: {
                dataSummary: '',
                affectedGroups: '',
                patternsOverTime: '',
                connectedFactors: ''
            },
            status: 'Draft',
            evaluationPlan: {
                period: '',
                indicator: '',
                whatWorked: '',
                whatDidntWork: '',
                whatNext: '',
                isClosed: false
            },
            evidence: [],
        };
        setGoals(prev => [...prev, newGoal]);
        return newGoal.id;
    };

    const archiveGoal = (id) => {
        updateGoal(id, { status: 'Archived' });
    };

    const canEditGoal = (goal) => goal?.status === 'Draft' || goal?.status === 'Active';
    const canAddHypothesis = (goal) => goal?.status === 'Draft' || goal?.status === 'Active';
    const canAddIntervention = (goal) => (goal?.status === 'Active' || goal?.status === 'Draft') && (goal?.hypotheses?.length > 0);
    const canCloseGoal = (goal) => goal?.status === 'Active' && goal.evaluationPlan?.isClosed;
    const canReopenGoal = (goal) => goal?.status === 'Closed';

    const canAddEvidence = (goal, contextType) => {
        if (!goal) return false;
        if (goal.status === 'Archived') return false;
        if (goal.status === 'Closed') {
            return contextType === 'evaluation';
        }
        return true;
    };

    const addEvidence = (goalId, evidenceData) => {
        setGoals(prev => prev.map(g => {
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
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                const newHypothesis = {
                    id: Math.random().toString(36).substr(2, 9),
                    title: hypothesisData.title,
                    successFactor: hypothesisData.successFactor || 'not_applicable',
                    confidenceLevel: hypothesisData.confidenceLevel || '',
                    questions: Array.isArray(hypothesisData.questions) ? hypothesisData.questions : [],
                    interventions: []
                };
                return {
                    ...g,
                    hypotheses: [...(g.hypotheses || []), newHypothesis],
                    isDuplicateReviewPending: false
                };
            }
            return g;
        }));
    };

    const addIntervention = (goalId, interventionData) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                const newIntervention = {
                    id: Math.random().toString(36).substr(2, 9),
                    description: interventionData.description,
                    expectedEffect: interventionData.expectedEffect,
                    hypothesisIds: interventionData.hypothesisIds || [],
                    followUps: interventionData.followUps || []
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

    // Standalone addFollowUp removed - follow-ups are now part of interventions

    const updateEvaluationPlan = (goalId, updates) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    evaluationPlan: { ...(g.evaluationPlan || {}), ...updates }
                };
            }
            return g;
        }));
    };

    const addEvaluation = (goalId, evaluation) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                const newEval = { ...evaluation, id: Date.now().toString(), createdAt: new Date().toISOString() };
                return {
                    ...g,
                    evaluations: [...(g.evaluations || []), newEval]
                };
            }
            return g;
        }));
    };

    const updateEvaluation = (goalId, evalId, updates) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    evaluations: (g.evaluations || []).map(e => e.id === evalId ? { ...e, ...updates } : e)
                };
            }
            return g;
        }));
    };

    const deleteEvaluation = (goalId, evalId) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    evaluations: (g.evaluations || []).filter(e => e.id !== evalId)
                };
            }
            return g;
        }));
    };

    const updateHypothesis = (goalId, hypothesisId, updates) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    hypotheses: (g.hypotheses || []).map(h => h.id === hypothesisId ? { ...h, ...updates } : h),
                    isDuplicateReviewPending: false
                };
            }
            return g;
        }));
    };

    const updateIntervention = (goalId, interventionId, updates) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    interventions: (g.interventions || []).map(i => i.id === interventionId ? { ...i, ...updates } : i)
                };
            }
            return g;
        }));
    };

    const closeGoal = (goalId) => {
        setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'Closed' } : g));
    };

    const reopenGoal = (goalId) => {
        setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'Active' } : g));
    };

    const deleteHypothesis = (goalId, hypothesisId) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== goalId) return g;

            // 1. Remove the hypothesis
            const newHypotheses = (g.hypotheses || []).filter(h => h.id !== hypothesisId);

            // 2. Update and Filter interventions
            const newInterventions = (g.interventions || [])
                .map(i => ({
                    ...i,
                    hypothesisIds: (i.hypothesisIds || []).filter(hid => hid !== hypothesisId)
                }))
                // Remove interventions that no longer have ANY hypothesis linked
                .filter(i => (i.hypothesisIds || []).length > 0);

            return {
                ...g,
                hypotheses: newHypotheses,
                interventions: newInterventions,
                isDuplicateReviewPending: false
            };
        }));
    };

    const deleteIntervention = (goalId, interventionId) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== goalId) return g;
            return {
                ...g,
                interventions: (g.interventions || []).filter(i => i.id !== interventionId)
            };
        }));
    };

    const deleteFollowUp = (goalId, interventionId, followUpId) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== goalId) return g;
            return {
                ...g,
                interventions: (g.interventions || []).map(i => {
                    if (i.id !== interventionId) return i;
                    return {
                        ...i,
                        followUps: (i.followUps || []).filter(f => f.id !== followUpId)
                    };
                })
            };
        }));
    };

    const removeEvidence = (goalId, evidenceId) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    evidence: (g.evidence || []).filter(e => e.id !== evidenceId)
                };
            }
            return g;
        }));
    };

    const updateSituationAnalysis = (goalId, analysisData) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return { ...g, situationAnalysis: analysisData, isDuplicateReviewPending: false };
            }
            return g;
        }));
    };

    return (
        <GoalsContext.Provider value={{
            goals,
            addGoal,
            updateGoal,
            deleteGoal,
            duplicateGoal,
            archiveGoal,
            addEvidence,
            removeEvidence,
            addHypothesis,
            deleteHypothesis,
            updateHypothesis,
            addIntervention,
            deleteIntervention,
            updateIntervention,
            deleteFollowUp,
            updateEvaluationPlan,
            addEvaluation,
            updateEvaluation,
            deleteEvaluation,
            closeGoal,
            reopenGoal,
            updateSituationAnalysis,
            canAddEvidence,
            canEditGoal,
            canAddHypothesis,
            canAddIntervention,
            canCloseGoal,
            canReopenGoal,
            SCHOOLS,
            SCHOOL_YEARS
        }}>
            {children}
        </GoalsContext.Provider>
    );
};
