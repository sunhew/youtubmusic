import React from 'react';
import { Link } from 'react-router-dom';
import { FcRating } from "react-icons/fc";
import { IoMusicalNotes } from "react-icons/io5";

const Header = () => {

    return (
        <header id='header' role='banner'>
            <h1 className='logo'>
                <Link to='/'><IoMusicalNotes />나의 뮤직 챠트</Link>
            </h1>
            <h2>chart</h2>
            <ul>
                <li><Link to='chart/melon'><span className='icon'></span>멜론 챠트</Link></li>
                <li><Link to='chart/bugs'><span className='icon'></span>벅스 챠트</Link></li>
                <li><Link to='chart/apple'><span className='icon'></span>애플 챠트</Link></li>
                <li><Link to='chart/genie'><span className='icon'></span>지니 챠트</Link></li>
                <li><Link to='chart/billboard'><span className='icon'></span>빌보드 챠트</Link></li>
            </ul>
            <h2>playlist</h2>
            <ul>
                <li><Link to='/mymusic'><span className='icon2'><FcRating /></span>mymusic</Link></li>
            </ul>
        </header>
    );
}

export default Header;