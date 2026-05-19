import { useParams, Link } from 'react-router-dom';

const UserDetailPage = () => {
    const { id } = useParams();

    return (
        <div>
            <div className="mb-4">
                <Link to="/users" className="text-blue-600 hover:underline">&larr; Kembali ke daftar user</Link>
            </div>
            <h1 className="text-2xl font-bold mb-4">Detail User</h1>
            <div className="p-6 bg-white border rounded-xl shadow-sm">
                <p className="text-gray-600">Sedang menampilkan detail untuk User ID: <strong>{id}</strong></p>
            </div>
        </div>
    );
};

export default UserDetailPage;
