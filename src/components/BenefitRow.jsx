import { Shield, DollarSign, Calendar } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'No more surprise fees',
    description: 'See every charge upfront in plain English.',
  },
  {
    icon: Shield,
    title: 'Protect your deposit',
    description: 'Know your move-out obligations before it\'s too late.',
  },
  {
    icon: Calendar,
    title: 'Never miss a key deadline again',
    description: 'Get checklists tied to your actual lease dates.',
  },
];

export default function BenefitRow() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {benefits.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
      ))}
    </div>
  );
}
