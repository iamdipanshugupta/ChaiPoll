const PollStatusBadge = ({ poll }) => {
  const now = new Date();
  const expired = new Date(poll.expiresAt) < now;

  if (poll.ispublished) {
    return (
      <span className="cp-badge cp-badge-pub">
        🌐 Published
      </span>
    );
  }

  if (expired) {
    return (
      <span className="cp-badge cp-badge-expired">
        ⏱ Expired
      </span>
    );
  }

  return (
    <span className="cp-badge cp-badge-active">
      <span className="live-dot" style={{ width: "6px", height: "6px" }} />
      Active
    </span>
  );
};

export default PollStatusBadge;