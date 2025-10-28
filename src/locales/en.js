export default {
  system: {
    name: 'iRay Authorization System',
    description: 'Secure and Reliable Enterprise Authorization Platform'
  },
  login: {
    title: 'Account Login',
    email: 'Email Account',
    emailPlaceholder: 'Please enter email',
    password: 'Password',
    passwordPlaceholder: 'Please enter password',
    button: 'Login',
    loading: 'Logging in...',
    error: 'Login failed',
    unauthorized: 'Login failed: Unauthorized',
    toRegister: 'No account? Register now',
    toLogin: 'Have an account? Login now'
  },
  products: {
    title: 'Product Management',
    addButton: 'Add Product',
    table: {
      code: 'Product Code',
      name: 'Product Name', 
      type: 'Product Type',
      index: 'No.',
      actions: 'Actions',
      createTime: 'Create Time',
      updateTime: 'Update Time',
      mainManager: 'Main Manager'
    },
    empty: 'No product data',
    dialog: {
      addTitle: 'Add Product',
      editTitle: 'Edit Product',
      code: 'Product Code',
      name: 'Product Name',
      type: 'Product Type',
      cancel: 'Cancel',
      confirm: 'Confirm'
    },
    message: {
      deleteConfirm: 'Are you sure you want to delete this product?',
      operationFailed: 'Operation failed',
      deleteFailed: 'Delete failed'
    },
    searchPlaceholder: 'Search products...',
    permissionDialog: {
      title: 'Permission Management',
      productName: 'Product Name',
      managersList: 'Managers List',
      email: 'Email',
      role: 'Role',
      permissions: 'Permissions',
      actions: 'Actions',
      mainManager: 'Main Manager',
      manager: 'Manager',
      permFull: 'Full Access',
      permRead: 'Read Only',
      setAsMain: 'Set as Main',
      remove: 'Remove',
      addManager: 'Add Manager',
      enterEmail: 'Enter email',
      selectPerm: 'Select permission',
      add: 'Add',
      close: 'Close',
      emailRequired: 'Email address is required',
      remark: 'Remark',
      remarkPlaceholder: 'Enter remark',
      setMainTitle: 'Set Main Manager',
      setMainConfirm: 'Are you sure you want to set this user as the main manager? The current main manager will become a regular manager.'
    }
  },
  licenseTypes: {
    title: 'License Type Management',
    manageTypes: 'Manage',
    dialog: {
      title: 'Add License Type',
      typeName: 'Type Name',
      typeNamePlaceholder: 'Enter type name',
      typeNameRequired: 'Type name is required',
      typeCode: 'Type Code',
      typeCodePlaceholder: 'Enter type code',
      typeCodeRequired: 'Type code is required',
      features: 'Features',
      featuresPlaceholder: 'Select features',
      editFeatures: 'Edit Features',
      noFeatures: 'No features available'
    }
  },
  productFeatures: {
    title: 'Product Feature Management',
    manageFeatures: 'Manage',
    dialog: {
      title: 'Product Feature Management',
      featureName: 'Feature Name',
      featureNamePlaceholder: 'Enter feature name',
      featureNameRequired: 'Feature name is required',
      featureCode: 'Feature Code',
      featureCodePlaceholder: 'Enter feature code',
      featureCodeRequired: 'Feature code is required',
      addFeature: 'Add Feature'
    }
  },
  auditLog: {
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
  },
  common: {
    edit: 'Edit',
    delete: 'Delete',
    logout: 'Logout',
    warning: 'Warning',
    confirm: 'Confirm',
    cancel: 'Cancel',
    permissions: 'Permissions',
    pagination: {
      total: 'Total {total} items',
      prev: 'Previous',
      next: 'Next',
      to: 'Go to',
      page: 'page',
      perPage: 'items/page',
      showing: 'Showing {from} to {to} of {total} items'
    },
    copySuccess: 'Copy successful',
    copyFailed: 'Copy failed'
  },
  message: {
    error: {
      network: 'Network error',
      server: 'Server error',
      unauthorized: 'Unauthorized, please login again',
      validation: 'Please check your input',
      unknown: 'Unknown error',
      copyFailed: 'Copy failed',
      productHasRelations: 'Product has associated data. Please delete all versions, license types and features first.'
    },
    success: {
      save: 'Saved successfully',
      delete: 'Deleted successfully',
      update: 'Updated successfully',
      create: 'Created successfully',
      register: 'Registration successful, please login',
      copy: 'Copied successfully',
      reuseSuccess: 'Reused successfully'
    },
    confirm: {
      delete: 'Are you sure you want to delete?',
      logout: 'Are you sure you want to logout?',
      transfer: 'Are you sure you want to transfer main manager role?'
    },
    info: {
      noVersionsToReuse: 'No versions available to reuse',
      noFeaturesInLastVersion: 'No features in last version to reuse',
      noFirmwaresInLastVersion: 'No compatible firmware in last version to reuse'
    }
  },
  register: {
    title: 'Register',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Please confirm your password',
    button: 'Register',
    passwordMismatch: 'Passwords do not match'
  },
  firmwareVersions: {
    title: 'Firmware Version Management',
    manage: 'Manage',
    empty: 'No firmware versions',
    dialog: {
      title: 'Firmware Version Management',
      addVersion: 'Add Firmware Version',
      editVersion: 'Edit Firmware Version',
      lastVersion: 'Last Version: {version}',
      lastVersionHover: 'Sorted by release date',
      version: 'Version',
      releaseDate: 'Release Date',
      releaseDatePlaceholder: 'Select release date',
      versionPlaceholder: 'Enter version number',
      remark: 'Remark',
      remarkPlaceholder: 'Enter remark',
      createdBy: 'Created By',
      createdAt: 'Created At'
    },
    validation: {
      versionRequired: 'Version is required',
      releaseDateRequired: 'Release date is required'
    }
  },
  softwareVersions: {
    title: 'Software Version Management',
    manage: 'Manage',
    empty: 'No software versions',
    dialog: {
      title: 'Software Version Management',
      addVersion: 'Add Software Version',
      editVersion: 'Edit Software Version',
      lastVersion: 'Last Version: {version}',
      lastVersionHover: 'Sorted by release date',
      version: 'Version',
      versionPlaceholder: 'Enter version number',
      releaseDate: 'Release Date',
      releaseDatePlaceholder: 'Select release date',
      remark: 'Remark',
      remarkPlaceholder: 'Enter remark',
      updateLog: 'Update Log',
      updateLogPlaceholder: 'Enter update log',
      features: 'Features',
      featuresPlaceholder: 'Select features',
      noFeatures: 'No features',
      noFeaturesAvailable: 'No features available',
      firmwares: 'Compatible Firmware',
      firmwaresPlaceholder: 'Select compatible firmware',
      noFirmwares: 'No compatible firmware',
      noFirmwaresAvailable: 'No firmware available',
      createdAt: 'Created At',
      reuseLastVersion: 'Reuse Last Version',
      createdBy: 'Created By'
    },
    validation: {
      versionRequired: 'Version is required',
      releaseDateRequired: 'Release date is required'
    }
  },
  menu: {
    dashboard: 'Dashboard',
    products: 'Products',
    users: 'Users',
    licenses: 'Licenses',
    licenseTypes: 'License Types',
    firmwareVersions: 'Firmware Versions',
    softwareVersions: 'Software Versions',
    devices: 'Device Management',
    roles: 'Roles',
    permissions: 'Permissions',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout'
  },
  devices: {
    title: 'Device Management',
    addButton: 'Register Device',
    batchRegisterButton: 'Batch Register Devices',
    batchUpdateButton: 'Batch Update License',
    searchPlaceholder: 'Search devices...',
    filterByProduct: 'Filter by Product',
    filterByStatus: 'Filter by Status',
    filterByLicenseType: 'Filter by License Type',
    empty: 'No device data',
    activeFilters: 'Active Filters',
    searchFilter: 'Search',
    clearAllFilters: 'Clear All Filters',
    table: {
      index: 'No.',
      serialNumber: 'Serial Number',
      product: 'Product',
      macAddress: 'MAC Address',
      status: 'Status',
      firmwareVersion: 'Firmware Version',
      licenseType: 'License Type',
      oemTag: 'OEM Tag',
      licenseTypeCode: 'License Type Code',
      productCode: 'Product Code',
      createTime: 'Create Time',
      updateTime: 'Update Time',
      lastActiveTime: 'Last Active Time',
      createdBy: 'Created By',
      updatedBy: 'Updated By',
      notes: 'Notes',
      remark: 'Remark',
      actions: 'Actions'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive'
    },
    dialog: {
      addTitle: 'Register Device',
      editTitle: 'Edit Device',
      serialNumber: 'Serial Number',
      product: 'Product',
      macAddress: 'MAC Address',
      status: 'Status',
      firmwareVersion: 'Firmware Version',
      licenseType: 'License Type',
      oemTag: 'OEM Tag',
      notes: 'Notes',
      remark: 'Remark',
      cancel: 'Cancel',
      confirm: 'Confirm'
    },
    batchDialog: {
      title: 'Batch Register Devices',
      product: 'Product',
      serialNumbers: 'Serial Number List',
      serialNumbersPlaceholder: 'Enter device serial numbers, one per line',
      status: 'Status',
      cancel: 'Cancel',
      confirm: 'Confirm'
    },
    batchUpdate: {
      title: 'Batch Update License',
      search: 'Search Devices',
      originalLicenseType: 'Original License Type (Optional)',
      newLicenseType: 'New License Type',
      previousStep: 'Previous',
      confirm: 'Confirm Selection',
      submit: 'Update License',
      selectionInfo: 'Found {total} devices matching your criteria. Please select devices to update:',
      selectedCount: 'Selected {count} devices:',
      more: 'more',
      noDeviceSelected: 'Please select at least one device',
      confirmPrompt: 'Are you sure you want to assign {type} license to {count} devices?',
      next: 'Next',
      searchSN: 'Search by SN',
      searchOEM: 'Search by OEM',
      searchSNPlaceholder: 'Enter device serial number',
      searchOEMPlaceholder: 'Enter OEM tag',
      searchResults: 'Search Results',
      addSelected: 'Add Selected',
      noResults: 'No matching devices found',
      selectedDevices: 'Selected Devices',
      noDevicesSelected: 'No devices selected. Please search and add devices.',
      targetLicenseType: 'Target License Type',
      selectTargetLicense: 'Select license type to apply',
      currentLicense: 'Current License',
      newLicense: 'New License',
      willChange: 'Will change',
      noChange: 'No change',
      remove: 'Remove',
      noDevicesToUpdate: 'No devices with license changes to update',
      nothingSelected: 'No devices selected'
    },
    validation: {
      serialNumberRequired: 'Serial number is required',
      serialNumberLength: 'Serial number must be between 3-50 characters',
      productRequired: 'Product is required',
      licenseTypeRequired: 'License type is required',
      macAddressFormat: 'Invalid MAC address format',
      serialNumbersRequired: 'Serial number list is required',
      oemTagRequired: 'OEM tag is required'
    },
    confirmDelete: 'Are you sure you want to delete this device?',
    createSuccess: 'Device registered successfully',
    updateSuccess: 'Device updated successfully',
    deleteSuccess: 'Device deleted successfully',
    batchCreateSuccess: 'Batch register devices successfully',
    batchUpdateSuccess: 'Batch update licenses successfully',
    downloadLicense: 'Download',
    downloadSuccess: 'License file downloaded successfully',
    downloadFailed: 'Failed to download license file'
  }
}