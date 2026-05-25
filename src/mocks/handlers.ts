import { http, HttpResponse, delay } from 'msw';
import type { TUser } from '@/api/users/types';
import type { TRequest } from '@/api/requests/types';
import type { TAuditLog } from '@/api/audit-logs/types';

// -------------------------------------------------------------
// Seeded Database (In-Memory)
// -------------------------------------------------------------

const mockUsers: TUser[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Aktif', password: 'password123' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Developer', status: 'Pending', password: 'password123' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com', role: 'User', status: 'Inactive', password: 'password123' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Developer', status: 'Aktif', password: 'password123' },
  { id: '5', name: 'Chris Johnson', email: 'chris.johnson@example.com', role: 'User', status: 'Aktif', password: 'password123' },
  { id: '6', name: 'Forbidden User', email: 'forbidden@example.com', role: 'User', status: 'Aktif', password: 'password123' },
  { id: '7', name: 'Error 500 User', email: 'error-500@example.com', role: 'Developer', status: 'Aktif', password: 'password123' },
];

const mockRequests: TRequest[] = [
  {
    id: 'REQ-001',
    title: 'Permohonan Cuti Tahunan',
    description: 'Pengajuan cuti tahunan selama 5 hari kerja mulai tanggal 1 Juni 2026.',
    status: 'Approved',
    createdAt: '2026-05-10',
    priority: 'Medium',
    assignee: 'John Doe',
  },
  {
    id: 'REQ-002',
    title: 'Pengadaan Laptop Baru',
    description: 'Laptop workstation Macbook Pro M3 16-inch untuk menunjang aktivitas software engineering.',
    status: 'Pending',
    createdAt: '2026-05-15',
    priority: 'High',
    assignee: 'Jane Smith',
  },
  {
    id: 'REQ-003',
    title: 'Reimbursement Internet',
    description: 'Biaya paket internet pascabayar bulan April 2026 sebesar Rp 250.000.',
    status: 'Approved',
    createdAt: '2026-05-02',
    priority: 'Low',
    assignee: 'Emily Davis',
  },
  {
    id: 'REQ-004',
    title: 'Akses Repositori GitHub',
    description: 'Request akses read & write ke repositori git organisasi DOT untuk modul training frontend.',
    status: 'Rejected',
    createdAt: '2026-05-18',
    priority: 'High',
    assignee: 'Chris Johnson',
  },
  {
    id: 'REQ-005',
    title: 'Izin Sakit',
    description: 'Izin tidak masuk kerja dikarenakan sakit demam tinggi. Surat keterangan dokter terlampir.',
    status: 'Pending',
    createdAt: '2026-05-22',
    priority: 'Medium',
    assignee: 'John Doe',
  },
];

const mockAuditLogs: TAuditLog[] = [
  {
    id: 'LOG-001',
    action: 'LOGIN',
    actor: 'john.doe@example.com',
    timestamp: '2026-05-23T09:00:00Z',
    details: 'Berhasil melakukan login ke sistem.',
  },
  {
    id: 'LOG-002',
    action: 'CREATE_USER',
    actor: 'john.doe@example.com',
    timestamp: '2026-05-23T09:15:00Z',
    details: 'Membuat user baru dengan email: emily.davis@example.com',
  },
  {
    id: 'LOG-003',
    action: 'UPDATE_REQUEST',
    actor: 'jane.smith@example.com',
    timestamp: '2026-05-23T10:30:00Z',
    details: 'Menyetujui permohonan REQ-001 (Permohonan Cuti Tahunan).',
  },
];

// Helper to extract bearer token and find user
function getUserByToken(authHeader: string | null): TUser | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  // Expected format: mock-jwt-token-for-USER_ID
  const prefix = 'mock-jwt-token-for-';
  if (!token.startsWith(prefix)) {
    return null;
  }
  const userId = token.substring(prefix.length);
  return mockUsers.find((u) => u.id === userId) || null;
}

// -------------------------------------------------------------
// MSW Handlers Definition
// -------------------------------------------------------------

export const handlers = [
  // 1. AUTHENTICATION HANDLERS
  http.post('/api/auth/login', async ({ request }) => {
    await delay(800); // Realistic network delay

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

    // Skenario Error 500 via Email Spesifik
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

    // Generate mock token
    const token = `mock-jwt-token-for-${matchedUser.id}`;

    // Add to audit logs
    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'LOGIN',
      actor: matchedUser.email,
      timestamp: new Date().toISOString(),
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

    // Skenario Error 500 via user error-500
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

    // Skenario Error 403 Forbidden untuk email forbidden@example.com
    if (currentUser.email === 'forbidden@example.com') {
      return new HttpResponse(
        JSON.stringify({ message: 'Anda tidak memiliki hak akses untuk melihat data User!' }),
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';

    const filteredUsers = mockUsers.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    );

    return HttpResponse.json(filteredUsers);
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
    const newId = String(Math.max(...mockUsers.map((u) => Number(u.id)), 0) + 1);
    const newUser: TUser = {
      ...body,
      id: newId,
      status: body.status || 'Pending',
    };

    mockUsers.push(newUser);

    mockAuditLogs.unshift({
      id: `LOG-${Date.now()}`,
      action: 'CREATE_USER',
      actor: currentUser.email,
      timestamp: new Date().toISOString(),
      details: `Membuat user baru: ${newUser.name} (${newUser.email})`,
    });

    return HttpResponse.json(newUser, { status: 201 });
  }),

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
      actor: currentUser.email,
      timestamp: new Date().toISOString(),
      details: `Mengupdate data user ID: ${id}`,
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

    const filteredRequests = mockRequests.filter((req) =>
      req.id.toLowerCase().includes(search.toLowerCase()) ||
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.description.toLowerCase().includes(search.toLowerCase())
    );

    return HttpResponse.json(filteredRequests);
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

    // Simulate 403 Forbidden
    if (simulateError === 403 || currentUser.email === 'forbidden@example.com') {
      return new HttpResponse(
        JSON.stringify({ message: 'Akses Ditolak (403): Anda tidak memiliki wewenang untuk menyetujui permohonan ini.' }),
        { status: 403 }
      );
    }

    // Simulate 500 Server Error
    if (simulateError === 500 || currentUser.email === 'error-500@example.com') {
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
      actor: currentUser.email,
      timestamp: new Date().toISOString(),
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

    return HttpResponse.json(mockAuditLogs);
  }),
];
