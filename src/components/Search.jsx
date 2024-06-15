import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";

const Search = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search/${query}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <article className="search">
            <label htmlFor="searchInput">
                <LuSearch />
            </label>
            <input
                type="text"
                placeholder="검색어를 입력해주세요"
                id="searchInput"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>검색하기</button>
        </article>
    );
};

export default Search;
