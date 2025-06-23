import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Gavel, AlertCircle, Eye, Users, TrendingUp } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';

const AuctionsPage = () => {
  const { data: auctionProperties = [], isLoading } = useProperties({ listingType: 'auction' });
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  // Sample auction data based on the FNB notice
  const sampleAuctions = [
    {
      id: 'auction_1',
      lotNumber: '102',
      title: 'Seboo ward Mmadikare',
      location: 'Mmadikare',
      propertyType: 'house',
      bedrooms: 1,
      plotSize: '2542 m²',
      description: 'A one-bedroomed house with two outbuildings, each comprising one room.',
      startingBid: 300000,
      currentBid: null,
      auctionDate: '2025-07-18',
      auctionTime: '10:00hrs',
      auctionHouse: 'First National Bank of Botswana Limited',
      auctioneerContact: '72192666 / 300 8293',
      depositRequired: 12.5, // percentage
      images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'],
      deputySheriff: 'Debrain James Moyo'
    },
    {
      id: 'auction_2', 
      lotNumber: '5779',
      title: 'Kanamo Ward Mahalapye',
      location: 'Mahalapye',
      propertyType: 'house',
      bedrooms: 2,
      plotSize: '945 m²',
      description: 'A two-bedroomed house, sitting room, combined toilet and bathroom, one bedroom and pit latrine toilet.',
      startingBid: 404000,
      currentBid: null,
      auctionDate: '2025-07-25',
      auctionTime: '10:00hrs',
      auctionHouse: 'First National Bank of Botswana Limited',
      auctioneerContact: '74724543 / 75536687',
      depositRequired: 12.5,
      images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'],
      deputySheriff: 'Okeditse Masolotate'
    },
    {
      id: 'auction_3',
      lotNumber: '6048', 
      title: 'Disaneng Ward Maun',
      location: 'Maun',
      propertyType: 'house',
      bedrooms: 3,
      plotSize: '884 m²',
      description: 'A three-bedroomed house, pit latrine toilet, fenced.',
      startingBid: 368000,
      currentBid: null,
      auctionDate: '2025-07-25',
      auctionTime: '10:30hrs',
      auctionHouse: 'First National Bank of Botswana Limited',
      auctioneerContact: '74724543 / 75536687',
      depositRequired: 12.5,
      images: ['https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'],
      deputySheriff: 'Okeditse Masolotate'
    },
    {
      id: 'auction_4',
      lotNumber: '3705',
      title: 'Mmopane Block 1',
      location: 'Mmopane',
      propertyType: 'house',
      bedrooms: 3,
      plotSize: '1140 m²',
      description: 'Three-bedroomed house consisting of two bathrooms, ensuite, sitting room, open plan kitchen, paved, electric fence, motorised gate, double garage.',
      startingBid: 1224000,
      currentBid: null,
      auctionDate: '2025-07-25',
      auctionTime: '10:30hrs',
      auctionHouse: 'First National Bank of Botswana Limited',
      auctioneerContact: '3165097 / 71698697',
      depositRequired: 12.5,
      images: ['https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpg?auto=compress&cs=tinysrgb&w=800'],
      deputySheriff: 'Uyapo Marika'
    }
  ];

  // Calculate time remaining for auctions
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const newTimeLeft: { [key: string]: string } = {};

      sampleAuctions.forEach(auction => {
        const auctionDateTime = new Date(`${auction.auctionDate}T${auction.auctionTime.replace('hrs', ':00')}`);
        const difference = auctionDateTime.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            newTimeLeft[auction.id] = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newTimeLeft[auction.id] = `${hours}h ${minutes}m`;
          } else {
            newTimeLeft[auction.id] = `${minutes}m`;
          }
        } else {
          newTimeLeft[auction.id] = 'Auction ended';
        }
      });

      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const AuctionCard = ({ auction }: { auction: any }) => (
    <motion.div
      layoutId={`auction-${auction.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-beedab-blue/20 hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="relative">
        <img 
          src={auction.images[0]} 
          alt={auction.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 bg-beedab-blue text-white px-3 py-1 rounded-full text-sm font-bold">
          Lot {auction.lotNumber}
        </div>
        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {timeLeft[auction.id] || 'Loading...'}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{auction.title}</h3>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{auction.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Bedrooms:</span>
            <span className="ml-1 font-medium">{auction.bedrooms}</span>
          </div>
          <div>
            <span className="text-gray-500">Plot Size:</span>
            <span className="ml-1 font-medium">{auction.plotSize}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-2">{auction.description}</p>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-beedab-blue">
              Starting bid: P{auction.startingBid.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(auction.auctionDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {auction.auctionTime}
            </div>
          </div>

          <div className="text-xs text-gray-500 mb-3">
            <div><strong>Auctioneer:</strong> {auction.auctioneerContact}</div>
            <div><strong>Deputy Sheriff:</strong> {auction.deputySheriff}</div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg mb-3">
            <div className="flex items-center text-beedab-blue mb-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Deposit Required</span>
            </div>
            <span className="text-sm">{auction.depositRequired}% of bid price on sale date</span>
          </div>

          <button className="w-full bg-gradient-to-r from-beedab-blue to-beedab-lightblue text-white py-2 px-4 rounded-lg font-medium hover:from-beedab-lightblue hover:to-beedab-blue transition-colors flex items-center justify-center">
            <Gavel className="h-4 w-4 mr-2" />
            Register to Bid
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-beedab-lightblue/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-beedab-blue to-beedab-lightblue text-white border-b border-beedab-blue/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Gavel className="h-8 w-8 text-white mr-3" />
              <h1 className="text-4xl font-bold text-white">Property Auctions</h1>
            </div>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Bank foreclosure auctions and distressed property sales across Botswana. 
              All auctions conducted by registered auctioneers and deputy sheriffs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30">
                <TrendingUp className="h-6 w-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{sampleAuctions.length}</div>
                <div className="text-sm text-blue-100">Active Auctions</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30">
                <Eye className="h-6 w-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">12.5%</div>
                <div className="text-sm text-blue-100">Deposit Required</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30">
                <Users className="h-6 w-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">FNB</div>
                <div className="text-sm text-blue-100">Authorized Bank</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-blue-100 border border-beedab-blue/30 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-beedab-blue mr-3 mt-0.5" />
            <div>
              <h3 className="font-bold text-beedab-blue mb-1">Important Auction Information</h3>
              <p className="text-beedab-blue/80 text-sm">
                Each successful bidder will be required to pay 12.5% of the bid price on the date of the sale. 
                All properties are sold "as is" and subject to the terms and conditions of the respective auction houses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg h-96 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-xl"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionsPage;