import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { fetchWithAuth } from "../api/api";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

 useEffect(() => {
   async function getUser() {
     try {
       const data = await fetchWithAuth("/profile");
       setUser(data);
     } catch (err) {
       console.error("Failed to fetch user:", err.message);
     }
   }
   getUser();
 }, []);


  return (
    <div className="min-h-screen app-background">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={!sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar user={user} />

          <main className="flex-1 w-full overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
