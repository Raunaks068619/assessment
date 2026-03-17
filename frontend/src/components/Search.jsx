import React from 'react';

const Search = ({ value, onChange }) => {
    return (
        <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                className="search-input"
                placeholder="Search items by name..."
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Search;
