import Nav from "./Nav";
import Top from "./Top";

function Navbar() {
  return (
    <nav className="w-full m-0">
      <div className="fixed z-50 bg-white w-full m-0">
        <Top />
        <Nav />
      </div>
    </nav>
  );
}

export default Navbar;