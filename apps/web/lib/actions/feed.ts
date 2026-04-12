'use server';

import { revalidateTag } from 'next/cache';

/** Bust the unstable_cache for feed queries so new posts appear immediately. */
export async function revalidateFeed() {
  revalidateTag('feed');
}
