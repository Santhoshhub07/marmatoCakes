export default function Banner() {
  return (
    <div
      className="relative h-[80vh] sm:h-[90vh] md:h-screen bg-cover bg-center banner"

    >
      <div className="absolute inset-0 bg-black bg-opacity-60 sm:bg-opacity-50 flex flex-col justify-center items-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-center">
        Delicious Cakes Delivered
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl text-center">
        Order your favorite cakes and have them delivered fresh to your doorstep.
        </p>
        <a
          href="#order-section"
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors"
        >
          Order Now
        </a>
      </div>
    </div>
  );
}
