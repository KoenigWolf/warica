// ルートパス一元管理
export const ROUTES = {
  home: '/',
  payments: '/payments',
  result: '/result',
} as const;

type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey]; 