INSERT INTO `roles` (`id`, `name`) VALUES
  ('admin', 'Admin'),
  ('staff', 'Staff'),
  ('user', 'User')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`);
