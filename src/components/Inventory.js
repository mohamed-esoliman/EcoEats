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
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        Name: {item.name}, Quantity: {item.quantity}, Purchase Date: {item.purchaseDate}, Expiration Date: {item.expirationDate}
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => handleDelete(index)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inventory;
