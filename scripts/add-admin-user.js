require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

/**
 * Script to add a new admin user to Umami
 * Usage: node scripts/add-admin-user.js <username> <password> [email] [displayName]
 */

async function addAdminUser(username, password, email = null, displayName = null) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.log(`❌ User '${username}' already exists!`);
      return;
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        username: username,
        password: hashedPassword,
        role: 'admin', // Set as admin
        displayName: displayName || username,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Username: ${newUser.username}`);
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Role: ${newUser.role}`);
    console.log(`   Display Name: ${newUser.displayName}`);
    console.log(`   Created: ${newUser.createdAt}`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        displayName: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('\n📋 Current Users:');
    console.log('=================');
    users.forEach(user => {
      console.log(`• ${user.username} (${user.role}) - ${user.displayName || 'No display name'}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteUser(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      console.log(`❌ User '${username}' not found!`);
      return;
    }

    await prisma.user.delete({
      where: { username }
    });

    console.log(`✅ User '${username}' deleted successfully!`);

  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Umami Admin User Management');
    console.log('===========================');
    console.log('');
    console.log('Commands:');
    console.log('  add <username> <password> [displayName]  - Add new admin user');
    console.log('  delete <username>                        - Delete user');
    console.log('  list                                     - List all users');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/add-admin-user.js add admin password123 "Admin User"');
    console.log('  node scripts/add-admin-user.js delete admin');
    console.log('  node scripts/add-admin-user.js list');
    return;
  }

  const command = args[0];

  switch (command) {
    case 'add':
      if (args.length < 3) {
        console.log('❌ Usage: add <username> <password> [displayName]');
        return;
      }
      await addAdminUser(args[1], args[2], null, args[3]);
      break;

    case 'delete':
      if (args.length < 2) {
        console.log('❌ Usage: delete <username>');
        return;
      }
      await deleteUser(args[1]);
      break;

    case 'list':
      await listUsers();
      break;

    default:
      console.log(`❌ Unknown command: ${command}`);
      console.log('Available commands: add, delete, list');
  }
}

main().catch(console.error);
