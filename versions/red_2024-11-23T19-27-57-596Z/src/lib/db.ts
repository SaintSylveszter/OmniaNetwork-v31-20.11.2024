import mysql from 'mysql2/promise';
import { OMNIANETWORK_CONFIG, getOmniaKidConfig } from './db/config';

// Connection pool for OmniaNetwork
const omniaNetworkPool = mysql.createPool(OMNIANETWORK_CONFIG);

// Map to store OmniaKid connection pools
const omniaKidPools = new Map<string, mysql.Pool>();

export const getOmniaNetworkDb = () => {
  return omniaNetworkPool;
};

export const getOmniaKidDb = async (siteId: string) => {
  if (!omniaKidPools.has(siteId)) {
    const config = await getOmniaKidConfig(siteId);
    omniaKidPools.set(siteId, mysql.createPool(config));
  }
  return omniaKidPools.get(siteId)!;
};

// Cleanup function
export const closeAllConnections = async () => {
  await omniaNetworkPool.end();
  for (const pool of omniaKidPools.values()) {
    await pool.end();
  }
  omniaKidPools.clear();
};