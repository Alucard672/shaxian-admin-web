/**
 * 极简内存缓存：对低频变更数据做短期缓存，避免每次进页面都拉一次
 */
import { listAdminPackages } from './index';

const TTL_MS = 5 * 60 * 1000; // 5 分钟

let packagesCache: { ts: number; data: API.PackageVO[] } | null = null;
let packagesPromise: Promise<API.PackageVO[]> | null = null;

/**
 * 获取套餐列表（5 分钟内复用缓存；并发调用复用同一 Promise）
 */
export async function getCachedPackages(): Promise<API.PackageVO[]> {
  const now = Date.now();
  if (packagesCache && now - packagesCache.ts < TTL_MS) {
    return packagesCache.data;
  }
  if (packagesPromise) {
    return packagesPromise;
  }
  packagesPromise = listAdminPackages()
    .then((r) => {
      if (r.success && r.data) {
        packagesCache = { ts: Date.now(), data: r.data };
        return r.data;
      }
      return [];
    })
    .finally(() => {
      packagesPromise = null;
    });
  return packagesPromise;
}

/**
 * 套餐被编辑后调用以清缓存
 */
export function invalidatePackagesCache() {
  packagesCache = null;
}
