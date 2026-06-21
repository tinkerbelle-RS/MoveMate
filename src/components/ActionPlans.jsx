import { ChecklistSection } from './ChecklistSection';

export function ActionPlans({ checklists, onUpdate }) {
  return (
    <section>
      <div className="mb-5">
        <p className="eyebrow">Execution</p>
        <h2 className="section-heading mt-1">Action plans & checklists</h2>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <ChecklistSection title="Move-in checklist" subtitle="Document the unit before you unpack." items={checklists.moveIn} sectionKey="moveIn" onUpdate={onUpdate} />
        <ChecklistSection title="During your lease" subtitle="Stay on top of rent, repairs, and reminders." items={checklists.during} sectionKey="during" onUpdate={onUpdate} />
        <ChecklistSection title="Move-out checklist" subtitle="Protect your deposit with a clear exit plan." items={checklists.moveOut} sectionKey="moveOut" onUpdate={onUpdate} />
      </div>
    </section>
  );
}
