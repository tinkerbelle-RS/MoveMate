import { scoreBarColor } from '../../lib/goals';

function RadarChart({ dimensions }) {
  const size = 220;
  const center = size / 2;
  const maxRadius = 80;
  const levels = 5;
  const count = dimensions.length;
  const angleStep = (Math.PI * 2) / count;

  const pointAt = (index, value) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 5) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const value = level + 1;
    const points = dimensions
      .map((_, i) => {
        const p = pointAt(i, value);
        return `${p.x},${p.y}`;
      })
      .join(' ');
    return points;
  });

  const dataPoints = dimensions
    .map((d, i) => {
      const p = pointAt(i, d.score);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const axisLines = dimensions.map((d, i) => {
    const p = pointAt(i, 5);
    return (
      <line
        key={d.id}
        x1={center}
        y1={center}
        x2={p.x}
        y2={p.y}
        stroke="#e2e8f0"
        strokeWidth="1"
      />
    );
  });

  const labels = dimensions.map((d, i) => {
    const p = pointAt(i, 5.8);
    return (
      <text
        key={d.id}
        x={p.x}
        y={p.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-slate-500 text-[9px]"
      >
        {d.label.split(' ')[0]}
      </text>
    );
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-56 w-56">
      {gridPolygons.map((points, i) => (
        <polygon key={i} points={points} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {axisLines}
      <polygon points={dataPoints} fill="rgba(37, 99, 235, 0.2)" stroke="#2563eb" strokeWidth="2" />
      {dimensions.map((d, i) => {
        const p = pointAt(i, d.score);
        return <circle key={d.id} cx={p.x} cy={p.y} r="4" fill="#2563eb" />;
      })}
      {labels}
    </svg>
  );
}

function BarList({ dimensions, priorityIds }) {
  return (
    <ul className="space-y-4">
      {dimensions.map((d) => {
        const isPriority = priorityIds.includes(d.id);
        const pct = (d.score / d.max_score) * 100;

        return (
          <li key={d.id}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800">
                {d.label}
                {isPriority && (
                  <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
                    Priority
                  </span>
                )}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {d.score}/{d.max_score}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${scoreBarColor(d.score)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{d.summary}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default function GoalFitChart({ evaluation, priorityIds = [] }) {
  if (!evaluation) return null;

  return (
    <div className="card">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Goal fit meter</h3>
          <p className="mt-1 text-sm text-slate-600">{evaluation.headline}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-brand-50 px-5 py-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Overall fit</p>
          <p className="text-3xl font-bold text-brand-700">{evaluation.overall_fit.toFixed(1)}</p>
          <p className="text-xs text-brand-600">out of 5</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-xl bg-slate-50 p-4">
          <RadarChart dimensions={evaluation.dimensions} />
        </div>
        <BarList dimensions={evaluation.dimensions} priorityIds={priorityIds} />
      </div>
    </div>
  );
}
