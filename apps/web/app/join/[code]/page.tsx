import { redirect } from 'next/navigation';

export default async function JoinRedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/register?ref=${encodeURIComponent(code)}`);
}
