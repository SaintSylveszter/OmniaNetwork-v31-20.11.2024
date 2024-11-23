import sql from '../db/neon';
import type { ActivityLog } from '../../types/database';

export async function getRecentActivities(limit: number = 50): Promise<ActivityLog[]> {
  try {
    const activities = await sql<ActivityLog[]>`
      SELECT al.*, a.username as admin_username
      FROM activity_logs al
      JOIN admins a ON al.admin_id = a.id
      ORDER BY al.created_at DESC
      LIMIT ${limit}
    `;
    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw new Error('Failed to fetch activities');
  }
}

export async function logActivity(data: {
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
}): Promise<ActivityLog> {
  try {
    const [activity] = await sql<ActivityLog[]>`
      INSERT INTO activity_logs (
        admin_id, action, entity_type, entity_id, details, ip_address
      ) VALUES (
        ${data.admin_id}, ${data.action}, ${data.entity_type},
        ${data.entity_id}, ${JSON.stringify(data.details)}, ${data.ip_address}
      )
      RETURNING *
    `;
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw new Error('Failed to log activity');
  }
}