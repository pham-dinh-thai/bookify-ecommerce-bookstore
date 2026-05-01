import { Sparkles, BookOpen, PenLine } from 'lucide-react';
import Link from 'next/link';
import img from '../assets/img.jpg';
import Image from 'next/image';

export default function Category() {
  return (
    <section className="bg-[#2d6a4f] py-24">
      <div className="max-w-8xl mx-auto px-6 lg:px-24">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#f7faf5] tracking-tight mb-4">
            Curated Collections
          </h2>
          <p className="text-[#f7faf5]">
            Explore our definitive selection of English literary masterworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Featured - large */}
          <div className="md:col-span-2 md:row-span-2 bg-white p-8 rounded-[2rem] shadow-sm group cursor-pointer overflow-hidden relative min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-[1]" />

            <div className="relative z-10">
              <span className="text-xs font-bold tracking-widest uppercase text-[#2d6a4f] mb-2 block">
                Featured
              </span>
              <h3 className="text-3xl font-bold mb-4 text-[#1a3d2b]">
                Modern Classics
              </h3>
              <p className="text-[#58615b] max-w-xs">
                The defining narratives of the 20th century, from existentialist
                prose to groundbreaking social commentaries.
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-3/4 transform translate-y-8 translate-x-8 transition-transform">
              <Image
                src={img}
                className="rounded-tl-3xl shadow-2xl"
                alt="Modern Classics"
              />
            </div>
          </div>

          {/* Contemporary */}
          <div className="bg-[#dbe5dd] text-white p-8 rounded-[2rem] group cursor-pointer relative overflow-hidden">
            <h3 className="text-2xl text-[#1a3d2b] font-bold mb-2">
              Contemporary
            </h3>
            <p className="text-[#58615b] text-sm">
              Bold new voices and winner-circle fiction from across the globe.
            </p>
            <div className="mt-8 flex justify-end">
              <Sparkles size={36} className="text-[#2d6a4f]" />
            </div>
          </div>

          {/* Archives */}
          <div className="bg-[#dbe5dd] p-8 rounded-[2rem] group cursor-pointer">
            <h3 className="text-2xl font-bold mb-2 text-[#1a3d2b]">Archives</h3>
            <p className="text-[#58615b] text-sm">
              Deep dives into historical records and seminal biographies.
            </p>
            <div className="mt-8 flex justify-end">
              <BookOpen size={36} className="text-[#2d6a4f]" />
            </div>
          </div>

          {/* Poetry & Prose */}
          <div className="md:col-span-2 bg-[#d4e3ff] text-[#2d5383] p-8 rounded-[2rem] relative overflow-hidden group cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-2">Poetry &amp; Prose</h3>
                <p className="text-sm max-w-xs">
                  The rhythmic pulse of modern literature, collected in elegant
                  volumes.
                </p>
              </div>
              <PenLine size={36} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
