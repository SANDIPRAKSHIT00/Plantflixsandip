type Props = {
  title: string;
  value: string;
};

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-green-700 mt-2">{value}</p>
    </div>
  );
}
