import { Suspense } from 'react';

export const metadata = {
  title: 'Portal Players',
};

export default function PortalPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Portal Players</h1>

      <Suspense
        fallback={
          <div className="admin-card overflow-hidden">
            <div className="skeleton h-96 w-full" />
          </div>
        }
      >
        <PortalTable />
      </Suspense>
    </div>
  );
}

async function PortalTable() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: players, error } = await supabase
    .from('portal_players')
    .select(`
      *,
      origin_school:schools!portal_players_origin_school_id_fkey(id, name, abbreviation),
      destination_school:schools!portal_players_destination_school_id_fkey(id, name, abbreviation)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error || !players || players.length === 0) {
    return (
      <div className="admin-card p-8 text-center text-[var(--admin-text-muted)]">
        No portal players found.
      </div>
    );
  }

  return (
    <>
      <div className="text-sm text-[var(--admin-text-muted)]">
        Showing {players.length} player{players.length !== 1 ? 's' : ''}
      </div>

      <div className="admin-card overflow-hidden overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Origin School</th>
              <th>Destination School</th>
              <th>Status</th>
              <th>Stars</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const originSchool = player.origin_school as {
                id?: string;
                name?: string;
                abbreviation?: string;
              } | null;
              const destinationSchool = player.destination_school as {
                id?: string;
                name?: string;
                abbreviation?: string;
              } | null;

              return (
                <tr key={player.id}>
                  <td>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      {player.position}
                    </p>
                  </td>
                  <td className="text-sm text-[var(--admin-text-secondary)]">
                    {originSchool ? (
                      <span title={originSchool.name}>
                        {originSchool.abbreviation ?? originSchool.name}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="text-sm text-[var(--admin-text-secondary)]">
                    {destinationSchool ? (
                      <span title={destinationSchool.name}>
                        {destinationSchool.abbreviation ?? destinationSchool.name}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        player.status === 'ENTERED'
                          ? 'bg-[var(--admin-info)]/20 text-[var(--admin-info)]'
                          : player.status === 'COMMITTED'
                            ? 'bg-[var(--admin-success)]/20 text-[var(--admin-success)]'
                            : player.status === 'WITHDRAWN'
                              ? 'bg-[var(--admin-warning)]/20 text-[var(--admin-warning)]'
                              : 'bg-[var(--admin-surface-raised)] text-[var(--admin-text-secondary)]'
                      }`}
                    >
                      {player.status}
                    </span>
                  </td>
                  <td className="text-sm">{player.stars ?? '-'}</td>
                  <td className="text-xs text-[var(--admin-text-muted)]">
                    {new Date(player.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
