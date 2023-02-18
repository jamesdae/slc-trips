import React, { useState } from 'react';

export default function DropdownMenu(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(props.selectedCategory);

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const selectItem = name => {
    setActiveItem(name);
    setDropdownOpen(false);
    props.onSelect(name);
  };

  return (
    <div className="p-2 d-flex flex-row-reverse botpad">
      <div className="dropdown-center">
        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={dropdownOpen} onClick={toggleDropdown} >
          {activeItem}
        </button>
        <div className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuButton">
          <button className="dropdown-item" type="button" onClick={() => selectItem('All Categories')}>
            All Categories
          </button>
          <button className="dropdown-item" type="button" onClick={() => selectItem('Hiking')}>
            Hiking
          </button>
          <button className="dropdown-item" type="button" onClick={() => selectItem('Parks')}>
            Parks
          </button>
          <button className="dropdown-item" type="button" onClick={() => selectItem('Viewpoints')}>
            Viewpoints
          </button>
          <button className="dropdown-item" type="button" onClick={() => selectItem('Water Activities')}>
            Water Activities
          </button>
          <button className="dropdown-item" type="button" onClick={() => selectItem('Snow Activities')}>
            Snow Activities
          </button>
        </div>
      </div>
    </div>
  );
}
