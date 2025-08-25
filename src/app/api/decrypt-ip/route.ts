import { NextRequest } from 'next/server';
import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { decryptIp } from '@/lib/crypto';

const schema = z.object({
  encryptedIp: z.string(),
});

export async function POST(request: NextRequest) {
  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  if (!auth || !auth.user) {
    return unauthorized();
  }

  const { encryptedIp } = body;

  // Only allow IP decryption if user has admin permissions or if explicitly enabled
  if (!process.env.ALLOW_IP_DECRYPT && !auth.user.isAdmin) {
    return unauthorized('IP decryption not allowed');
  }

  try {
    const decryptedIp = decryptIp(encryptedIp);

    if (!decryptedIp) {
      return badRequest('Failed to decrypt IP address');
    }

    return json({ ip: decryptedIp });
  } catch (error) {
    console.error('Error decrypting IP:', error);
    return badRequest('Invalid encrypted IP');
  }
}
