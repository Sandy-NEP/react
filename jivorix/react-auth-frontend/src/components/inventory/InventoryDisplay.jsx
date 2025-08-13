import React from 'react';
import { useSelector } from 'react-redux';
import { selectItemInventory } from '../../redux/cart/cartSlice';

const InventoryDisplay = ({ itemId, className = "" }) => {
  const inventory = useSelector(state => selectItemInventory(state, itemId));
  
  const getInventoryColor = (count) => {
    if (count === 0) return 'text-red-600 bg-red-100';
    if (count <= 5) return 'text-orange-600 bg-orange-100';
    if (count <= 15) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getInventoryText = (count) => {
    if (count === 0) return 'Out of Stock';
    if (count <= 5) return `Only ${count} left`;
    return `${count} available`;
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInventoryColor(inventory)} ${className}`}>
      <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
      {getInventoryText(inventory)}
    </div>
  );
};

export default InventoryDisplay;