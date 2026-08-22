export async function fetchAdminResource(resource, user) {
  const dev = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
  const headers = { 'Content-Type': 'application/json' };
  if (!dev) headers.Authorization = `Bearer ${await user.getIdToken()}`;
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
  const response = await fetch(`${base}${dev ? `/dev/admin/${resource}` : `/admin/${resource}`}`, { headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Unable to load ${resource}`);
  return body[resource] || [];
}

export async function fetchEmployeeData(user, employeeId) {
  const dev = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
  const headers = { 'Content-Type': 'application/json' };
  if (!dev) headers.Authorization = `Bearer ${await user.getIdToken()}`;
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
  const url = dev ? `${base}/dev/employee-data/${employeeId}` : `${base}/me/data`;
  const response = await fetch(url, { headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Unable to load employee data');
  return body;
}
