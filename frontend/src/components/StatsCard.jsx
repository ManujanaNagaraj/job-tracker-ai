import { memo } from 'react'

function StatsCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default memo(StatsCard)
