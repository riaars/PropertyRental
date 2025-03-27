import React from "react";
import { FaMoneyBill } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaBath } from "react-icons/fa";
import { FaRulerCombined } from "react-icons/fa";
import { FaBed } from "react-icons/fa";

interface Rates {
  nightly: number;
  weekly: number;
  monthly: number;
}

interface Location {
  city: string;
  state: string;
}
export interface Property {
  type: string;
  name: string;
  beds: number;
  baths: number;
  square_feet: number;
  rates: Rates;
  location: Location;
}

interface PropertyCardProps {
  property: Property;
}
const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="rounded-xl shadow-md relative">
      <img
        src="images/properties/a1.jpg"
        alt=""
        className="w-full h-auto rounded-t-xl"
      />
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="text-gray-600">{property.type}</div>
          <h3 className="text-xl font-bold">{property.name}</h3>
        </div>
        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right"></h3>

        <div className="flex justify-center gap-4 text-gray-500 mb-4">
          <p>
            <FaBed /> {property.beds}
            <span className="md:hidden lg:inline">Beds</span>
          </p>
          <p>
            <FaBath /> {property.baths}
            <span className="md:hidden lg:inline">Baths</span>
          </p>
          <p>
            <FaRulerCombined />
            {property.square_feet}{" "}
            <span className="md:hidden lg:inline">sqft</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
          <p>
            <FaMoneyBill />
            Weekly
          </p>
          <p>
            <FaMoneyBill />
          </p>
        </div>

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between mb-4">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <FaLocationDot className="text-lg text-orange-700" />
            <span className="text-orange-700">
              {property.location.city} {property.location.state}
            </span>
          </div>
          <a
            href="property.html"
            className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
