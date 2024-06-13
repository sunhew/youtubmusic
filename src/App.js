import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Main from "./components/Main";
import Aside from "./components/Aside";
import Search from "./components/Search";

import Home from "./pages/Home";
import Mymusic from "./pages/Mymusic";
import ChartList from "./pages/ChartList";
import PlayList from "./pages/PlayList";

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Main>
                <Search />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mymusic" element={<Mymusic />} />
                    <Route path="/playlist/:id" element={<PlayList />} />
                    <Route path="/chart/:id" element={<ChartList />} />
                </Routes>
            </Main>
            <Aside />
        </BrowserRouter>
    );
};

export default App;