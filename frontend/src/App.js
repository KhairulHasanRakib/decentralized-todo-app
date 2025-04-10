import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoListABI from "./TodoListABI.json";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
  const [account, setAccount] = useState("");
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not found!");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const todo = new ethers.Contract(contractAddress, TodoListABI, signer);

    const acc = await signer.getAddress();
    setAccount(acc);

    const taskCount = await todo.taskCount();
    let allTasks = [];

    for (let i = 1; i <= taskCount; i++) {
      let task = await todo.tasks(i);
      allTasks.push(task);
    }
    setTasks(allTasks);
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

  return (
    <div>
      <h2>Decentralized To-Do</h2>
      <p>Wallet: {account}</p>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={createTask}>Add Task</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            {t.content} - {t.completed ? "✅" : "❌"}
            <button onClick={() => toggleTask(t.id.toString())}>Toggle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
