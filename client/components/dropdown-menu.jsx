import React, { useState } from 'react';

export default function DropdownMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Categories');

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const selectItem = name => {
    setActiveItem(name);
    setDropdownOpen(false);
  };

  return (
    <div className="d-flex flex-row-reverse botpad">
      <div className="dropdown-center">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          onClick={toggleDropdown}
        >
          {activeItem}
        </button>
        <div
          className={`dropdown-menu${dropdownOpen ? ' show' : ''}`}
          aria-labelledby="dropdownMenuButton"
        >
          <button
            className="dropdown-item"
            type="button"
            onClick={() => selectItem('All Categories')}
          >
            All Categories
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => selectItem('Hiking')}
          >
            Hiking
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => selectItem('Snow Activities')}
          >
            Snow Activities
          </button>
        </div>
      </div>
    </div>
  );
}
