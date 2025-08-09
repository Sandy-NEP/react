import Marquee from 'react-fast-marquee';

const Top = () => {
  return (
    <div className='w-full bg-black mb10'>
      <Marquee autoFill speed={40} className='py-1'>
        <span className='text-white text-[11px] mx-20' style={{ wordSpacing: '5px' }}>New arrivals—50% off!</span>
        <span className='text-white text-[11px] mx-20' style={{ wordSpacing: '5px' }}>Discover stylish fashion online today!</span>
        <span className='text-white text-[11px] mx-20' style={{ wordSpacing: '5px' }}>Limited-time discounts—shop fast!</span>
        <span className='text-white text-[11px] mx-20' style={{ wordSpacing: '5px' }}>Fresh Fashion, Big Savings!</span>
        <span className='text-white text-[11px] mx-20' style={{ wordSpacing: '5px' }}>Trendy Styles, Limited Time!</span>
        <span className='text-white text-[11px] mx-20' style={{ wordSpacing: '5px' }}>Hurry—Deals Won’t Last!</span>
      </Marquee>
    </div>
  );
};

export default Top;