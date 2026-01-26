import { Routes, Route, Navigate } from 'react-router-dom';
import GoalsList from './pages/goals/GoalsList';
import GoalCreate from './pages/goals/GoalCreate';
import GoalDetail from './pages/goals/GoalDetail';
import GoalEdit from './pages/goals/GoalEdit';
import './App.css';
import { GoalsProvider } from './context/GoalsContext';

function App() {
  return (
    <GoalsProvider>
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/goals" replace />} />
          <Route path="/goals" element={<GoalsList />} />
          <Route path="/goals/new" element={<GoalCreate />} />
          <Route path="/goals/:id" element={<GoalDetail />} />
          <Route path="/goals/:id/edit" element={<GoalEdit />} />
        </Routes>
      </div>
    </GoalsProvider>
  );
}

export default App;
