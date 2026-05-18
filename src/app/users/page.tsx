// import react from "react";

const UsersPage = () => {
    return (
        <main>
            <header>
                <h1>Manajemen User</h1>
                <p>Kelola data pengguna sistem di sini.</p>
            </header>

            <section aria-label="Filter User">
                <input type="search" placeholder="Cari user..." />
            </section>

            <article>
                <table border={1} style={{ width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Asep Toni</td>
                            <td>Backend Engineer</td>
                            <td>Aktif</td>
                        </tr>
                    </tbody>
                </table>
            </article>
        </main>
    );
};

export default UsersPage;