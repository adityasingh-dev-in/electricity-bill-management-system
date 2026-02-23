import React from 'react';
import { Link } from 'react-router-dom';


const Navbar: React.FC = () => {
    return (
        <nav className='h-20 bg-black text-white p-1'>
            <div className='h-full flex justify-between items-center'>
                <p>hello</p>
                <ul className='h-full flex items-center gap-2'>
                    <li><Link to={'/'} className='h-full p-2'>home</Link></li>
                    <li><Link to={'/service'} className='h-full p-2'>service</Link></li>
                    <li><Link to={'/about'} className='h-full p-2'>about</Link></li>
                    <li><Link to={'/contact'} className='h-full p-2'>contact</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
