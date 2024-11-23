import React from 'react';
import { BarChart, Activity, Link as LinkIcon } from 'lucide-react';

const OmniaKidDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart className="mr-2" /> Site Statistics
        </h2>
        <ul className="space-y-2">
          <li>Total Articles: 50</li>
          <li>Categories: 8</li>
          <li>Authors: 5</li>
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="mr-2" /> Recent Activity
        </h2>
        <ul className="space-y-2">
          <li>New article: "Top 10 Gadgets of 2023"</li>
          <li>Updated category: "Smartphones"</li>
          <li>New author added: John Doe</li>
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <LinkIcon className="mr-2" /> Quick Links
        </h2>
        <ul className="space-y-2">
          <li><a href="#" className="text-blue-600 hover:underline">Add New Article</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Manage Categories</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Update Site Settings</a></li>
        </ul>
      </div>
    </div>
  );
};

export default OmniaKidDashboard;