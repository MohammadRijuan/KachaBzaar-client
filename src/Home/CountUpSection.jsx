import CountUp from 'react-countup';
import { FaShoppingBasket, FaUsers, FaStore, FaTruck } from 'react-icons/fa';

const CountUpSection = () => {
  const stats = [
    { icon: <FaShoppingBasket />, label: 'Products Sold', count: 10000 },
    { icon: <FaUsers />, label: 'Happy Customers', count: 2000 },
    { icon: <FaStore />, label: 'Vendors', count: 150 },
    { icon: <FaTruck />, label: 'Orders/Day', count: 500 },
  ];

  return (
    <div className=" py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Our Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="text-4xl text-green-600 mb-2">{item.icon}</div>
            <h3 className="text-2xl font-semibold text-gray-800">
              <CountUp end={item.count} duration={2.5} separator="," />
              +
            </h3>
            <p className="text-sm text-gray-600 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountUpSection;
