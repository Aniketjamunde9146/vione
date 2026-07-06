"use client";

import { useRef, Children } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

function StackSection({
  children,
  index,
  total,
  progress,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const isLast = index === total - 1;

  // Current section fades + shrinks slightly as the NEXT one scrolls over it
  const opacity = useTransform(
    progress,
    [start, end - segment * 0.25, end],
    [1, 1, isLast ? 1 : 0.35]
  );
  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.92]);
  const y = useTransform(progress, [start, end], [0, isLast ? 0 : -40]);

  return (
    <motion.div
      style={{ opacity, scale, y, zIndex: index }}
      className="sticky top-0 h-screen w-full will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export default function ScrollStack({
  children,
}: {
  children: React.ReactNode[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const items = Children.toArray(children);

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: `${items.length * 100}vh` }}
    >
      {items.map((child, i) => (
        <StackSection
          key={i}
          index={i}
          total={items.length}
          progress={scrollYProgress}
        >
          {child}
        </StackSection>
      ))}
    </div>
  );
}