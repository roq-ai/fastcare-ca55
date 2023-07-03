const mapping: Record<string, string> = {
  'insurance-policies': 'insurance_policy',
  'medicine-inventories': 'medicine_inventory',
  organizations: 'organization',
  'patient-records': 'patient_record',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
