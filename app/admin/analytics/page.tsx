import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package, Calendar } from 'lucide-react';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon }: { title: string; value: string; change: string; trend: 'up' | 'down'; icon: React.ElementType }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            {change}
          </p>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">
          <Icon className="size-6 text-gray-700" />
        </div>
      </div>
    </Card>
  );
}

const monthlyData = [
  { month: 'Jan', revenue: 32450, orders: 245 },
  { month: 'Feb', revenue: 28900, orders: 198 },
  { month: 'Mar', revenue: 41200, orders: 312 },
  { month: 'Apr', revenue: 38500, orders: 287 },
  { month: 'May', revenue: 45600, orders: 356 },
  { month: 'Jun', revenue: 45230, orders: 284 },
];

const topProducts = [
  { name: 'Chrome Cargo Pants', sold: 156, revenue: 29643.44 },
  { name: 'Holographic Crop Top', sold: 234, revenue: 18716.66 },
  { name: 'Metallic Blazer', sold: 89, revenue: 26699.11 },
  { name: 'Sequin Midi Dress', sold: 67, revenue: 16749.33 },
  { name: 'Oversized Hoodie', sold: 198, revenue: 25737.02 },
];

const trafficSources = [
  { source: 'Direct', visits: 12450, percentage: 35 },
  { source: 'Organic Search', visits: 8900, percentage: 25 },
  { source: 'Social Media', visits: 7120, percentage: 20 },
  { source: 'Referral', visits: 4980, percentage: 14 },
  { source: 'Email', visits: 2130, percentage: 6 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Calendar className="size-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="R238,880" change="+23% from last month" trend="up" icon={DollarSign} />
        <StatCard title="Total Orders" value="1,682" change="+18% from last month" trend="up" icon={ShoppingCart} />
        <StatCard title="Total Customers" value="1,203" change="+15% from last month" trend="up" icon={Users} />
        <StatCard title="Avg. Order Value" value="R142" change="+5% from last month" trend="up" icon={Package} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Revenue Overview</h2>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="w-12 text-sm text-gray-600">{data.month}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-black rounded-lg"
                    style={{ width: `${(data.revenue / 50000) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-sm font-medium text-gray-900 text-right">R{data.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  <span className="text-sm text-gray-500">{source.visits.toLocaleString()} visits</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Top Performing Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={product.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sold}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">R{product.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${100 - index * 15}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}