// components/home/LeftDrawer.jsx
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../../redux/drawer/drawerSlice';
import LeftHome from './LeftHome';
import { motion } from 'framer-motion';

const LeftDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.drawer.isOpen);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => dispatch(closeDrawer())}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 sc left-0 w-[75%] max-w-[300px] h-full bg-white shadow-lg z-50 overflow-y-auto p-4"
      >
        <LeftHome />
      </motion.div>
    </>
  );
};

export default LeftDrawer;
