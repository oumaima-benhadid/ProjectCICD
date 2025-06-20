export interface UserStatsResponse {
  totalUsers: number;
  countBySexe: { [key: string]: number };
  countByRole: { [key: string]: number };
  loginsPerDay: { [date: string]: number };
  loginsPerDayNames: { [date: string]: string[] };
  activeUsers: number;                      // ✅ nouveau
  inactiveUsers: number;                    // ✅ nouveau
  avgLastSeenDays: number;                  // ✅ nouveau
}
