import type { ReactNode } from 'react';

export default function GenreManagementHeader({
  action,
}: {
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <h2
        className="text-5xl font-extrabold tracking-tighter leading-[1.1]"
        style={{ color: '#2b352f' }}
      >
        <span className="italic" style={{ color: '#335b48' }}>
          Genre Management
        </span>
      </h2>
      {action}
    </div>
  );
}
