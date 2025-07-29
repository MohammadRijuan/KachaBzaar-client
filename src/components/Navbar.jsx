
import { NavLink } from 'react-router';

// import './Navbar.css'
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import { auth } from '../firebase/firebase.init';

const Navbar = () => {

    const { user, SignOutUser, setUser } = useAuth()


    const handleSignOut = async () => {
        // await axios.post('https://leaflight-server.vercel.app/logout', {}, {
        //     withCredentials: true
        // })
        SignOutUser(auth)
            .then(() => {
                setUser(null)
                Swal.fire({
                    icon: "success",
                    title: "You have logged out successfully",
                    
                })
            })
            .catch((error) => {
                console.log(error.message)

            })
    }
    return (
        <div className="w-11/12 mx-auto navbar bg-base-100">
            <div className="navbar-start">

                <NavLink to='/'><img className='w-[80px] h-[60px]' src='/logo-k.png' alt="" /></NavLink>
            </div>
            <div className="navbar-center space-x-8 text-gray-400 font-bold hidden lg:block">
                <NavLink className='p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]' to='/'>Home</NavLink>
                <NavLink className='p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]' to='/all-product'>All Products</NavLink>

                {
                    user && <>
                       <NavLink className='p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]' to='/be-vendor'>Be Vendor</NavLink>
                        <NavLink className='p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]' to='/dashboard'>Dashboard</NavLink>
                    </>
                }
            </div>

            <div className="navbar-end">

                <div className='lg:flex space-x-2 hidden'>
                    {user ? (
                        <>
                            <span><img className='w-10 h-10 mx-auto rounded-full  object-cover' src={user.photoURL} alt="" /></span>
                            <a onClick={handleSignOut} className="p-3 font-bold rounded text-green-600 hover:text-white hover:bg-[#4CAF50]">Logout</a>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="p-3 font-bold rounded text-green-600 hover:text-white hover:bg-[#4CAF50]">Login</NavLink>
                            <NavLink to="/register" className="p-3 font-bold rounded text-green-600 hover:text-white hover:bg-[#4CAF50]">Register</NavLink>
                        </>
                    )}
                </div>
                <div className="lg:hidden dropdown right-0">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm right-0 dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><NavLink className='p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]' to='/'>Home</NavLink></li>
                        <li><NavLink className='p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]' to='/all-product'>All Products</NavLink></li>
                        {
                            user && <>

                                <li><NavLink className='p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]' to='/be-vendor'>Be Vendor</NavLink></li>
                                <li><NavLink className='p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]' to='/dashboard'>Dashboard</NavLink></li>
                            </>
                        }

                        {user ? (
                            <>
                                <span><img className='w-10 h-10 mx-auto rounded-full  object-cover' src={user?.photoURL || '/avatar.jpg'} alt="" /></span>
                                <li><a onClick={handleSignOut} className="btn hover:text-white hover:bg-primary">Logout</a></li>

                            </>
                        ) : (
                            <>
                                <li><NavLink to="/login" className="p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]">Login</NavLink></li>
                                <li><NavLink to="p-3 rounded text-green-600 hover:text-white hover:bg-[#4CAF50]" className="btn">Register</NavLink></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default Navbar;