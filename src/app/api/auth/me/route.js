import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      );

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return Response.json(
          { error: 'Пользователь не найден' },
          { status: 404 }
        );
      }

      return Response.json({ user });
    } catch (jwtError) {
      return Response.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    return Response.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
