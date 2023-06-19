import './App.css';
import { useState } from 'react';

function App() {
  const [voteType, setVoteType] = useState('Nay');


  const handleClick = async () => {
    const response = await fetch('http://localhost:3001/vote', {
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
