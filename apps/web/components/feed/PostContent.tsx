'use client';

import Link from 'next/link';

const MENTION_REGEX = /@([a-zA-Z0-9_]{1,30})/g;

export function PostContent({ content, className }: { content: string; className?: string }) {
  const parts = content.split(MENTION_REGEX);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <Link
              key={i}
              href={`/profile/${part}`}
              className="mention-link"
              onClick={(e) => e.stopPropagation()}
            >
              @{part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
