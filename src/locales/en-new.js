// English language pack - modular version
import system from './modules/system-en.js'
import common from './modules/common-en.js'
import auth from './modules/auth-en.js'
import message from './modules/message-en.js'
import products from './modules/products-en.js'
import auditLog from './modules/auditLog-en.js'
import menu from './modules/menu-en.js'

// License Types module
const licenseTypes = {
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
}

// Product Features module
const productFeatures = {
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
}

// Firmware Versions module
const firmwareVersions = {
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
}

// Software Versions module
const softwareVersions = {
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
}

// Device Management module
const devices = {
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

export default {
  system,
  common,
  login: auth.login,
  register: auth.register,
  message,
  products,
  licenseTypes,
  productFeatures,
  auditLog,
  firmwareVersions,
  softwareVersions,
  menu,
  devices
}
