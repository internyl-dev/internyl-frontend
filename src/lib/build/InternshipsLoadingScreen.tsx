export default function InternshipsLoadingScreen() {
    return (
        <div className="min-h-screen radial-bg text-gray-800 px-4 mb-8">
            <div className="text-center pt-2 mt-0">...</div>

            {/* Enhanced Skeleton Cards */}
            <div className="px-0 sm:px-4 lg:px-8">
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-[350px] bg-white rounded-[30px] px-[32px] py-[42px] shadow-lg border border-black/30 animate-pulse relative">
                            {/* Info Icon - Top Right */}
                            <div className="absolute top-4 right-4">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            </div>

                            {/* Header Section */}
                            <div className="mb-6">
                                {/* Provider name */}
                                <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>

                                {/* Program title - large gradient text simulation */}
                                <div className="space-y-2 mb-4">
                                    <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-full"></div>
                                    <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-4/5"></div>
                                </div>

                                {/* Due date with icon */}
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="w-6 h-6 bg-red-200 rounded-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="space-y-4">
                                {/* Subject tags */}
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-blue-200 rounded mt-1"></div>
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        <div className="h-6 bg-blue-100 rounded-full w-20 px-3 py-1"></div>
                                        <div className="h-6 bg-blue-100 rounded-full w-24 px-3 py-1"></div>
                                        <div className="h-6 bg-blue-100 rounded-full w-16 px-3 py-1"></div>
                                    </div>
                                </div>

                                {/* Grade level */}
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-orange-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                                </div>

                                {/* Duration */}
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-purple-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-yellow-300 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-36"></div>
                                </div>

                                {/* Cost/Stipend */}
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                            </div>

                            {/* Action buttons at bottom */}
                            <div className="flex justify-between items-center mt-6 pt-2">
                                <div className="w-10 h-10 bg-blue-200 rounded-full"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shimmer effect, floating */}
            <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          .animate-pulse::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
            border-radius: 30px;
            pointer-events: none;
            z-index: 1;
          }
        `}</style>
        </div>
    );
}