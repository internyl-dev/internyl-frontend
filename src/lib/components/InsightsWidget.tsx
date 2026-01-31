import { motion } from "framer-motion";
import { InternshipCards as Internship } from "@/lib/interfaces/internshipCards";

export const InsightsWidget = ({ savedCount, totalInternships, savedInternshipsFiltered }: {
  savedCount: number;
  totalInternships: number;
  savedInternshipsFiltered: Internship[];
}) => {
  const completionRate = totalInternships > 0 ? (savedCount / totalInternships) * 100 : 0;
  const activeCount = savedInternshipsFiltered.filter(i => {
    const deadlines = i.dates?.deadlines || [];
    const nextDeadline = deadlines.find(d => d.date && new Date(d.date) > new Date());
    return nextDeadline;
  }).length;
  const dueSoonCount = savedInternshipsFiltered.filter(i => {
    const deadlines = i.dates?.deadlines || [];
    const soonDeadline = deadlines.find(d => {
      if (!d.date) return false;
      const deadlineDate = new Date(d.date);
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return deadlineDate <= weekFromNow && deadlineDate > new Date();
    });
    return soonDeadline;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl mx-2 sm:mx-4 mt-6"
    >
      <h3 className="text-lg font-semibold text-[#2F2F3A] mb-4">Your Progress</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <motion.div
          className="p-3 bg-white/40 rounded-xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(savedCount / Math.max(totalInternships, 1) * 100, 100)}%` }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#ec6464] to-[#f07575]"
          />
          <motion.div
            className="text-2xl font-bold text-[#ec6464]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          >
            {savedCount}
          </motion.div>
          <div className="text-sm text-gray-600">Saved</div>
        </motion.div>
        <motion.div
          className="p-3 bg-white/40 rounded-xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.3 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#9381FF] to-[#A891FF]"
          />
          <motion.div
            className="text-2xl font-bold text-[#9381FF]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
          >
            {Math.round(completionRate)}%
          </motion.div>
          <div className="text-sm text-gray-600">Explored</div>
        </motion.div>
        <motion.div
          className="p-3 bg-white/40 rounded-xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.3 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(activeCount / Math.max(savedCount, 1) * 100, 100)}%` }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#2BA280] to-[#3C66C2]"
          />
          <motion.div
            className="text-2xl font-bold text-[#2BA280]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
          >
            {activeCount}
          </motion.div>
          <div className="text-sm text-gray-600">Active</div>
        </motion.div>
        <motion.div
          className="p-3 bg-white/40 rounded-xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: dueSoonCount > 0 ? "100%" : "0%" }}
            transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E26262] to-[#F07575]"
          />
          <motion.div
            className="text-2xl font-bold text-[#E26262]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          >
            {dueSoonCount}
          </motion.div>
          <div className="text-sm text-gray-600">Due Soon</div>
        </motion.div>
      </div>
    </motion.div>
  );
};