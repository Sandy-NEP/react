import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingBag, FaShoppingCart, FaHeart, FaHome, FaUserAlt, FaUsers } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';

const MenuButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(<FaHome size={28} />);

  const livePosition = useRef({ x: 100, y: 100 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const animationRef = useRef(null);
  const lastMoveTime = useRef(0);

  const icons = [
    { icon: <FaShoppingCart />, name: 'cart', path: '/cart' },
    { icon: <FaHeart />, name: 'heart', path: '/favorite' },
    { icon: <FaHome />, name: 'home', path: '/home' },
    { icon: <FaShoppingBag />, name: 'shop', path: '/shop' },
    { icon: <BsFillInfoCircleFill />, name: 'info', path: '/about' },
    { icon: <FaUserAlt />, name: 'user', path: '/profile' },
    { icon: <FaUsers />, name: 'admin', path: '/admin/users' },
  ];

  // Auto-select icon based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingIcon = icons.find(icon => currentPath.startsWith(icon.path));
    if (matchingIcon) {
      setSelectedIcon(React.cloneElement(matchingIcon.icon, { size: 28 }));
    } else {
      // Default to home if no match found
      const homeIcon = icons.find(icon => icon.path === '/home');
      if (homeIcon) {
        setSelectedIcon(React.cloneElement(homeIcon.icon, { size: 28 }));
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }
  }, [isDragging]);

  const updatePosition = (x, y) => {
    livePosition.current = { x, y };
    setPosition({ x, y });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - livePosition.current.x,
      y: e.clientY - livePosition.current.y,
    };
    hasMoved.current = false;
    lastMoveTime.current = performance.now();
    cancelAnimationFrame(animationRef.current);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const now = performance.now();
    const dx = e.clientX - dragOffset.current.x;
    const dy = e.clientY - dragOffset.current.y;
    const dt = (now - lastMoveTime.current) / 16;

    velocity.current = {
      x: (dx - livePosition.current.x) / dt,
      y: (dy - livePosition.current.y) / dt,
    };

    lastMoveTime.current = now;
    hasMoved.current = true;

    const wrapper = wrapperRef.current;
    const halfWidth = wrapper.offsetWidth / 2;
    const halfHeight = wrapper.offsetHeight / 2;

    const newX = Math.max(halfWidth, Math.min(dx, window.innerWidth - halfWidth));
    const newY = Math.max(halfHeight, Math.min(dy, window.innerHeight - halfHeight));

    updatePosition(newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (!hasMoved.current) return;

    const decay = () => {
      velocity.current.x *= 0.9;
      velocity.current.y *= 0.9;

      let nextX = livePosition.current.x + velocity.current.x;
      let nextY = livePosition.current.y + velocity.current.y;

      const wrapper = wrapperRef.current;
      const halfWidth = wrapper.offsetWidth / 2;
      const halfHeight = wrapper.offsetHeight / 2;

      nextX = Math.max(halfWidth, Math.min(nextX, window.innerWidth - halfWidth));
      nextY = Math.max(halfHeight, Math.min(nextY, window.innerHeight - halfHeight));

      updatePosition(nextX, nextY);

      if (Math.abs(velocity.current.x) > 0.5 || Math.abs(velocity.current.y) > 0.5) {
        animationRef.current = requestAnimationFrame(decay);
      }
    };

    decay();
  };

  const toggleMenu = () => {
    if (!hasMoved.current) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleIconSelect = (icon, path) => {
    const biggerIcon = React.cloneElement(icon, { size: 28 });
    setSelectedIcon(biggerIcon);
    setIsOpen(false);
    if (path) navigate(path);
  };

  const getItemPosition = (index, total, radius = 90) => {
    const angle = (2 * Math.PI) / total;
    const theta = angle * index - Math.PI / 2;
    return {
      x: Math.cos(theta) * radius,
      y: Math.sin(theta) * radius,
    };
  };

  // Add touch support
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      setIsDragging(true);
      dragOffset.current = {
        x: touch.clientX - livePosition.current.x,
        y: touch.clientY - livePosition.current.y,
      };
      hasMoved.current = false;
      lastMoveTime.current = performance.now();
      cancelAnimationFrame(animationRef.current);
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length > 1) return;
      e.preventDefault(); // prevent page scroll
      const touch = e.touches[0];
      const now = performance.now();
      const dx = touch.clientX - dragOffset.current.x;
      const dy = touch.clientY - dragOffset.current.y;
      const dt = (now - lastMoveTime.current) / 16;

      velocity.current = {
        x: (dx - livePosition.current.x) / dt,
        y: (dy - livePosition.current.y) / dt,
      };

      lastMoveTime.current = now;
      hasMoved.current = true;

      const wrapper = wrapperRef.current;
      const halfWidth = wrapper.offsetWidth / 2;
      const halfHeight = wrapper.offsetHeight / 2;

      const newX = Math.max(halfWidth, Math.min(dx, window.innerWidth - halfWidth));
      const newY = Math.max(halfHeight, Math.min(dy, window.innerHeight - halfHeight));

      updatePosition(newX, newY);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      if (!hasMoved.current) return;

      const decay = () => {
        velocity.current.x *= 0.9;
        velocity.current.y *= 0.9;

        let nextX = livePosition.current.x + velocity.current.x;
        let nextY = livePosition.current.y + velocity.current.y;

        const wrapper = wrapperRef.current;
        const halfWidth = wrapper.offsetWidth / 2;
        const halfHeight = wrapper.offsetHeight / 2;

        nextX = Math.max(halfWidth, Math.min(nextX, window.innerWidth - halfWidth));
        nextY = Math.max(halfHeight, Math.min(nextY, window.innerHeight - halfHeight));

        updatePosition(nextX, nextY);

        if (Math.abs(velocity.current.x) > 0.5 || Math.abs(velocity.current.y) > 0.5) {
          animationRef.current = requestAnimationFrame(decay);
        }
      };

      decay();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    const wrapper = wrapperRef.current;
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isDragging]);

  return (
    <div
      ref={wrapperRef}
      className={`fixed z-50 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Main Button */}
      <div
        onClick={toggleMenu}
        className={`group hover:bg-white w-20 h-20 max-md:w-16 max-md:h-16 bg-[#B8A38A] rounded-full shadow-[0_0_5px_0_rgb(0,0,0,0.2)] flex items-center justify-center relative z-10 transition duration-300 ${
          isOpen ? '' : 'hover:drop-shadow-[0_0_10px_#b8a38ad5]'
        }`}
      >
        <div className="text-[#fff] drop-shadow-[0_0_10px_10px_#fff] group-hover:drop-shadow-[0_0_10px_#b8a38ad5] group-hover:text-[#B8A38A] text-3xl">
          {selectedIcon}
        </div>
      </div>

      {/* Radial Menu */}
      {icons
        .filter((item) => item.icon.type !== selectedIcon.type)
        .map((item, index, filteredIcons) => {
          const isActive = location.pathname.startsWith(item.path);
          const { x, y } = getItemPosition(index, filteredIcons.length);
          return (
            <div
              key={index}
              className={`group hover:shadow-[0_0_20px_#b8a38ad5] absolute w-12 h-12 max-md:w-11 max-md:h-11 ${
                isActive ? 'bg-[#B8A38A]' : 'bg-white'
              } rounded-full cursor-pointer shadow-[0_0_5px_0_rgb(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                left: '50%',
                top: '50%',
                transform: isOpen
                  ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                  : 'translate(-50%, -50%)',
              }}
              onClick={() => handleIconSelect(item.icon, item.path)}
            >
              <div className={`transition-all ${
                isActive ? 'text-white' : 'text-[#B8A38A]'
              } duration-300 group-hover:text-[#B8A38A] group-hover:drop-shadow-[0_0_6px_#b8a38ad5] text-lg max-md:text-[20px]`}>
                {item.icon}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MenuButton;