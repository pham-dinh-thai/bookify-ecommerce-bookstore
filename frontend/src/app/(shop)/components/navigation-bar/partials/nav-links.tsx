'use client';

import Link from 'next/link';
import { useState } from 'react';
import NavCategoryModal from './nav-category-modal';
import { ChevronDown } from 'lucide-react';

type NavLinksProps = {
  navLinks: NavLink[];
};

export default function NavLinks({ navLinks }: NavLinksProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<NavLink['children'] | undefined>(
    undefined,
  );

  const openCategoryModal = (children?: NavLink['children']) => {
    setCategories(children);
    setModalOpen(true);
  };

  return (
    <>
      <ul className="flex items-center gap-7">
        {navLinks.map((link) => (
          <li key={link.label} className="relative">
            {link.children ? (
              <button
                type="button"
                onClick={() => openCategoryModal(link.children)}
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[13.5px] font-medium uppercase tracking-[0.05em] text-[#3f6754] transition-all hover:bg-[#eff5ef] hover:text-[#2b352f]"
              >
                {link.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                href={link.path || '#'}
                className="rounded-full px-3 py-2 text-[13.5px] font-medium uppercase tracking-[0.05em] text-[#3f6754] transition-all hover:bg-[#eff5ef] hover:text-[#2b352f]"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <NavCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories || []}
      />
    </>
  );
}
