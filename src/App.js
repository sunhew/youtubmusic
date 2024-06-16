import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/Header";
import Main from "./components/Main";
import Aside from "./components/Aside";
import Search from "./components/Search";

import Home from "./pages/Home";
import Mymusic from "./pages/Mymusic";
import ChartList from "./pages/ChartList";
import PlayList from "./pages/PlayList";
import MusicPlayerProvider from "./context/MusicPlayerProvider";
import SearchResults from "./components/SearchResults";
import DarkModeToggle from "./context/DarkModeToggle";

const App = () => {
    return (
        <MusicPlayerProvider>
            <BrowserRouter>
                <Header />
                <Main>
                    <DarkModeToggle />
                    <Search />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search/:searchID" element={<SearchResults />} />
                        <Route path="/mymusic" element={<Mymusic />} />
                        <Route path="/playlist/:id" element={<PlayList />} />
                        <Route path="/chart/:id" element={<ChartList />} />
                    </Routes>
                </Main>
                <Aside />
                <ToastContainer />
            </BrowserRouter>
        </MusicPlayerProvider>
    );
};

export default App;
