import { NextRequest } from 'next/server';
import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { decryptIp } from '@/lib/crypto';

const schema = z.object({
  encryptedIp: z.string(),
});

export async function POST(request: NextRequest) {
  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { encryptedIp } = body;

  // Allow IP decryption for all users when enabled
  if (process.env.ALLOW_IP_DECRYPT !== 'true') {
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
