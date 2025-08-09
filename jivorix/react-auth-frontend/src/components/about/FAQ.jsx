import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "../../assets/assets";

function FAQItem({ index, q, a, isOpen, onClick }) {
  return (
    <div className="border-b last:border-none">
      <button
        onClick={onClick}
        className="flex w-full items-start justify-between gap-4 py-6 max-md:py-5 text-left"
      >
        <span className="text-lg font-medium max-lg:text-[18px] max-md:text-[16px] max-sm:text-[14px]">
          {index + 1}. {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 rounded-full p-1 transition-colors"
        >
          <Plus size={20} strokeWidth={2} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto", opacity: 1 },
              collapsed: { height: 0, opacity: 0 },
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text3 text-[14px] max-md:text-[12px] max-sm:text-[10px]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="mb30 w-full rounded-2xl bg-white p-6 max-md:p-4 max-sm:p-3 shadow-lg flex flex-col gap-6 max-lg:gap-5 max-md:gap-4">
      <h1 className="mb-8 text-center text-3xl font-bold">FAQ Questions</h1>
      {faqs.map((f, index) => (
        <FAQItem
          key={f._id || f.q}
          index={index}
          q={f.q}
          a={f.a}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </section>
  );
}
