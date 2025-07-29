import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SiTruenas } from "react-icons/si";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


const AdvertisementSection = () => {

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["approvedAds"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/advertisements/approved");
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading advertisements...</div>;

  if (ads.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Featured Advertisements</h2>

      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        interval={5000}
        className="rounded-2xl shadow-xl overflow-hidden"
      >
        {ads.map((ad) => (
          <div key={ad._id} className="relative">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full object-cover h-[400px] brightness-[.75]"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
              <h3 className="text-4xl font-extrabold drop-shadow mb-2">{ad.title}</h3>
              <p className="text-lg max-w-2xl text-center">{ad.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default AdvertisementSection;
