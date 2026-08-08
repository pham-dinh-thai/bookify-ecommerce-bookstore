#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const COUNT = Number(process.argv[2] || 10000);
const CHUNK = 500;

const ADJECTIVES = [
  'Secret', 'Hidden', 'Silent', 'Burning', 'Frozen', 'Midnight', 'Golden',
  'Shadow', 'Distant', 'Eternal', 'Crimson', 'Forgotten', 'Wandering',
  'Glass', 'Velvet', 'Quiet', 'Luminous', 'Shattered', 'Whispering', 'Paper',
];
const NOUNS = [
  'Garden', 'River', 'Kingdom', 'Library', 'Journey', 'Mirror', 'Horizon',
  'Letter', 'Star', 'Clock', 'Bridge', 'Forest', 'Mountain', 'Lantern',
  'Tide', 'Dream', 'Wall', 'Door', 'Song', 'Winter',
];
const ROMANS = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX',
  'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII',
  'XXXVIII', 'XXXIX', 'XL',
];

const PUBLISHER_IDS = Array.from(
  { length: 5 },
  (_, i) => `01973002-0000-7000-8000-${String(i + 1).padStart(12, '0')}`,
);
const LANGUAGE_IDS = ['en', 'en', 'en', 'vi', 'ja'];
const AUTHOR_IDS = Array.from(
  { length: 100 },
  (_, i) => `01973003-0000-7000-8000-${String(i + 1).padStart(12, '0')}`,
);
const GENRE_IDS = Array.from(
  { length: 100 },
  (_, i) => `01973004-0000-7000-8000-${String(i + 1).padStart(12, '0')}`,
);

const DESCRIPTIONS = [
  'A sweeping tale of ambition, loss, and the quiet courage that carries ordinary people through extraordinary times.',
  'Part mystery, part meditation on memory, this novel weaves together the lives of strangers across a single decade.',
  'An unforgettable story about belonging, written with wit and tenderness in equal measure.',
  'A masterful study of power and forgiveness that lingers long after the final page.',
  'Set against a breathtaking landscape, this is a story of survival, love, and second chances.',
];

function bookId(i) {
  return `01973005-0000-7000-8000-${String(i + 1).padStart(12, '0')}`;
}

function coverId(i) {
  return `01973006-0000-7000-8000-${String(i + 1).padStart(12, '0')}`;
}

function isbn(i) {
  return `978${String(i + 1).padStart(10, '0')}`;
}

function title(i) {
  const adj = ADJECTIVES[i % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(i / ADJECTIVES.length) % NOUNS.length];
  const vol = ROMANS[Math.floor(i / (ADJECTIVES.length * NOUNS.length)) % ROMANS.length];
  return `${adj} ${noun} (Vol. ${vol})`;
}

function escapeSql(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "''");
}

function pick(list, count) {
  const pool = [...list];
  const picked = [];
  for (let n = 0; n < count && pool.length > 0; n += 1) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function money(min, max, roundTo) {
  return Math.round(randomInt(min, max) / roundTo) * roundTo;
}

function main() {
  const bookRows = [];
  const authorRows = [];
  const genreRows = [];
  const coverRows = [];

  for (let i = 0; i < COUNT; i += 1) {
    const id = bookId(i);
    const price = money(50000, 500000, 1000);
    const discount = Math.random() < 0.15 ? randomInt(5, 40) : 0;
    const quantity = Math.random() < 0.05 ? 0 : randomInt(1, 60);

    bookRows.push(
      `('${id}', '${isbn(i)}', '${escapeSql(title(i))}', '${PUBLISHER_IDS[i % PUBLISHER_IDS.length]}', '${escapeSql(DESCRIPTIONS[i % DESCRIPTIONS.length])}', ${price}, ${discount}, ${quantity}, '${LANGUAGE_IDS[i % LANGUAGE_IDS.length]}', ${randomInt(120, 900)})`,
    );

    for (const authorId of pick(AUTHOR_IDS, randomInt(1, 2))) {
      authorRows.push(`('${id}', '${authorId}')`);
    }
    for (const genreId of pick(GENRE_IDS, randomInt(1, 3))) {
      genreRows.push(`('${id}', '${genreId}')`);
    }

    coverRows.push(
      `('${coverId(i)}', '${id}', 'https://placehold.co/400x600?text=Bookify', 1, 0)`,
    );
  }

  const lines = [
    '-- Bookify bulk seed for load / performance testing.',
    `-- Generates ${COUNT} books with authors, genres, and covers.`,
    '-- Run this after seed.sql so publishers, languages, authors, and genres exist.',
    'SET NAMES utf8mb4;',
    'START TRANSACTION;',
  ];

  const statements = [
    ['books', '(`id`, `isbn`, `title`, `publisherId`, `description`, `originalPrice`, `discountPercentage`, `quantity`, `languageId`, `pageCount`)', bookRows],
    ['books_authors', '(`bookId`, `authorId`)', authorRows],
    ['books_genres', '(`bookId`, `genreId`)', genreRows],
    ['book_covers', '(`id`, `bookId`, `url`, `isPrimary`, `displayOrder`)', coverRows],
  ];

  for (const [table, columns, rows] of statements) {
    for (let start = 0; start < rows.length; start += CHUNK) {
      const chunk = rows.slice(start, start + CHUNK);
      lines.push(`INSERT INTO \`${table}\` ${columns} VALUES`);
      lines.push(chunk.join(',\n') + ';');
    }
  }

  lines.push('COMMIT;');

  const outputPath = path.join(__dirname, 'seed-books-large.sql');
  fs.writeFileSync(outputPath, lines.join('\n') + '\n');
  process.stdout.write(`Wrote ${outputPath} (${COUNT} books)\n`);
}

main();
