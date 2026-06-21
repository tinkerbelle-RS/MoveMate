import { ChecklistSection } from './ChecklistSection';

export function ActionPlans({ checklists, onUpdate }) {
  return (
    <section>
      <h2 className="section-heading mb-6">Action plans & checklists</h2>
      <div className="space-y-6">
        <ChecklistSection
          title="Move-in checklist"
          subtitle="Get off on the right foot before you unpack."
          items={checklists.moveIn}
          sectionKey="moveIn"
          onUpdate={onUpdate}
        />
        <ChecklistSection
          title="During your lease"
          subtitle="Stay on top of rent, repairs, and reminders."
          items={checklists.during}
          sectionKey="during"
          onUpdate={onUpdate}
        />
        <ChecklistSection
          title="Move-out checklist"
          subtitle="Protect your deposit with a clear exit plan."
          items={checklists.moveOut}
          sectionKey="moveOut"
          onUpdate={onUpdate}
        />
      </div>
    </section>
  );
}
