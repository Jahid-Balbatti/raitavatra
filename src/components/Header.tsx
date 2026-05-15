import { Sprout, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../lib/useAuth";

export function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="bg-bg-card border-b border-border h-20 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 border border-accent/20 bg-accent/5 rounded text-accent">
            <Sprout size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-serif italic text-2xl text-accent leading-tight">Raitha-Varta</h1>
            <p className="text-[10px] uppercase tracking-widest-large text-text-muted mt-0.5">Deployment Engine • Agriculture</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={logout}
              className="p-2 text-text-dim hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} strokeWidth={1.5} />
            </button>
          ) : (
            <button
              onClick={login}
              className="px-5 py-2 bg-accent text-black text-[10px] font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all active:scale-95"
            >
              Access
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
