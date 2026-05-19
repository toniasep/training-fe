interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <header className="mb-8">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
  </header>
);
