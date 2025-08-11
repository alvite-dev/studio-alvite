interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
        {action && (
          <div className="self-start sm:self-auto">{action}</div>
        )}
      </div>
    </div>
  );
}