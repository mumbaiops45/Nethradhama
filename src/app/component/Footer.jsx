import React from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-300">
    
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

         
          <div>
            <img
              src="/logo.png"
              alt="NSO Logo"
              className="h-14 mb-5"
            />

            <h3 className="text-white text-lg font-semibold mb-4">
              Nethradhama School of Optometry
            </h3>

            <p className="text-sm leading-7 text-gray-400">
              Nethradhama School of Optometry is committed to
              excellence in education, research, clinical training,
              and professional development in the field of Optometry.
            </p>
          </div>

         
          <div>
            <h3 className="text-white text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>

              <li>
                <a href="/about-us" className="hover:text-white transition">
                  About Us
                </a>
              </li>

              <li>
                <a href="/academics" className="hover:text-white transition">
                  Academics
                </a>
              </li>

              <li>
                <a href="/research" className="hover:text-white transition">
                  Research
                </a>
              </li>

              <li>
                <a href="/faculty" className="hover:text-white transition">
                  Faculty
                </a>
              </li>

              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

        
          <div>
            <h3 className="text-white text-lg font-semibold mb-5">
              Programs
            </h3>

            <ul className="space-y-3 text-sm">
              <li>B.Sc. Optometry (4 Years)</li>

              <li>
                Affiliated to RGUHS Karnataka
              </li>

              <li>
                One Year Clinical Internship
              </li>

              <li>
                Research Opportunities
              </li>

              <li>
                University Rank Holders
              </li>

              <li>
                Clinical Training Excellence
              </li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-white text-lg font-semibold mb-5">
              Contact Information
            </h3>

            <div className="space-y-5 text-sm">

              <div className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p>080-26716152</p>
                  <p>+91 7760744990</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-400 mt-1" />
                <p>optoschool@nethradhama.org</p>
              </div>

              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-blue-400 mt-1" />
                <p>
                  Nethradhama School of Optometry,
                  Bengaluru, Karnataka, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Nethradhama School of Optometry.
            All Rights Reserved.
          </p>

          <a href="https://www.nakshatranamahacreations.com/"
          target="_blank"
          className="text-sm text-gray-500">
            Developed By Nakshatra Namaha Creations
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;