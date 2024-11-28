import React, { useState } from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MenuComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // React Router's navigation function

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
      >
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuClick('/')}>Cafes</MenuItem>
        <MenuItem onClick={() => handleMenuClick('/employees')}>Employees</MenuItem>
      </Menu>
    </div>
  );
};

export default MenuComponent;
