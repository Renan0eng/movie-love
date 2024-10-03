import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// user

import jwt from "jsonwebtoken";
import prisma from "./db";
import { ListItemTypeWithRating } from "@/sections/list/list-view";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface JwtPayload {
  id: string;
}

export const getLista = async (
  token: string
): Promise<ListItemTypeWithRating[]> => {
  let userId: string | null = null;

  if (!token) {
    // Se não houver token, cria um novo usuário e gera um novo JWT
    userId = await criarNovoUsuario();

    token = jwt.sign(
      { id: userId }, // Payload do JWT
      process.env.JWT_SECRET as string // Chave secreta usada para assinar o token
      // { expiresIn: "1h" } // O token expira em 1 hora
    );
  } else {
    try {
      // Verifica se o token é válido
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      userId = decoded.id;
    } catch (err) {
      // Se o token for inválido, cria um novo
      userId = await criarNovoUsuario();

      token = jwt.sign(
        { id: userId }, // Payload
        process.env.JWT_SECRET as string // Chave secreta
        // { expiresIn: "1h" } // Expiração de 1 hora
      );
    }
  }

  // Verifica se o usuário já possui uma lista (verifica se o userId está na lista)
  let lista = await prisma.list.findFirst({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });

  // Se o usuário não tiver uma lista, cria uma nova e associa ao usuário
  if (!lista) {
    lista = await prisma.list.create({
      data: {
        users: {
          connect: {
            id: userId, // Conecta o usuário à nova lista
          },
        },
        masterId: userId,
      },
    });
  }

  // Busca os itens da lista com base no ID da lista
  const ret = await prisma.listItem.findMany({
    where: {
      list: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      rating: {
        include: {
          user: true,
        },
      },
    },
  });

  return ret;
};

export const criarNovoUsuario = async (): Promise<string> => {
  const newUser = await prisma.user.create({
    data: {
      name: "New User", // Pode personalizar este valor
    },
  });
  return newUser.id; // Retorna o ID do novo usuário
};

export const validarToken = async (
  token: string | null | undefined
): Promise<{
  userId: string;
  token: string;
}> => {
  let userId: string | null = null;

  console.log("token:", token);

  if (!token) {
    // Se não houver token, cria um novo usuário e gera um novo JWT
    userId = await criarNovoUsuario();

    token = jwt.sign(
      { id: userId }, // Payload do JWT
      process.env.JWT_SECRET as string // Chave secreta usada para assinar o token
      // { expiresIn: "1h" } // O token expira em 1 hora
    );
  } else {
    try {
      // Verifica se o token é válido
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      userId = decoded.id;
    } catch (err) {
      // Se o token for inválido, cria um novo
      userId = await criarNovoUsuario();

      token = jwt.sign(
        { id: userId }, // Payload
        process.env.JWT_SECRET as string // Chave secreta
        // { expiresIn: "1h" } // Expiração de 1 hora
      );
    }
  }

  return { userId, token };
};
