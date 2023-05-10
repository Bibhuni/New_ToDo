import './App.css';
import BarChart from './components/BarChar';
import NewTask from './components/NewTask';
import Taskfeed from './components/Taskfeed';

function App() {
  return (
    <div className="App">
      <BarChart/>
      <NewTask/>
      <Taskfeed/>
    </div>
  );
}

export default App;
