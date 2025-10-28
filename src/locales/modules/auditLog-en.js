// Audit Log module
export default {
  title: 'Operation Logs',
  table: {
    time: 'Operation Time',
    operator: 'Operator',
    module: 'Module',
    action: 'Action Type',
    details: 'Details',
    ip: 'IP Address',
    product: 'Related Product'
  },
  viewDetails: 'View',
  detailsDialog: {
    title: 'Operation Details',
    copy: 'Copy'
  },
  filter: {
    timeRange: 'Time Range',
    startTime: 'Start Time',
    endTime: 'End Time',
    module: 'Module',
    action: 'Action Type',
    product: 'Related Product',
    search: 'Search',
    filteredByProduct: 'Filtered by Product',
    modulePlaceholder: 'Select module',
    actionPlaceholder: 'Select action type',
    shortcuts: {
      lastWeek: 'Last Week',
      lastMonth: 'Last Month',
      lastThreeMonths: 'Last Quarter'
    }
  },
  modules: {
    user: 'User Management',
    auth: 'Authentication',
    product: 'Product Management',
    feature: 'Feature Management',
    license_type: 'License Type',
    firmware_version: 'Firmware Version',
    software_version: 'Software Version',
    device: 'Device Management'
  },
  actions: {
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    login: 'Login',
    register: 'Register'
  },
  userCard: {
    title: 'User Information',
    email: 'Email',
    lastLogin: 'Last Login',
    status: 'Status',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  error: {
    invalidJson: 'Invalid JSON format'
  },
  product: {
    view: 'View Product',
    filter: 'Filter Logs by Product',
    clearFilter: 'Clear Filter'
  }
}
