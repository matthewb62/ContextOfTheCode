import { Link } from 'react-router-dom'
import { Page, Section, Code, A, ORIGINAL_CODE_URL } from '../components/Prose'

const TEAM = 'Matthew Burke, Hugh Murtagh and Peter Kennedy'
const STACK = ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'React', 'Recharts', 'nginx']

const RUBRIC = [
  ['Meets project brief', 5],
  ['Stretch goal delivered', 5],
  ['Understanding of code built', 4],
  ['Engineering & innovation', 4],
  ['Communication & presentation', 3],
]

const CONTRACT = [
  ['id', '–', '–', 'UUID, primary key'],
  ['device_id', 'str', 'str, required', 'VARCHAR(255), indexed'],
  ['source', 'str', 'str, required', 'VARCHAR(50)'],
  ['metric_name', 'str', 'str, required', 'VARCHAR(255), indexed'],
  ['value', 'float', 'float, required', 'FLOAT8'],
  ['unit', 'str', 'str | None', 'VARCHAR(50), nullable'],
  ['recorded_at', 'datetime, set at source', 'datetime | None', 'TIMESTAMPTZ, indexed'],
]

const HIGHLIGHTS = [
  ['Industry-standard stack', 'Docker, Redis, FastAPI, PostgreSQL and React: tools used in production systems, chosen deliberately.'],
  ['Extensible collectors', 'Any machine can push data into the pipeline with no core changes. Proven by adding an Open-Meteo weather collector late on.'],
  ['Dynamic "Other Sources" page', 'Add a new collector and its data appears on the dashboard automatically, with no frontend changes or redeploy.'],
  ['Live command system', 'The dashboard pushes interval and island changes to collectors in real time over Redis pub/sub, no restarts.'],
  ['Redis, three ways', 'Persistent upload queue on the collector machine, pub/sub command broker on the VM, and a 30s response cache for the Reporting API.'],
  ['Interactive API docs', 'Auto-generated /docs for both FastAPI services, beyond the spec and handy for testing.'],
  ['Proactive indexing', 'Indexes on device_id, metric_name and recorded_at, added before scale became a problem.'],
  ['Cursor pagination', 'Timestamp cursors instead of offsets, so new inserts never cause duplicate or skipped rows.'],
]

function Results() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-lg font-semibold text-slate-800">2nd highest grade in the class</p>
        <p className="text-sm text-slate-400">Final grade 72%</p>
      </div>
      <div className="mt-4 space-y-3">
        {RUBRIC.map(([label, score]) => (
          <div key={label} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[14rem_1fr_auto]">
            <span className="text-sm text-slate-600">{label}</span>
            <div className="col-span-2 row-start-2 h-2 rounded-full bg-slate-100 sm:col-span-1 sm:row-start-auto">
              <div
                className={`h-2 rounded-full ${score === 5 ? 'bg-purple-600' : 'bg-purple-300'}`}
                style={{ width: `${score * 20}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-800 tabular-nums">{score}/5</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Our lowest score was the presentation, not the tech.{' '}
        <Link to="/how-it-went" className="text-purple-600 hover:underline">More on that here.</Link>
      </p>
    </div>
  )
}

function ContractTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Field</th>
            <th className="px-4 py-3 font-medium">Redis queue</th>
            <th className="px-4 py-3 font-medium">Pydantic</th>
            <th className="px-4 py-3 font-medium">PostgreSQL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {CONTRACT.map(([field, ...cols]) => (
            <tr key={field}>
              <td className="px-4 py-2.5 font-mono text-[13px] text-slate-800">{field}</td>
              {cols.map((c, i) => (
                <td key={i} className="px-4 py-2.5 text-slate-600">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function About() {
  return (
    <Page
      title="About the project"
      subtitle="MetricsFlow · Context of the Code · Immersive Software Engineering, University of Limerick · Spring 2026"
    >
      <div className="-mt-4 space-y-3">
        <p className="text-sm text-slate-600">Built by {TEAM}.</p>
        <div className="flex flex-wrap gap-2">
          {STACK.map(s => (
            <span key={s} className="rounded-full bg-slate-200/70 px-3 py-1 text-xs font-medium text-slate-700">{s}</span>
          ))}
        </div>
      </div>

      <Section title="Result">
        <Results />
      </Section>

      <Section title="What it was">
        <p>
          The brief was to collect metrics from several different sources, ship them to a backend
          on a university VM, store them, and show them on a web dashboard. The stretch goal was
          two-way control: the dashboard sending commands back to the collectors. We pulled from
          four sources: PC system stats, our Android app (via Supabase), Fortnite island player
          counts and Limerick weather.
        </p>
      </Section>

      <Section title="System diagram">
        <a href="/system-diagram.png" target="_blank" rel="noreferrer" className="block">
          <img
            src="/system-diagram.png"
            alt="MetricsFlow system diagram: collectors on a local machine push through a local Redis queue to the Aggregator API on the VM, which writes to PostgreSQL; the Reporting API serves the React dashboard, and commands flow back over Redis pub/sub."
            className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          />
        </a>
        <p className="text-xs text-slate-400">From our final presentation. Click to open full size.</p>
      </Section>

      <Section title="One metric contract">
        <p>
          Every collector emitted the same flat shape, validated by Pydantic on the way in and stored
          in a single <Code>metric_events</Code> table. Adding a new source never touched the backend.
        </p>
        <ContractTable />
      </Section>

      <Section title="Highlights">
        <div className="grid gap-3 sm:grid-cols-2">
          {HIGHLIGHTS.map(([title, text]) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-800">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What's running here now">
        <p>
          The VM is gone, so this is a cut-down version: the same React dashboard on Vercel, showing
          only the Fortnite data through one cached serverless function. No database or collectors
          needed, since Epic's API already keeps 7 days of history. The full original code is at
          the <A href={ORIGINAL_CODE_URL}>last commit before the rework</A>.
        </p>
      </Section>
    </Page>
  )
}
