'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DNAProps {
  width?: number;
  height?: number;
  color1?: string;
  color2?: string;
  backgroundColor?: string;
}

const AnimatedDNA = ({
  width = 800,
  height = 400,
  color1 = '#3b82f6', // Blue
  color2 = '#8b5cf6', // Purple
  backgroundColor = 'transparent'
}: DNAProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nucleotides, setNucleotides] = useState<{x: number, y: number, type: string}[]>([]);
  
  // Generate DNA nucleotides
  useEffect(() => {
    const generateDNA = () => {
      const newNucleotides = [];
      const pairCount = 20; // Number of base pairs
      const baseTypes = ['A-T', 'T-A', 'G-C', 'C-G']; // Base pairs
      
      for (let i = 0; i < pairCount; i++) {
        const xPos = (width / pairCount) * i;
        const yOffset = Math.sin(i * 0.5) * (height / 4) + (height / 2);
        const randomType = baseTypes[Math.floor(Math.random() * baseTypes.length)];
        
        newNucleotides.push({
          x: xPos,
          y: yOffset,
          type: randomType
        });
      }
      
      setNucleotides(newNucleotides);
    };
    
    generateDNA();
    
    // Regenerate DNA periodically for variety
    const interval = setInterval(() => {
      generateDNA();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [width, height]);
  
  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden rounded-lg"
      style={{ height, backgroundColor }}
    >
      <svg width={width} height={height} className="absolute left-1/2 -translate-x-1/2">
        {/* Backbone strands */}
        <motion.path
          d={`M 0 ${height/2 - 50} ${nucleotides.map(n => `L ${n.x} ${n.y - 30}`).join(' ')}`}
          stroke={color1}
          strokeWidth={4}
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            x: [-50, 0]
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut",
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear"
            }
          }}
        />
        <motion.path
          d={`M 0 ${height/2 + 50} ${nucleotides.map(n => `L ${n.x} ${n.y + 30}`).join(' ')}`}
          stroke={color2}
          strokeWidth={4}
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            x: [-50, 0]
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut",
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear"
            }
          }}
        />
        
        {/* Base pairs */}
        {nucleotides.map((nucleotide, index) => (
          <motion.g key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: [-50, 0]
            }}
            transition={{ 
              delay: 0.05 * index, 
              duration: 0.5,
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear"
              }
            }}
          >
            <line
              x1={nucleotide.x}
              y1={nucleotide.y - 30}
              x2={nucleotide.x}
              y2={nucleotide.y + 30}
              stroke={index % 2 === 0 ? color1 : color2}
              strokeWidth={2}
              strokeDasharray="4,4"
            />
            <circle 
              cx={nucleotide.x} 
              cy={nucleotide.y - 30} 
              r={5} 
              fill={color1} 
            />
            <circle 
              cx={nucleotide.x} 
              cy={nucleotide.y + 30} 
              r={5} 
              fill={color2} 
            />
            <text 
              x={nucleotide.x - 10} 
              y={nucleotide.y} 
              fill="white" 
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              {nucleotide.type}
            </text>
          </motion.g>
        ))}
      </svg>
      
      {/* Additional floating particles for visual effect */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-opacity-60"
          style={{
            backgroundColor: i % 2 === 0 ? color1 : color2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
            ],
            y: [
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
            ],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedDNA; 