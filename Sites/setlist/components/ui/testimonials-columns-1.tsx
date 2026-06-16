"use client";
import React from "react";
import { motion } from "motion/react";

export interface ColumnTestimonial {
  text: string;
  name: string;
  role: string;
  initials: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: ColumnTestimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="tcol-track"
      >
        {[...new Array(2).fill(0)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, name, role, initials }, i) => (
              <div className="tcol-card" key={i}>
                <p className="tcol-text">{text}</p>
                <div className="tcol-by">
                  <span className="tcol-av">{initials}</span>
                  <div className="tcol-info">
                    <div className="tcol-name">{name}</div>
                    <div className="tcol-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
