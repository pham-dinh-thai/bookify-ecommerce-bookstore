INSERT INTO `permissions` (`id`, `resource`, `action`) VALUES
  ('roles.read', 'roles', 'read'),
  ('roles.write', 'roles', 'write'),
  ('roles.delete', 'roles', 'delete'),
  ('permissions.read', 'permissions', 'read'),
  ('permissions.write', 'permissions', 'write'),
  ('permissions.delete', 'permissions', 'delete'),
  ('users.read', 'users', 'read'),
  ('users.write', 'users', 'write'),
  ('users.delete', 'users', 'delete'),
  ('customers.read', 'customers', 'read'),
  ('customers.write', 'customers', 'write'),
  ('customers.delete', 'customers', 'delete'),
  ('genres.read', 'genres', 'read'),
  ('genres.write', 'genres', 'write'),
  ('genres.delete', 'genres', 'delete'),
  ('addresses.read', 'addresses', 'read'),
  ('addresses.write', 'addresses', 'write'),
  ('addresses.delete', 'addresses', 'delete')
ON DUPLICATE KEY UPDATE
  `resource` = VALUES(`resource`),
  `action` = VALUES(`action`);
