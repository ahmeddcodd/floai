function readUserMetadata(user) {
  const metadata = user?.user_metadata;
  if (!metadata || typeof metadata !== "object") {
    return {};
  }
  return metadata;
}

function readAvatarUrl(user) {
  const metadata = readUserMetadata(user);
  const avatarUrl = metadata.avatar_url || metadata.picture;
  return typeof avatarUrl === "string" && avatarUrl.trim() ? avatarUrl : "";
}

function readDisplayName(user) {
  const metadata = readUserMetadata(user);
  const preferredName = metadata.full_name || metadata.name;
  if (typeof preferredName === "string" && preferredName.trim()) {
    return preferredName.trim();
  }

  const email = typeof user?.email === "string" ? user.email : "";
  if (email) {
    return email;
  }
  return "Signed-in user";
}

function readInitial(user) {
  const name = readDisplayName(user).trim();
  if (!name) return "?";
  return name[0].toUpperCase();
}

export default function UserAccountBadge({ user }) {
  if (!user) return null;

  const avatarUrl = readAvatarUrl(user);
  const displayName = readDisplayName(user);
  const email = typeof user.email === "string" ? user.email : "";

  return (
    <div className="account-badge" title={email || displayName}>
      <span className="account-avatar" aria-hidden="true">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span>{readInitial(user)}</span>
        )}
      </span>
      <span className="account-badge-text">
        <span className="account-badge-name">{displayName}</span>
        {email ? <span className="account-badge-email">{email}</span> : null}
      </span>
    </div>
  );
}
