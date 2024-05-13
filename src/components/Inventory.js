import React, { useState } from 'react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentItem, setCurrentItem] = useState({ name: '', quantity: '', purchaseDate: '', expirationDate: '' });

    const handleAddClick = () => {
        setCurrentItem({ name: '', quantity: '', purchaseDate: '', expirationDate: '' });
        setShowPopup(true);
    };

    const handleChange = (e) => {
        setCurrentItem({
            ...currentItem,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        setItems(prevItems => {
            const updatedItems = [...prevItems, currentItem];
            updatedItems.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
            return updatedItems;
        });
        setShowPopup(false);
    };

    const handleDelete = (index) => {
        setItems(prevItems => prevItems.filter((item, i) => i !== index));
    };

    const handleEdit = (index) => {
        setCurrentItem(items[index]);
        setShowPopup(true);
    };

    return (
        <div className="inventory">
            <h2>My Inventory</h2>
                {items.map((item, index) => {
                    
                    const daysUntilExpiration = Math.floor((new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
                    let backgroundColor;
                    switch (true) {
                        case daysUntilExpiration < 0:
                            backgroundColor = 'red';
                            break;
                        case daysUntilExpiration < 3:
                            backgroundColor = 'pink';
                            break;
                        case daysUntilExpiration < 7:
                            backgroundColor = 'yellow';
                            break;
                        default:
                            backgroundColor = 'lightgreen';
                    }

                    return(
                    <div className="item" id={index} style={{backgroundColor}}>
                        <div className="left">
                            <h3>{item.name}</h3>
                            <ul>
                                <li>Quantity: {item.quantity}</li>
                                <li>Purchase Date: {item.purchaseDate}</li>
                                <li>Expiration Date: {item.expirationDate}</li>
                            </ul> 
                        </div>
                        <div className="right">
                            <button onClick={() => handleEdit(index)}>Edit</button>
                            <button onClick={() => handleDelete(index)}>Remove</button>
                        </div>
                    </div>
                )})}

                <button onClick={handleAddClick}>Add to Inventory</button>
                {showPopup && (
                <div className="popup">
                    <input type="text" placeholder="Item Name" name="name" value={currentItem.name} onChange={handleChange} />
                    <input type="number" placeholder="Quantity" name="quantity" value={currentItem.quantity} onChange={handleChange} />
                    <input type="date" name="purchaseDate" value={currentItem.purchaseDate} onChange={handleChange} />
                    <input type="date" name="expirationDate" value={currentItem.expirationDate} onChange={handleChange} />
                    <button onClick={handleSave}>Save Item</button>
                </div>
                 )}

        </div>
    );
};

export default Inventory;
