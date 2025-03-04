import { Link } from "react-router-dom";

const Sidebar = ({ sidebarItems }) => {
  
  return (
    <div className="w-64 bg-gray-100 p-4 min-h-screen shadow-md hidden md:block">
      {sidebarItems.length > 0 && (
        <ul className="space-y-3">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="block p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
