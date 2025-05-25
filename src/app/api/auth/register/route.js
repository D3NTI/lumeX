import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, username, password } = await request.json();

    // Валидация входных данных
    if (!email || !username || !password) {
      return Response.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      return Response.json(
        { error: 'Пользователь с таким email или username уже существует' },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Создаем ответ без пароля
    const { password: _, ...userWithoutPassword } = user;

    return Response.json({
      message: 'Пользователь успешно зарегистрирован',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return Response.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
