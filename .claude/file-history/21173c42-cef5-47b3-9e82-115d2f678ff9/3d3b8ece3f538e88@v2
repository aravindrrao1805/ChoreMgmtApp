import { useState } from 'react';

export default function AddMemberForm({ onAdd }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
  }

  return (
    <form onSubmit={handleSubmit} className="add-member-form">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className="btn-primary btn-sm">Add</button>
    </form>
  );
}
