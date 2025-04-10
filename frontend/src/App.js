import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoListABI from "./TodoListABI.json"; // Paste ABI from Remix or Hardhat artifacts

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
  const [account, setAccount] = useState("");
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const todo = new ethers.Contract(contractAddress, TodoListABI, signer);
    setAccount(await signer.getAddress());

    const taskCount = await todo.taskCount();
    let tasksArray = [];
    for (let i = 1; i <= taskCount; i++) {
      const task = await todo.tasks(i);
      tasksArray.push(task);
    }
    setTasks(tasksArray);
  };

  const createTask = async () => {
    if (!input) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const todo = new ethers.Contract(contractAddress, TodoListABI, signer);
    await todo.createTask(input);
    setInput("");
    loadBlockchainData();
  };

  const toggleTask = async (id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const todo = new ethers.Contract(contractAddress, TodoListABI, signer);
    await todo.toggleCompleted(id);
    loadBlockchainData();
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div className="App">
      <h2>Decentralized To-Do</h2>
      <p>Connected: {account}</p>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={createTask}>Add Task</button>
      <ul>
        {tasks.map((t, idx) => (
          <li key={idx}>
            <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
              {t.content}
            </span>
            <button onClick={() => toggleTask(t.id)}>Toggle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
