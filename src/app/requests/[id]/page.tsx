import { useParams, Link } from 'react-router-dom';

const RequestDetailPage = () => {
    const { id } = useParams();

    return (
        <div>
            <div className="mb-4">
                <Link to="/requests" className="text-blue-600 hover:underline">&larr; Kembali ke daftar request</Link>
            </div>
            <h1 className="text-2xl font-bold mb-4">Detail Request</h1>
            <div className="p-6 bg-white border rounded-xl shadow-sm">
                <p className="text-gray-600">Sedang menampilkan detail untuk Request ID: <strong>{id}</strong></p>
            </div>
        </div>
    );
};

export default RequestDetailPage;
