import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { banners } from "../../../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <div className="relative rounded-md overflow-hidden margin">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="relative bg-[#f9f6f2]">
            <img
              src={banner.img}
              alt={`Banner ${index + 1}`}
              className="w-full h-auto object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center text-center bg-black bg-opacity-30">
              <div className="text-white max-w-2xl px-4">
                <h2 className="text-4xl font-bold mb-4 max-xl:text-[35px] max-lg:text-[30px] max-md:text-[25px] max-sm:text-[22px] max-sm:mb-0">
                  {banner.title}
                </h2>
                <p className="text-xl max-sm:mb10 max-md:text-[16px] mb-6 max-xl:text-[18px]">{banner.subtitle}</p>
                <Link to={'/shop'} >
                  <button className="py-2 px-12 max-md:py-[6px] max-md:px-8 max-sm:py-1 max-sm:px-6 rounded-[5px] bg-[#B8A38A] text-white text-[18px] font-medium hover:bg-[#fff] hover:text-[#B8A38A] hover:ease-in-out duration-500 border border-[#B8A38A]  max-md:text-[16px]">
                    {banner.cta}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;