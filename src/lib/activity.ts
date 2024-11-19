import sql from './db/neon';
import { safeUUID, newUUID } from './db/utils';
import type { ActivityLog } from '../types/database';

export async function addActivity(description: string): Promise<ActivityLog> {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) {
      throw new Error('User not found');
    }

    const adminId = safeUUID(user.id);
    if (!adminId) {
      throw new Error('Invalid user ID');
    }

    const [activity] = await sql<ActivityLog[]>`
      INSERT INTO activity_logs (
        id,
        admin_id,
        action,
        entity_type,
        details
      ) VALUES (
        ${newUUID()},
        ${adminId},
        ${description},
        'system',
        jsonb_build_object('source', 'user_action')
      )
      RETURNING *
    `;
    return activity;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
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
    const adminId = safeUUID(data.admin_id);
    if (!adminId) {
      throw new Error('Invalid admin ID');
    }

    const entityId = data.entity_id ? safeUUID(data.entity_id) : null;

    const [activity] = await sql<ActivityLog[]>`
      INSERT INTO activity_logs (
        id,
        admin_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address
      ) VALUES (
        ${newUUID()},
        ${adminId},
        ${data.action},
        ${data.entity_type},
        ${entityId},
        ${data.details ? JSON.stringify(data.details) : null}::jsonb,
        ${data.ip_address}
      )
      RETURNING *
    `;
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
}

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
    throw error;
  }
}

export function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}