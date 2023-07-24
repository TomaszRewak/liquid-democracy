import './App.css';
import { useEffect, useState } from 'react';

const url = 'http://localhost:3001/'

function App() {
  console.log('App.js');

  const [polls, setPolls] = useState([]);
  const [voteType, setVoteType] = useState('Nay');

  useEffect(() => {
    const getPolls = async () => {
      const response = await fetch(`${url}polls`);
      const data = await response.json();

      setPolls(data.polls);
    }

    getPolls();
  }, []);

  const handleClick = async () => {
    const response = await fetch(`${url}vote`, {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vote_type: voteType,
        vote_id: '550e8400-e29b-41d4-a716-446655440000',
        request_id: '550e8400-e29b-41d4-a716-446655440000'
      })
    })

    console.log(response);
  }

  return (
    <div className='App'>
      <div>
        {polls.map(poll => (
          <div key={poll.id}>
            <h3>{poll.name}</h3>
            <p>{poll.description}</p>
          </div>
        ))}
      </div>
      <select value={voteType} onChange={e => setVoteType(e.target.value)}>
        <option value='Yea'>Yes</option>
        <option value='Nay'>No</option>
      </select>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  );
}

export default App;
