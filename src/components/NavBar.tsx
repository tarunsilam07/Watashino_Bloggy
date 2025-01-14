import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router=useRouter();

  const [name,setName]=useState("");
  const getUserDetails=async()=>{
    const res=await axios.get('/api/users/me')
    console.log(res?.data);
    setName(res?.data?.user?.username);
  }

  useEffect(()=>{
    getUserDetails();
  },[])

  const handleLogout = async() => {
    await axios.get("/api/users/logout");
    router.push('/login');
    // alert('You have logged out!');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link href="/" className="text-white text-3xl font-bold hover:opacity-80 transition-opacity">
          Watashino Bloggy
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white text-2xl lg:hidden focus:outline-none"
          aria-expanded={isMenuOpen}
        >
          &#9776;
        </button>

        {/* Links and Profile Dropdown */}
        <div className={`lg:flex items-center ${isMenuOpen ? 'block' : 'hidden'} lg:space-x-8`}>
          <ul className="lg:flex items-center space-y-4 lg:space-y-0 lg:space-x-6 text-white text-lg">
            <li>
              <Link href="/" className="hover:underline hover:opacity-90 transition-all">Home</Link>
            </li>
            <li>
              <Link href="/myBlogs" className="hover:underline hover:opacity-90 transition-all">My Blogs</Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:underline hover:opacity-90 transition-all">Blogs</Link>
            </li>
            <li>
              <Link href="/addBlog" className="hover:underline hover:opacity-90 transition-all">Add Blog</Link>
            </li>
          </ul>

          {/* Profile with Dropdown */}
          <div className="relative mt-4 lg:mt-0">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all"
            >
              {name}
              <svg
                className={`ml-2 w-4 h-4 transform ${isProfileDropdownOpen ? 'rotate-180' : ''} transition-transform`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06-.02L10 10.586l3.71-3.396a.75.75 0 011.02 1.1l-4 3.656a.75.75 0 01-1.02 0l-4-3.656a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown */}
            {isProfileDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden">
                <li>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">View Profile</Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
