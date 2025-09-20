"use client";

import { useRecommendedInternships } from "@/lib/hooks/useRecommendedInternships";
import { motion } from "framer-motion";
import InternshipCards from "@/lib/components/InternshipCards";

interface Props {
  bookmarked: { [id: string]: boolean }; // must be object
  toggleBookmark: (id: string) => void;
}

export default function InternshipRecommendations({ bookmarked, toggleBookmark }: Props) {
  const recommendedInternships = useRecommendedInternships();

  if (!recommendedInternships.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
        Suggested for You
      </h2>

      <div className="overflow-x-auto px-2 sm:px-6 md:px-12 lg:px-20 pb-8 md:pb-10">
        <div className="flex w-max md:w-full gap-6">
          {recommendedInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              className="flex-shrink-0 min-w-[280px] max-w-xs md:max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <InternshipCards
                internships={[internship]}
                bookmarked={bookmarked}
                toggleBookmark={toggleBookmark}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}