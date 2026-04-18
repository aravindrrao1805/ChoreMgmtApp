import { getMemberColor } from '../../utils/colors';

export default function MemberItem({ member, members, onRemove }) {
  const color = getMemberColor(member.id, members);
  return (
    <div className="member-item">
      <span className="member-dot" style={{ backgroundColor: color }} />
      <span className="member-name">{member.name}</span>
      <button
        className="member-remove"
        onClick={() => onRemove(member.id)}
        title="Remove member"
      >
        ✕
      </button>
    </div>
  );
}
