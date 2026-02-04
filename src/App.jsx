import { Routes, Route, Navigate, Link } from 'react-router-dom';
import GoalsList from './pages/goals/GoalsList';
import GoalCreate from './pages/goals/GoalCreate';
import GoalEdit from './pages/goals/GoalEdit';
import Settings from './pages/Settings';
import GoalGuard from './pages/goals/GoalGuard';

// V3 Single Source of Truth
import GoalOverviewV3 from './pages/goals/v3/GoalOverviewV3';

import './App.css';
import { GoalsProvider } from './context/GoalsContext';

function AppContent() {
  return (
    <div className="app-main">
      <Routes>
        <Route path="/" element={<Navigate to="/goals" replace />} />
        <Route path="/goals" element={<GoalsList />} />
        <Route path="/goals/new" element={<GoalCreate />} />

        {/* Goal Detail - Single V3 Page */}
        <Route path="/goals/:id" element={<GoalGuard><GoalOverviewV3 /></GoalGuard>} />

        {/* Universal Edit Route */}
        <Route path="/goals/:id/edit" element={<GoalGuard><GoalEdit /></GoalGuard>} />

        {/* Legacy Redirects (Cleanup) */}
        <Route path="/goals/:id/overview" element={<Navigate to="../" replace relative="path" />} />
        <Route path="/goals/:id/causes" element={<Navigate to="../" replace relative="path" />} />
        <Route path="/goals/:id/interventions" element={<Navigate to="../" replace relative="path" />} />
        <Route path="/goals/:id/evaluation" element={<Navigate to="../" replace relative="path" />} />

        <Route path="/settings" element={<Settings />} />
      </Routes>
      <footer style={{ marginTop: '4rem', padding: '2rem 0', textAlign: 'center', fontSize: '0.75rem', color: '#ccc', letterSpacing: '0.05em', borderTop: 'none' }}>
        Skolanalys Goal Setting Module • Mock Data
      </footer>
    </div>
  );
}

function App() {
  return (
    <GoalsProvider>
      <AppContent />
    </GoalsProvider>
  );
}

export default App;
