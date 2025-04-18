import React from "react";
import { FaMoneyBill, FaBath, FaBed, FaRulerCombined } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

interface Rates {
  nightly: number;
  weekly: number;
  monthly: number;
}

interface Location {
  city: string;
  state: string;
}
interface Property {
  _id: string;
  type: string;
  name: string;
  beds: number;
  baths: number;
  square_feet: number;
  rates: Rates;
  location: Location;
  images: string[];
}

interface PropertyCardProps {
  property: Property;
}
const PropertyCard = ({ property }: PropertyCardProps) => {
  const getRateDisplay = () => {
    const { rates } = property;
    if (rates.monthly) {
      return `${rates.monthly.toLocaleString()}/mo`;
    } else if (rates.weekly) {
      return `${rates.weekly.toLocaleString()}/wk`;
    } else if (rates.nightly) {
      return `${rates.nightly.toLocaleString()}/night`;
    }
  };
  return (
    <div className="rounded-xl shadow-md relative">
      <Image
        src={property.images[0]}
        alt=""
        height={0}
        width={0}
        sizes={"100vw"}
        className="w-full h-auto rounded-t-xl"
      />
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="text-gray-600">{property.type}</div>
          <h3 className="text-xl font-bold">{property.name}</h3>
        </div>
        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          ${getRateDisplay()}
        </h3>

        <div className="flex justify-center gap-4 text-gray-500 mb-4">
          <p>
            <FaBed className="inline mr-2" /> {property.beds}
            <span className="md:hidden lg:inline">Beds</span>
          </p>
          <p>
            <FaBath className="inline mr-2" /> {property.baths}
            <span className="md:hidden lg:inline">Baths</span>
          </p>
          <p>
            <FaRulerCombined className="inline mr-2" />
            {property.square_feet}{" "}
            <span className="md:hidden lg:inline">sqft</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
          {property.rates.nightly ? (
            <p>
              <FaMoneyBill className="inline mr-2" /> Nightly
            </p>
          ) : null}

          {property.rates.weekly ? (
            <p>
              <FaMoneyBill className="inline mr-2" /> Weekly
            </p>
          ) : null}

          {property.rates.monthly ? (
            <p>
              <FaMoneyBill className="inline mr-2" /> Monthly
            </p>
          ) : null}
        </div>

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between mb-4">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <FaLocationDot className="text-lg text-orange-700 mt-1" />
            <span className="text-orange-700">
              {property.location.city} {property.location.state}
            </span>
          </div>
          <Link
            href={`properties/${property._id}`}
            className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
