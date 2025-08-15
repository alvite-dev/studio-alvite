interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="px-6 py-8 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between sm:hidden w-full">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          {action && <div>{action}</div>}
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:items-center sm:justify-between sm:w-full">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
          {action && (
            <div>{action}</div>
          )}
        </div>
      </div>
    </div>
  );
}