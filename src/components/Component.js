import React from "react";


export const Component = () => {
  return (
<div id="webcrumbs"> 
        	<div className="w-[1440px] font-sans">
	  <header className="relative bg-gradient-to-b from-amber-900/90 to-amber-800/90 text-white py-4">
	    <nav className="container mx-auto px-6 flex justify-between items-center">
	      <div className="flex items-center">
	        <h1 className="text-3xl font-bold italic">Delizioso</h1>
	        <span className="ml-2 text-sm border-l border-amber-200/50 pl-2">Defla</span>
	      </div>
	      
	      <ul className="hidden md:flex space-x-8">
	        <li><a href="#menu" className="hover:text-amber-200 transition-colors duration-300 font-medium">Menu</a></li>
	        <li><a href="#about" className="hover:text-amber-200 transition-colors duration-300 font-medium">About Us</a></li>
	        <li><a href="#gallery" className="hover:text-amber-200 transition-colors duration-300 font-medium">Gallery</a></li>
	        <li><a href="#contact" className="hover:text-amber-200 transition-colors duration-300 font-medium">Contact</a></li>
	      </ul>
	      
	      <div className="hidden md:flex items-center space-x-4">
	        <a href="#reserve" className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105">Reserve Table</a>
	      </div>
	      
	      <details className="md:hidden relative">
	        <summary className="list-none">
	          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
	          </svg>
	        </summary>
	        <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10">
	          <a href="#menu" className="block px-4 py-2 hover:bg-amber-100 transition-colors duration-200">Menu</a>
	          <a href="#about" className="block px-4 py-2 hover:bg-amber-100 transition-colors duration-200">About Us</a>
	          <a href="#gallery" className="block px-4 py-2 hover:bg-amber-100 transition-colors duration-200">Gallery</a>
	          <a href="#contact" className="block px-4 py-2 hover:bg-amber-100 transition-colors duration-200">Contact</a>
	          <a href="#reserve" className="block px-4 py-2 text-amber-700 font-medium hover:bg-amber-100 transition-colors duration-200">Reserve Table</a>
	        </div>
	      </details>
	    </nav>
	  </header>
	
	  <main>
	    <section className="relative">
	      <div className="bg-[url('https://images.unsplash.com/photo-1534649643822-e162a550459e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center h-[600px]">
	        <div className="bg-black/50 h-full w-full">
	          <div className="container mx-auto px-6 flex flex-col justify-center h-full">
	            <div className="max-w-2xl">
	              <h2 className="text-white text-5xl md:text-6xl font-bold leading-tight">Authentic Italian Cuisine in Defla</h2>
	              <p className="text-gray-200 mt-4 text-xl">Experience the taste of Italy with our handcrafted dishes made from the freshest ingredients.</p>
	              <div className="mt-8 flex flex-wrap gap-4">
	                <a href="#menu" className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">View Menu</a>
	                <a href="#reserve" className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">Book a Table</a>
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
	    </section>
	    
	    <section className="py-16 bg-amber-50">
	      <div className="container mx-auto px-6">
	        <div className="text-center mb-12">
	          <h2 className="text-3xl font-bold mb-2">Special Menu</h2>
	          <p className="text-gray-600 max-w-xl mx-auto">Our chef's selection of authentic Italian dishes, prepared with love and the finest ingredients.</p>
	        </div>
	        
	        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
	          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
	            <div className="h-56 overflow-hidden">
	              <img src="https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80" alt="Pasta Carbonara" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
	            </div>
	            <div className="p-6">
	              <h3 className="text-xl font-semibold mb-2">Pasta Carbonara</h3>
	              <p className="text-gray-600 mb-4">Spaghetti with pancetta, pecorino cheese, egg, and black pepper.</p>
	              <div className="flex justify-between items-center">
	                <span className="text-lg font-bold text-amber-700">$18.99</span>
	                <button className="text-amber-600 hover:text-amber-800 transition-colors duration-300 flex items-center">
	                  <span>Order Now</span>
	                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
	                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
	                  </svg>
	                </button>
	              </div>
	            </div>
	          </div>
	          
	          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
	            <div className="h-56 overflow-hidden">
	              <img src="https://images.unsplash.com/photo-1564936281291-294551497d81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Margherita Pizza" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
	            </div>
	            <div className="p-6">
	              <h3 className="text-xl font-semibold mb-2">Margherita Pizza</h3>
	              <p className="text-gray-600 mb-4">Classic pizza with tomato sauce, mozzarella, and fresh basil.</p>
	              <div className="flex justify-between items-center">
	                <span className="text-lg font-bold text-amber-700">$16.99</span>
	                <button className="text-amber-600 hover:text-amber-800 transition-colors duration-300 flex items-center">
	                  <span>Order Now</span>
	                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
	                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
	                  </svg>
	                </button>
	              </div>
	            </div>
	          </div>
	          
	          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
	            <div className="h-56 overflow-hidden">
	              <img src="https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80" alt="Tiramisu" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
	            </div>
	            <div className="p-6">
	              <h3 className="text-xl font-semibold mb-2">Tiramisu</h3>
	              <p className="text-gray-600 mb-4">Coffee-flavored Italian dessert made with ladyfingers, mascarpone cheese, and cocoa.</p>
	              <div className="flex justify-between items-center">
	                <span className="text-lg font-bold text-amber-700">$9.99</span>
	                <button className="text-amber-600 hover:text-amber-800 transition-colors duration-300 flex items-center">
	                  <span>Order Now</span>
	                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
	                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
	                  </svg>
	                </button>
	              </div>
	            </div>
	          </div>
	        </div>
	        
	        <div className="text-center mt-12">
	          <a href="#menu" className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">View Full Menu</a>
	        </div>
	      </div>
	    </section>
	  </main>
	</div>
 
        </div>
  )
}

