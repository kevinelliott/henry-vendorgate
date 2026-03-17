interface StatusBadgeProps {
  status: 'approved' | 'partial' | 'blocked' | 'overdue' | 'pending' | 'submitted' | 'rejected'
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const configs = {
    approved: { label: 'Approved', className: 'bg-green-100 text-green-800', icon: '✅' },
    partial: { label: 'Partial', className: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
    blocked: { label: 'Blocked', className: 'bg-red-100 text-red-800', icon: '🔴' },
    overdue: { label: 'Overdue', className: 'bg-orange-100 text-orange-800', icon: '❌' },
    pending: { label: 'Pending', className: 'bg-gray-100 text-gray-700', icon: '⏳' },
    submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-800', icon: '📄' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800', icon: '✗' },
  }

  const config = configs[status] || configs.pending
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.className} ${sizeClass}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}
