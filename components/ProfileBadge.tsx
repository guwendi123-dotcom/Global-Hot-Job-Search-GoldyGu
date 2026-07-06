interface ProfileBadgeProps {
  icon: React.ReactNode;
  label: string;
}

export default function ProfileBadge({ icon, label }: ProfileBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-accent-light text-accent rounded-full font-medium">
      {icon}
      {label}
    </span>
  );
}
