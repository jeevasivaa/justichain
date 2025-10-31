import React, { useMemo } from 'react';
import { Petition, PetitionCategory, PetitionStatus } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  petitions: Petition[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            <i className={`fas ${icon} text-2xl text-white`}></i>
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ petitions }) => {
  const categoryData = useMemo(() => {
    const counts = petitions.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {} as Record<PetitionCategory, number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [petitions]);

  const statusData = useMemo(() => {
    const counts = petitions.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
    }, {} as Record<PetitionStatus, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [petitions]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  const totalPetitions = petitions.length;
  const resolvedPetitions = petitions.filter(r => r.status === PetitionStatus.Resolved).length;
  const verifiedPetitions = petitions.filter(r => r.status === PetitionStatus.Verified).length;
  
  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Transparency Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Petitions" value={totalPetitions} icon="fa-file-alt" color="bg-blue-500" />
          <StatCard title="Verified Petitions" value={verifiedPetitions} icon="fa-check-circle" color="bg-yellow-500" />
          <StatCard title="Resolved Petitions" value={resolvedPetitions} icon="fa-gavel" color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Petitions by Category</h3>
          {petitions.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
           ) : <p className="text-gray-500 dark:text-gray-400 text-center py-20">No data to display.</p>}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Petitions by Status</h3>
          {petitions.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                     {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
          </ResponsiveContainer>
          ) : <p className="text-gray-500 dark:text-gray-400 text-center py-20">No data to display.</p>}
        </div>
      </div>

       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Petition Locations (Simulated)</h3>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Map visualization would appear here.</p>
          </div>
       </div>

    </div>
  );
};
