INSERT INTO `languages` (`id`, `name`) VALUES
  ('en', 'English'),
  ('vi', 'Vietnamese'),
  ('ja', 'Japanese')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`);
