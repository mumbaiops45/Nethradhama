import React from 'react'
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa'

const Whatsapp = () => {
    return (
        <div className='fixed bottom-6 right-6 flex flex-col gap-4 z-50'>
            <a
                href="tel:+917760744990"
                className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
                aria-label="Call Us"
            >
                <FaPhoneAlt size={22} />
            </a>
            <a
                href='https://wa.me/917760744990'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition duration-300'
                aria-label='Chat on WhatsApp'
            >
                <FaWhatsapp size={28} />
            </a>
        </div>
    )
}
export default Whatsapp
