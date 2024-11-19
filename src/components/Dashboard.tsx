import React, { useState, useEffect } from 'react';
import { BarChart, Activity, Link as LinkIcon, Users, Globe, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { getRecentActivities } from '../lib/api/activities';
import { getSites } from '../lib/api/sites';
import type { ActivityLog, Site } from '../types/database';

const Dashboard: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load activities and sites in parallel
      const [activitiesData, sitesData] = await Promise.all([
        getRecentActivities(10),
        getSites()
      ]);

      setActivities(activitiesData);
      setSites(sitesData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalSites: sites.length,
    activeUsers: sites.reduce((total, site) => total + (site.status === 'active' ? 1 : 0), 0),
    totalArticles: 0, // This will be updated when we implement article tracking
    interlinks: 0, // This will be updated when we implement interlink tracking
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
  }> = ({ title, value, change, icon, iconBgColor, iconColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `w-6 h-6 ${iconColor}`
          })}
        </div>
      </div>
      <div className="flex items-center mt-4 text-sm">
        {change >= 0 ? (
          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
          {Math.abs(change)}%
        </span>
        <span className="text-gray-600 dark:text-gray-400 ml-2">from last month</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sites"
          value={stats.totalSites}
          change={12}
          icon={<Globe />}
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-500 dark:text-blue-400"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          change={8}
          icon={<Users />}
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-500 dark:text-green-400"
        />
        <StatCard
          title="Total Articles"
          value={stats.totalArticles}
          change={24}
          icon={<BarChart />}
          iconBgColor="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-500 dark:text-purple-400"
        />
        <StatCard
          title="Interlinks"
          value={stats.interlinks}
          change={-3}
          icon={<LinkIcon />}
          iconBgColor="bg-orange-50 dark:bg-orange-900/20"
          iconColor="text-orange-500 dark:text-orange-400"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recent activities
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Activity className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;