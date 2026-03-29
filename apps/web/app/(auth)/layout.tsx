export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-ink">CFB Social</h1>
          <hr className="gridiron-divider mx-auto mt-3 w-24" />
        </div>

        {/* Auth card */}
        <div className="gridiron-card p-8">{children}</div>
      </div>
    </div>
  );
}
