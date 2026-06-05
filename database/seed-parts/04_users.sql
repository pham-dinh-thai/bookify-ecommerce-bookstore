INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `gender`, `password`, `isActive`, `roleId`, `createdAt`) VALUES
  ('01973001-0000-7000-8000-000000000001', 'Admin', 'Bookify', 'admin@bookify.test', 'other', '$2b$10$iJhy3YHhU3dVH5USBa3aOeFREKvFn.uz7VET37YbHA9ZAYOiSlqu2', 1, 'admin', NOW(6)),
  ('01973001-0000-7000-8000-000000000002', 'Staff', 'Bookify', 'staff@bookify.test', 'other', '$2b$10$iJhy3YHhU3dVH5USBa3aOeFREKvFn.uz7VET37YbHA9ZAYOiSlqu2', 1, 'staff', NOW(6))
ON DUPLICATE KEY UPDATE
  `firstName` = VALUES(`firstName`),
  `lastName` = VALUES(`lastName`),
  `gender` = VALUES(`gender`),
  `password` = VALUES(`password`),
  `isActive` = VALUES(`isActive`),
  `roleId` = VALUES(`roleId`);
