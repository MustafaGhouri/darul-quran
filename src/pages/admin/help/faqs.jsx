import React from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Accordion, AccordionItem } from "@heroui/react";
import { title } from "framer-motion/client";

const Faqs = () => {
  const defaultContent = [
    {
        id: 1,
      title: "How do I enroll in a course?",
      content:
        "You can browse all available courses and explore their details, including schedules, content, and instructors. Once you find the right course, you can easily enroll directly from the course page with just one click.",
    },
    {
        id: 2,
      title: "Can I reschedule my class?",
      content:
        "You can browse all available courses and explore their details, including schedules, content, and instructors. Once you find the right course, you can easily enroll directly from the course page with just one click.",
    },
    {
        id: 3,
      title: "How do I access my class recordings and materials?",
      content:
        "You can browse all available courses and explore their details, including schedules, content, and instructors. Once you find the right course, you can easily enroll directly from the course page with just one click.",
    },
    {
        id: 4,
      title: "Where can I see my upcoming classes?",
      content:
        "You can browse all available courses and explore their details, including schedules, content, and instructors. Once you find the right course, you can easily enroll directly from the course page with just one click.",
    },
    {
        id: 5,
      title: "How do I contact my teacher?",
      content:
        "You can browse all available courses and explore their details, including schedules, content, and instructors. Once you find the right course, you can easily enroll directly from the course page with just one click.",
    },
    {
        id: 6,
      title: " How do I submit a refund request?",
      content:
        "You can browse all available courses and explore their details, including schedules, content, and instructors. Once you find the right course, you can easily enroll directly from the course page with just one click.",
    },
    {
        id: 7,
      title: "Can I download my payment history??",
      content:
        "You can browse all available courses and explore their details, including schedules, content, and instructors. Once you find the right course, you can easily enroll directly from the course page with just one click.",
    },
  ];

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <DashHeading
        title={"FAQs"}
        desc={"Find quick answers to common questions."}
      />
      <div className="my-3">
        <Accordion variant="splitted" itemClasses={{indicator:"rounded-full bg-[#F1F2F9] p-1 "}} className="">
          {defaultContent.map((item) => (
            <AccordionItem key={item.id} aria-label="Accordion 1" title={<h1 className="text-lg text-[#333333] font-bold">{item.title}</h1>}>
              <p className="text-sm text-[#666666]">{item.content}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Faqs;
