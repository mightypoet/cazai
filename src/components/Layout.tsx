import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <main className="w-full min-h-screen">
      <Outlet />
    </main>
  );
}
