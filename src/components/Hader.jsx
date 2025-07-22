import { Bell,Search } from "lucide-react";
import ThemeToggle from "../utils/theme/Theme";

const Hader = () => {
  return (
    <div className='dashboard-header'>
      <ThemeToggle></ThemeToggle>
      <div className="w-full flex items-center dark:text-white text-black">
        <input type="text" className=" w-full px-4 py-2 outline-1 outline-blue-700 rounded-md" />
        <div className="px-4 py-2 border-1 rounded-md border-blue-700 ">
          <Search className="w-6 h-6 font-bold text-blue-700" />
        </div>
      </div>

        <Bell className="w-8 h-8 font-bold text-blue-700" />
    </div>
  )
}

export default Hader