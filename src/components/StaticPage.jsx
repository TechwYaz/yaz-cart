import PageHeader from "./PageHeader";

export default function StaticPage({ title, subtitle, children }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} crumbs={[{ label: title }]} />
      <div className="mx-auto max-w-3xl space-y-4 pb-10 text-gray-700">{children}</div>
    </>
  );
}
