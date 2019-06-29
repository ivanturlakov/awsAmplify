import React from "react";
import { Menu as Nav, Icon, Button } from "element-react";
import { Link } from "react-router-dom";
// import { NavItem } from "aws-amplify-react/dist/AmplifyTheme";

const Navbar = ({ user, handleSignOut }) => (
    <Nav mode="horizontal" theme="dark" defaultActive="1">
        <div className="nav-container">
            <Nav.Item index="1">
                <Link to="/" className="nav-link">
                    <span className="app-title">
                        <img src="https://icon.now.sh/shoppingCart/f90" alt="App" className="app-icon" />
                        AmplifyShop
                    </span>
                </Link>
            </Nav.Item>

            {/* Nav Items */}
            <div className="nav-items">
                <Nav.Item index="2">
                    <span className="app-user">Hello, {user.username}</span>
                </Nav.Item>
                <Nav.Item index="3">
                    <Link to="/profile" className="nav-link">
                        <Icon name="setting" />
                        Profile
                    </Link>
                </Nav.Item>
                <Nav.Item index="4">
                    <Button type="warning" onClick={handleSignOut}>Sign Out</Button>
                </Nav.Item>
            </div>
        </div>
    </Nav>
)

export default Navbar;
