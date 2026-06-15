import React, { useEffect, useState } from 'react';
import { Sun, Moon, Palette, Droplet, Leaf, Anchor } from 'lucide-react';

export default function ThemeToggle() {
  // themes: 'default', 'blue', 'orange', 'earth', 'nautical', 'dark'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }
      return 'default'; 
    }
    return 'default';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all classes/attributes
    root.classList.remove('dark');
    root.removeAttribute('data-theme');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme !== 'default') {
      root.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    if (theme === 'default') setTheme('blue');
    else if (theme === 'blue') setTheme('orange');
    else if (theme === 'orange') setTheme('earth');
    else if (theme === 'earth') setTheme('nautical');
    else if (theme === 'nautical') setTheme('dark');
    else setTheme('default');
  };

  return (
    <button
      onClick={cycleTheme}
      title={`Toggle Theme (Current: ${theme})`}
      className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden hover:opacity-80 transition-300 shrink-0 cursor-pointer text-monday-black border border-monday-border"
    >
      {theme === 'default' && <Droplet size={20} />}
      {theme === 'blue' && <Sun size={20} />}
      {theme === 'orange' && <Palette size={20} />}
      {theme === 'earth' && <Leaf size={20} />}
      {theme === 'nautical' && <Anchor size={20} />}
      {theme === 'dark' && <Moon size={20} />}
    </button>
  );
}
