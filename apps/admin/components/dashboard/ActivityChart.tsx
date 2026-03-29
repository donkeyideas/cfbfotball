'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ActivityChartProps {
  data: Array<{ date: string; posts: number; reactions: number }>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorReactions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />

        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 12 }}
          axisLine={{ stroke: '#475569' }}
          tickLine={{ stroke: '#475569' }}
        />

        <YAxis
          tick={{ fill: '#64748b', fontSize: 12 }}
          axisLine={{ stroke: '#475569' }}
          tickLine={{ stroke: '#475569' }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#e2e8f0',
          }}
          labelStyle={{ color: '#94a3b8' }}
          itemStyle={{ color: '#e2e8f0' }}
        />

        <Legend
          wrapperStyle={{ color: '#94a3b8', fontSize: 12 }}
        />

        <Area
          type="monotone"
          dataKey="posts"
          stroke="#6366f1"
          fillOpacity={1}
          fill="url(#colorPosts)"
          name="Posts"
        />

        <Area
          type="monotone"
          dataKey="reactions"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorReactions)"
          name="Reactions"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
