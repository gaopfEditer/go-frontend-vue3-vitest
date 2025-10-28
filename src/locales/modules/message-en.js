// Message module
export default {
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
}
