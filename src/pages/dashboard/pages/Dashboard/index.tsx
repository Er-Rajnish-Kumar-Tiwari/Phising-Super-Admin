import { useEffect, useState } from "react";
import axios from "axios";

/* ================= TYPES ================= */
interface SystemStats {
  totalUsers: number;
  totalCampaigns: number;
  totalEmailsSent: number;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  companyName: string;
  country: string;
  isVerified: boolean;
  lastLoginDate: string | null;
}

interface ReportResponse {
  systemStats: SystemStats;
  userData: User[];
}

/* ================= CONFIG ================= */
const BASE_URL =
  "http://195.35.21.108:7001/auth/api/v1/super-admin";

/* ================= COMPONENT ================= */
export default function ReportPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await axios.get<ReportResponse>(
        `${BASE_URL}/report-data`
      );
      setStats(res.data.systemStats);
      setUsers(res.data.userData);
    } catch (err) {
      console.error("Error fetching report", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    window.open(
      `${BASE_URL}/download-excel-report`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 text-gray-800">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Super Admin Dashboard
        </h1>
        <button
          onClick={downloadExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
        >
          Download Excel
        </button>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
        />
        <StatCard
          title="Total Campaigns"
          value={stats?.totalCampaigns || 0}
        />
        <StatCard
          title="Total Emails Sent"
          value={stats?.totalEmailsSent || 0}
        />
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 border-b">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Company</th>
              <th className="text-left p-4">Country</th>
              <th className="text-left p-4">Verified</th>
              <th className="text-left p-4">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">{user.fullName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.companyName}</td>
                <td className="p-4">{user.country}</td>
                <td className="p-4">
                  {user.isVerified ? (
                    <span className="text-green-600 font-medium">
                      Yes
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">
                      No
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {user.lastLoginDate
                    ? new Date(
                        user.lastLoginDate
                      ).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2 text-gray-800">
        {value}
      </h2>
    </div>
  );
}
