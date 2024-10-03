import { NavLink } from "react-router-dom";

const NavBar = () => {
    return ( 
        <nav>
            <div className="header">
                <span>EcoEats</span>
                <p>Your sustainable kitchen companion: preventing food waste with every recipe!</p>
            </div>
            <div className="links">
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/recipes">Recipes</NavLink>
                    </li>
                    <li>
                        <NavLink to="/inventory">Inventory</NavLink>
                    </li>
                    <li>
                        <NavLink to="/login">About</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
     );
}
 
export default NavBar;