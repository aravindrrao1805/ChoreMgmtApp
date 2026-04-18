import AddMemberForm from './AddMemberForm';
import MemberItem from './MemberItem';

export default function MemberPanel({ members, onAdd, onRemove }) {
  return (
    <aside className="member-panel">
      <h3>Team Members</h3>
      <div className="member-list">
        {members.length === 0 && <p className="empty-hint">No members yet</p>}
        {members.map((m) => (
          <MemberItem key={m.id} member={m} members={members} onRemove={onRemove} />
        ))}
      </div>
      <AddMemberForm onAdd={onAdd} />
    </aside>
  );
}
