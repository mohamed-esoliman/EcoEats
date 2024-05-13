import { NavLink } from "react-router-dom";

const NavBar = () => {
    return ( 
        <nav>
            <div className="header">
                <span>WasteNotFood</span>
                <p>Never waste food again!</p>
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
                </ul>
            </div>
        </nav>
     );
}
 
export default NavBar;