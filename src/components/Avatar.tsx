export default function Avatar({
  name,
  avatar,
  size = 112,
}: {
  name: string;
  avatar: string;
  size?: number;
}) {
  const initials = name.trim().slice(0, 2) || "我";

  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt={name}
        width={size}
        height={size}
        className="rounded-2xl object-cover shadow-md"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white shadow-md"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
