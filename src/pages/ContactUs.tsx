// import React from 'react';

// const ContactUs: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Get in Touch</h1>
//         <p className="text-lg text-gray-600 mb-10 text-center">
//           Have a question or just want to say hi? We'd love to hear from you!
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Contact Form */}
//           <form className="space-y-6">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Your Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="John Doe"
//               />
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="you@example.com"
//               />
//             </div>

//             <div>
//               <label htmlFor="message" className="block text-sm font-medium text-gray-700">
//                 Message
//               </label>
//               <textarea
//                 id="message"
//                 rows={4}
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Write your message..."
//               ></textarea>
//             </div>

//             <button
//               type="submit"
//               className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
//             >
//               Send Message
//             </button>
//           </form>

//           {/* Contact Details */}
//           <div className="space-y-6">
//             <div className="flex items-center">
//               <svg
//                 className="w-6 h-6 text-blue-500"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M3 8l7.89 7.89a2.006 2.006 0 002.828 0L21 8"
//                 />
//               </svg>
//               <p className="ml-4 text-gray-600">info@yourcompany.com</p>
//             </div>
//             <div className="flex items-center">
//               <svg
//                 className="w-6 h-6 text-blue-500"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M17 10l4-4m0 0l-4-4m4 4H7.667M3 20V8c0-.455.137-.878.373-1.23C3.648 6.457 4.333 6 5.057 6h13.886c.724 0 1.409.457 1.684 1.23.236.352.373.775.373 1.23v12a1 1 0 01-1 1H5a1 1 0 01-1-1z"
//                 />
//               </svg>
//               <p className="ml-4 text-gray-600">1234 Example Street, City, Country</p>
//             </div>
//             <div className="flex items-center">
//               <svg
//                 className="w-6 h-6 text-blue-500"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6.854 11.854a4.992 4.992 0 006.293 0"
//                 />
//               </svg>
//               <p className="ml-4 text-gray-600">+123 456 7890</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;