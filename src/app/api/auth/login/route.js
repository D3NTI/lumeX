import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { emailOrUsername, password } = await request.json();

    if (!emailOrUsername || !password) {
      return Response.json(
        { error: 'Email/Username и пароль обязательны' },
        { status: 400 }
      );
    }

    // Ищем пользователя по email или username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return Response.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Создаем ответ без пароля
    const { password: _, ...userWithoutPassword } = user;

    return Response.json({
      message: 'Успешный вход',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    return Response.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
