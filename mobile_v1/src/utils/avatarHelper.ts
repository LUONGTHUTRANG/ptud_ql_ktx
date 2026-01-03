// Màu sắc consistent cho avatar
const AVATAR_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
];

export const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};

export const getAvatarColor = (name: string): string => {
  if (!name) return AVATAR_COLORS[0];
  // Sử dụng mã ASCII của chữ cái đầu để chọn màu
  const charCode = name.charCodeAt(0);
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
};

export const getAvatarInitials = (name: string) => {
  return {
    initials: getInitials(name),
    color: getAvatarColor(name),
  };
};
