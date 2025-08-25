-- AddEncryptedIp
ALTER TABLE `session` ADD COLUMN `encrypted_ip` VARCHAR(255) NULL AFTER `city`;
