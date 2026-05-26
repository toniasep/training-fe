import { http, HttpResponse, delay } from 'msw';
import type { TUser } from '@/api/users/types';
import type { TRequest } from '@/api/requests/types';
import type { TAuditLog } from '@/api/audit-logs/types';

// -------------------------------------------------------------
// Seeded Database (In-Memory)
// -------------------------------------------------------------

const mockUsers: TUser[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'admin', status: 'active', password: 'password123', createdAt: '2026-05-01T08:00:00Z' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'operator', status: 'invited', password: 'password123', createdAt: '2026-05-02T09:00:00Z' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com', role: 'viewer', status: 'suspended', password: 'password123', createdAt: '2026-05-03T10:00:00Z' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'operator', status: 'active', password: 'password123', createdAt: '2026-05-04T11:00:00Z' },
  { id: '5', name: 'Chris Johnson', email: 'chris.johnson@example.com', role: 'viewer', status: 'active', password: 'password123', createdAt: '2026-05-05T12:00:00Z' },
  { id: '6', name: 'Forbidden User', email: 'forbidden@example.com', role: 'viewer', status: 'active', password: 'password123', createdAt: '2026-05-06T13:00:00Z' },
  { id: '7', name: 'Error 500 User', email: 'error-500@example.com', role: 'operator', status: 'active', password: 'password123', createdAt: '2026-05-07T14:00:00Z' },
];

const mockRequests: TRequest[] = [
  {
    id: 'REQ-001',
    title: 'Permohonan Cuti Tahunan',
    description: 'Pengajuan cuti tahunan selama 5 hari kerja mulai tanggal 1 Juni 2026.',
    requesterName: 'Michael Brown',
    status: 'approved',
    createdAt: '2026-05-10T08:30:00Z',
    priority: 'medium',
    assigneeName: 'John Doe',
  },
  {
    id: 'REQ-002',
    title: 'Pengadaan Laptop Baru',
    description: 'Laptop workstation Macbook Pro M3 16-inch untuk menunjang aktivitas software engineering.',
    requesterName: 'Emily Davis',
    status: 'open',
    createdAt: '2026-05-15T10:15:00Z',
    priority: 'high',
    assigneeName: 'Jane Smith',
  },
  {
    id: 'REQ-003',
    title: 'Reimbursement Internet',
    description: 'Biaya paket internet pascabayar bulan April 2026 sebesar Rp 250.000.',
    requesterName: 'Chris Johnson',
    status: 'approved',
    createdAt: '2026-05-02T14:20:00Z',
    priority: 'low',
    assigneeName: 'Emily Davis',
  },
  {
    id: 'REQ-004',
    title: 'Akses Repositori GitHub',
    description: 'Request akses read & write ke repositori git organisasi DOT untuk modul training frontend.',
    requesterName: 'Forbidden User',
    status: 'rejected',
    createdAt: '2026-05-18T16:45:00Z',
    priority: 'high',
    assigneeName: 'Chris Johnson',
  },
  {
    id: 'REQ-005',
    title: 'Izin Sakit',
    description: 'Izin tidak masuk kerja dikarenakan sakit demam tinggi. Surat keterangan dokter terlampir.',
    requesterName: 'Jane Smith',
    status: 'open',
    createdAt: '2026-05-22T09:00:00Z',
    priority: 'medium',
    assigneeName: 'John Doe',
  },
];

const mockAuditLogs: TAuditLog[] = [
  {
    id: 'LOG-001',
    action: 'LOGIN',
    actorName: 'john.doe@example.com',
    targetType: 'auth',
    targetId: '1',
    createdAt: '2026-05-25T09:00:00Z',
    details: 'Berhasil melakukan login ke sistem.',
  },
  {
    id: 'LOG-002',
    action: 'CREATE_USER',
    actorName: 'john.doe@example.com',
    targetType: 'user',
    targetId: '4',
    createdAt: '2026-05-25T09:15:00Z',
    details: 'Membuat user baru dengan email: emily.davis@example.com',
  },
  {
    id: 'LOG-003',
    action: 'UPDATE_REQUEST',
    actorName: 'jane.smith@example.com',
    targetType: 'request',
    targetId: 'REQ-001',
    createdAt: '2026-05-25T10:30:00Z',
    details: 'Menyetujui permohonan REQ-001 (Permohonan Cuti Tahunan).',
  },
  {
    id: 'LOG-004',
    action: 'LOGIN',
    actorName: 'jane.smith@example.com',
    targetType: 'auth',
    targetId: '2',
    createdAt: '2026-05-24T08:45:00Z',
    details: 'Berhasil melakukan login ke sistem.',
  },
  {
    id: 'LOG-005',
    action: 'UPDATE_USER',
    actorName: 'john.doe@example.com',
    targetType: 'user',
    targetId: '3',
    createdAt: '2026-05-24T11:20:00Z',
    details: 'Mengubah status user ID: 3 menjadi suspended.',
  },
  {
    id: 'LOG-006',
    action: 'CREATE_USER',
    actorName: 'john.doe@example.com',
    targetType: 'user',
    targetId: '5',
    createdAt: '2026-05-24T14:10:00Z',
    details: 'Membuat user baru dengan email: chris.johnson@example.com',
  },
  {
    id: 'LOG-007',
    action: 'UPDATE_REQUEST',
    actorName: 'jane.smith@example.com',
    targetType: 'request',
    targetId: 'REQ-003',
    createdAt: '2026-05-24T16:05:00Z',
    details: 'Menyetujui permohonan REQ-003 (Reimbursement Internet).',
  },
  {
    id: 'LOG-008',
    action: 'LOGIN',
    actorName: 'emily.davis@example.com',
    targetType: 'auth',
    targetId: '4',
    createdAt: '2026-05-23T09:30:00Z',
    details: 'Berhasil melakukan login ke sistem.',
  },
  {
    id: 'LOG-009',
    action: 'UPDATE_REQUEST',
    actorName: 'emily.davis@example.com',
    targetType: 'request',
    targetId: 'REQ-003',
    createdAt: '2026-05-23T10:15:00Z',
    details: 'Mengubah deskripsi permohonan REQ-003.',
  },
  {
    id: 'LOG-010',
    action: 'UPDATE_USER',
    actorName: 'john.doe@example.com',
    targetType: 'user',
    targetId: '2',
    createdAt: '2026-05-23T11:50:00Z',
    details: 'Mengubah status user ID: 2 menjadi invited.',
  },
  {
    id: 'LOG-011',
    action: 'LOGIN',
    actorName: 'chris.johnson@example.com',
    targetType: 'auth',
    targetId: '5',
    createdAt: '2026-05-22T08:00:00Z',
    details: 'Berhasil melakukan login ke sistem.',
  },
  {
    id: 'LOG-012',
    action: 'UPDATE_REQUEST',
    actorName: 'chris.johnson@example.com',
    targetType: 'request',
    targetId: 'REQ-004',
    createdAt: '2026-05-22T09:12:00Z',
    details: 'Mengajukan permohonan REQ-004 (Akses Repositori GitHub).',
  },
  {
    id: 'LOG-013',
    action: 'UPDATE_REQUEST',
    actorName: 'jane.smith@example.com',
    targetType: 'request',
    targetId: 'REQ-004',
    createdAt: '2026-05-22T13:40:00Z',
    details: 'Menolak permohonan REQ-004 (Akses Repositori GitHub).',
  },
  {
    id: 'LOG-014',
    action: 'LOGIN',
    actorName: 'john.doe@example.com',
    targetType: 'auth',
    targetId: '1',
    createdAt: '2026-05-21T08:50:00Z',
    details: 'Berhasil melakukan login ke sistem.',
  },
  {
    id: 'LOG-015',
    action: 'UPDATE_USER',
    actorName: 'john.doe@example.com',
    targetType: 'user',
    targetId: '1',
    createdAt: '2026-05-21T10:20:00Z',
    details: 'Mengubah data profil user ID: 1.',
  },
  {
    id: 'LOG-016',
    action: 'LOGIN',
    actorName: 'forbidden@example.com',
    targetType: 'auth',
    targetId: '6',
    createdAt: '2026-05-20T10:00:00Z',
    details: 'Berhasil melakukan login (Simulasi Forbidden User).',
  },
  {
    id: 'LOG-017',
    action: 'LOGIN',
    actorName: 'error-500@example.com',
    targetType: 'auth',
    targetId: '7',
    createdAt: '2026-05-20T11:00:00Z',
    details: 'Berhasil melakukan login (Simulasi Error User).',
  },
  {
    id: 'LOG-018',
    action: 'UPDATE_REQUEST',
    actorName: 'john.doe@example.com',
    targetType: 'request',
    targetId: 'REQ-002',
    createdAt: '2026-05-19T15:30:00Z',
    details: 'Mengubah assignee permohonan REQ-002 menjadi Jane Smith.',
  }
];

// Helper to extract bearer token and find user
function getUserByToken(authHeader: string | null): TUser | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  const prefix = 'mock-jwt-token-for-';
  if (!token.startsWith(prefix)) {
    return null;
  }
  const userId = token.substring(prefix.length);
  return mockUsers.find((u) => u.id === userId) || null;
}

// Helper to perform paging and return envelope
function paginate<T>(items: T[], page: number, pageSize: number): { data: T[]; total: number } {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return {
    data: items.slice(startIndex, endIndex),
    total: items.length,
  };
}

// -------------------------------------------------------------
// MSW Handlers Definition
// -------------------------------------------------------------

export const handlers = [
  // 1. AUTHENTICATION HANDLERS
  http.post('/api/auth/login', async ({ request }) => {
    await delay(800);

    interface LoginRequestBody {
      email?: string;
      password?: string;
    }
    const body = (await request.json()) as LoginRequestBody;
    const { email, password } = body;

    if (!email || !password) {
      return new HttpResponse(
        JSON.stringify({ message: 'Email dan password wajib diisi!' }),
        { status: 400 }
      );
    }

    if (email === 'error-500@example.com') {
      return new HttpResponse(
        JSON.stringify({ message: 'Internal Server Error (Simulasi Error 500)' }),
        { status: 500 }
      );
    }

    const matchedUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Email tidak terdaftar atau password salah!' }),
        { status: 401 }
      );
    }

    const token = `mock-jwt-token-for-${matchedUser.id}`;

    // Add to audit logs with correct fields
    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'LOGIN',
      actorName: matchedUser.email,
      targetType: 'auth',
      targetId: matchedUser.id,
      createdAt: new Date().toISOString(),
      details: 'Berhasil melakukan login (Mock API).',
    });

    return HttpResponse.json({
      token,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        status: matchedUser.status,
        createdAt: matchedUser.createdAt,
      },
    });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(500);

    const authHeader = request.headers.get('Authorization');
    const matchedUser = getUserByToken(authHeader);

    if (!matchedUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Sesi habis atau tidak valid (Unauthorized).' }),
        { status: 401 }
      );
    }

    if (matchedUser.email === 'error-500@example.com') {
      return new HttpResponse(
        JSON.stringify({ message: 'Internal Server Error pada pemanggilan sesi.' }),
        { status: 500 }
      );
    }

    return HttpResponse.json({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      status: matchedUser.status,
      createdAt: matchedUser.createdAt,
    });
  }),

  // 2. USERS HANDLERS
  http.get('/api/users', async ({ request }) => {
    await delay(600);

    const authHeader = request.headers.get('Authorization');
    const currentUser = getUserByToken(authHeader);

    if (!currentUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized access.' }),
        { status: 401 }
      );
    }

    if (currentUser.email === 'forbidden@example.com') {
      return new HttpResponse(
        JSON.stringify({ message: 'Anda tidak memiliki hak akses untuk melihat data User!' }),
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || '';
    const status = url.searchParams.get('status') || '';
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const sortBy = url.searchParams.get('sortBy') || '';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    const filteredUsers = mockUsers.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Apply sorting
    if (sortBy) {
      filteredUsers.sort((a, b) => {
        const valA = String(a[sortBy as keyof TUser] || '').toLowerCase();
        const valB = String(b[sortBy as keyof TUser] || '').toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const paginated = paginate(filteredUsers, page, pageSize);
    return HttpResponse.json(paginated);
  }),

  http.get('/api/users/:id', async ({ params, request }) => {
    await delay(400);

    const authHeader = request.headers.get('Authorization');
    if (!getUserByToken(authHeader)) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: 'User tidak ditemukan.' }),
        { status: 404 }
      );
    }

    return HttpResponse.json(user);
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(800);

    const authHeader = request.headers.get('Authorization');
    const currentUser = getUserByToken(authHeader);
    if (!currentUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const body = (await request.json()) as TUser;

    // Check email uniqueness
    if (mockUsers.some(u => u.email.toLowerCase() === body.email.toLowerCase())) {
      return new HttpResponse(
        JSON.stringify({ message: 'Email sudah terdaftar!' }),
        { status: 400 }
      );
    }

    const newId = String(Math.max(...mockUsers.map((u) => Number(u.id)), 0) + 1);
    const newUser: TUser = {
      ...body,
      id: newId,
      status: body.status || 'invited',
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'CREATE_USER',
      actorName: currentUser.email,
      targetType: 'user',
      targetId: newId,
      createdAt: new Date().toISOString(),
      details: `Membuat user baru: ${newUser.name} (${newUser.email})`,
    });

    return HttpResponse.json(newUser, { status: 201 });
  }),

  // Support both PUT and PATCH for compatibility
  http.put('/api/users/:id', async ({ params, request }) => {
    await delay(800);

    const authHeader = request.headers.get('Authorization');
    const currentUser = getUserByToken(authHeader);
    if (!currentUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const { id } = params;
    const body = (await request.json()) as Partial<TUser>;
    const index = mockUsers.findIndex((u) => u.id === id);

    if (index === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'User tidak ditemukan.' }),
        { status: 404 }
      );
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...body,
    };

    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'UPDATE_USER',
      actorName: currentUser.email,
      targetType: 'user',
      targetId: String(id),
      createdAt: new Date().toISOString(),
      details: `Mengupdate data user ID: ${id}`,
    });

    return HttpResponse.json(mockUsers[index]);
  }),

  http.patch('/api/users/:id', async ({ params, request }) => {
    await delay(800);

    const authHeader = request.headers.get('Authorization');
    const currentUser = getUserByToken(authHeader);
    if (!currentUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const { id } = params;
    const body = (await request.json()) as Partial<TUser>;
    const index = mockUsers.findIndex((u) => u.id === id);

    if (index === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'User tidak ditemukan.' }),
        { status: 404 }
      );
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...body,
    };

    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'UPDATE_USER',
      actorName: currentUser.email,
      targetType: 'user',
      targetId: String(id),
      createdAt: new Date().toISOString(),
      details: `Mengupdate data user ID: ${id}`,
    });

    return HttpResponse.json(mockUsers[index]);
  }),

  http.patch('/api/users/:id/status', async ({ params, request }) => {
    await delay(600);

    const authHeader = request.headers.get('Authorization');
    const currentUser = getUserByToken(authHeader);
    if (!currentUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const { id } = params;
    const body = (await request.json()) as { status: TUser['status'] };
    const index = mockUsers.findIndex((u) => u.id === id);

    if (index === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'User tidak ditemukan.' }),
        { status: 404 }
      );
    }

    const oldStatus = mockUsers[index].status;
    mockUsers[index].status = body.status;

    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'UPDATE_USER',
      actorName: currentUser.email,
      targetType: 'user',
      targetId: String(id),
      createdAt: new Date().toISOString(),
      details: `Mengubah status user ID: ${id} (${oldStatus} -> ${body.status})`,
    });

    return HttpResponse.json(mockUsers[index]);
  }),

  // 3. REQUESTS HANDLERS
  http.get('/api/requests', async ({ request }) => {
    await delay(600);

    const authHeader = request.headers.get('Authorization');
    if (!getUserByToken(authHeader)) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const priority = url.searchParams.get('priority') || '';
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const sortBy = url.searchParams.get('sortBy') || '';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    const filteredRequests = mockRequests.filter((req) => {
      const matchesSearch =
        !search ||
        req.id.toLowerCase().includes(search.toLowerCase()) ||
        req.title.toLowerCase().includes(search.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || req.status === status;
      const matchesPriority = !priority || req.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    if (sortBy) {
      filteredRequests.sort((a, b) => {
        const valA = String(a[sortBy as keyof TRequest] || '').toLowerCase();
        const valB = String(b[sortBy as keyof TRequest] || '').toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const paginated = paginate(filteredRequests, page, pageSize);
    return HttpResponse.json(paginated);
  }),

  http.get('/api/requests/:id', async ({ params, request }) => {
    await delay(400);

    const authHeader = request.headers.get('Authorization');
    if (!getUserByToken(authHeader)) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const { id } = params;
    const reqObj = mockRequests.find((r) => r.id === id);

    if (!reqObj) {
      return new HttpResponse(
        JSON.stringify({ message: 'Permohonan tidak ditemukan.' }),
        { status: 404 }
      );
    }

    return HttpResponse.json(reqObj);
  }),

  // Support PATCH for request status change
  http.patch('/api/requests/:id/status', async ({ params, request }) => {
    await delay(800);

    const authHeader = request.headers.get('Authorization');
    const currentUser = getUserByToken(authHeader);
    if (!currentUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const { id } = params;
    const body = (await request.json()) as { status: TRequest['status']; simulateError?: number };
    const { status, simulateError } = body;
    const index = mockRequests.findIndex((r) => r.id === id);

    if (index === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Permohonan tidak ditemukan.' }),
        { status: 404 }
      );
    }

    if (simulateError === 403 || currentUser.role === 'viewer') {
      return new HttpResponse(
        JSON.stringify({ message: 'Akses Ditolak (403): Anda tidak memiliki wewenang untuk menyetujui permohonan ini.' }),
        { status: 403 }
      );
    }

    if (simulateError === 500) {
      return new HttpResponse(
        JSON.stringify({ message: 'Kesalahan Server Internal (500): Gagal memproses pembaruan status permohonan.' }),
        { status: 500 }
      );
    }

    const oldStatus = mockRequests[index].status;
    mockRequests[index].status = status;

    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'UPDATE_REQUEST',
      actorName: currentUser.email,
      targetType: 'request',
      targetId: String(id),
      createdAt: new Date().toISOString(),
      details: `Mengupdate status permohonan ID: ${id} (${oldStatus} -> ${status})`,
    });

    return HttpResponse.json(mockRequests[index]);
  }),

  // Fallback PUT handler for safety
  http.put('/api/requests/:id', async ({ params, request }) => {
    await delay(800);

    const authHeader = request.headers.get('Authorization');
    const currentUser = getUserByToken(authHeader);
    if (!currentUser) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const { id } = params;
    const body = (await request.json()) as Partial<TRequest> & { simulateError?: number };
    const { simulateError, ...dataToUpdate } = body;
    const index = mockRequests.findIndex((r) => r.id === id);

    if (index === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Permohonan tidak ditemukan.' }),
        { status: 404 }
      );
    }

    if (simulateError === 403) {
      return new HttpResponse(
        JSON.stringify({ message: 'Akses Ditolak (403): Anda tidak memiliki wewenang untuk menyetujui permohonan ini.' }),
        { status: 403 }
      );
    }

    if (simulateError === 500) {
      return new HttpResponse(
        JSON.stringify({ message: 'Kesalahan Server Internal (500): Gagal memproses pembaruan status permohonan.' }),
        { status: 500 }
      );
    }

    const oldStatus = mockRequests[index].status;
    mockRequests[index] = {
      ...mockRequests[index],
      ...dataToUpdate,
    };

    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'UPDATE_REQUEST',
      actorName: currentUser.email,
      targetType: 'request',
      targetId: String(id),
      createdAt: new Date().toISOString(),
      details: `Mengupdate status permohonan ID: ${id} (${oldStatus} -> ${mockRequests[index].status})`,
    });

    return HttpResponse.json(mockRequests[index]);
  }),

  // 4. AUDIT LOGS HANDLER
  http.get('/api/audit-logs', async ({ request }) => {
    await delay(500);

    const authHeader = request.headers.get('Authorization');
    if (!getUserByToken(authHeader)) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized.' }),
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const actor = url.searchParams.get('actor') || '';
    const action = url.searchParams.get('action') || '';
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const search = url.searchParams.get('search') || '';

    const filteredLogs = mockAuditLogs.filter((log) => {
      const matchesActor = !actor || log.actorName.toLowerCase() === actor.toLowerCase();
      const matchesAction = !action || log.action === action;
      const matchesSearch = !search || 
        log.details?.toLowerCase().includes(search.toLowerCase()) || 
        log.actorName.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase());
      return matchesActor && matchesAction && matchesSearch;
    });

    const paginated = paginate(filteredLogs, page, pageSize);
    return HttpResponse.json(paginated);
  }),
];
