import { Star, Flame } from "lucide-react";
import { useAccount } from "@/contexts/account";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Profilebar() {
  const { account } = useAccount();

  if (account === null) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-sm border-b border-gray-100 px-4 py-3 sm:px-6 md:py-4 flex justify-center">
      <div className="max-w-7xl w-full flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <SidebarTrigger className="-ml-2 md:hidden" />
          <div className="md:hidden">
            <img src="/icons.png" alt="Logo" width={28} height={28} />
          </div>
          <div className="hidden md:block">
            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Profile
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Stats */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5">
              <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-blue-100 rounded-full shrink-0">
                <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-500 fill-blue-500" />
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-700">
                {account.xp} XP
              </span>
            </div>

            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5">
              <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-blue-100 rounded-full shrink-0">
                <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-black fill-[#3B82F6] stroke-[2px]" />
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-700">
                {account.streak}
              </span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-900 leading-none">
                {account.username.split(" ")[0]}
              </span>
              {account.username.split(" ").slice(1).length > 0 && (
                <span className="text-sm text-gray-500 leading-tight mt-1 truncate max-w-[100px]">
                  {account.username.split(" ").slice(1).join(" ")}
                </span>
              )}
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 overflow-hidden ring-2 ring-gray-100 flex items-center justify-center shrink-0 shadow-sm">
              {account.avatar ? (
                <img
                  src={account.avatar}
                  alt={account.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs md:text-sm font-semibold">
                  {account.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
