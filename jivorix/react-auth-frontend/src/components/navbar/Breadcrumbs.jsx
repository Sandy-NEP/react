import { Link, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { openDrawer } from "../../redux/drawer/drawerSlice"; // Adjust path if needed

const Breadcrumbs = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  let pathnames = location.pathname.split("/").filter(Boolean); // removes empty strings

  // Custom mapping logic
  if (pathnames[0] === "item" && pathnames.length === 2) {
    pathnames = ["shop", pathnames[1]]; // change "item/:id" to "shop/:id"
  }

  const buildPath = (index) => `/${pathnames.slice(0, index + 1).join("/")}`;

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm mt-[86px] max-md:mt-[86px] max-sm:mt-[130px]">
      <div className="container flex items-center gap-4">
        {/* Hamburger icon to open drawer on small screens */}
        <div className="hidden max-lg:block" onClick={() => dispatch(openDrawer())}>
          <HiOutlineMenuAlt1 className="text-[22px] text2 cursor-pointer" />
        </div>

        {/* Breadcrumb path */}
        <div className="container mx-auto px-4 py-2 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/home" className="hover:underline text-gray-800 font-medium">
            Home
          </Link>

          {pathnames.map((name, index) => {
            const routeTo = buildPath(index);
            const isLast = index === pathnames.length - 1;

            return (
              <div key={name} className="flex items-center space-x-2">
                <FaChevronRight className="text-xs text-gray-400" />
                {isLast ? (
                  <span className="text-gray-500 capitalize">
                    {decodeURIComponent(name)}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="hover:underline capitalize text-gray-800 font-medium"
                  >
                    {decodeURIComponent(name)}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
