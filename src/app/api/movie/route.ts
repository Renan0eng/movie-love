import prisma from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Tipagem para o payload do JWT
interface JwtPayload {
  id: string;
}

export const POST = async (req: NextRequest) => {
  // Obter o JWT do cabeçalho do cookie token
  let token = req.cookies.get("token")?.value;

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
        name: "My List",
        users: {
          connect: {
            id: userId,
          },
        },
        masterId: userId,
      },
    });
  }

  // Cria um novo item na lista associada ao usuário autenticado
  const { name } = await req.json();
  const ret = await prisma.listItem.create({
    data: {
      name: name as string,
      listId: lista.id, // Usa o id da lista existente ou recém-criada
    },
  });

  // Envia o token JWT no cabeçalho 'Set-Cookie'
  const response = NextResponse.json({ name: ret.name });
  response.cookies.set("token", token, {
    httpOnly: true, // Proteger contra ataques XSS
    // maxAge: 60 * 60, // O token expira em 1 hora
    path: "/", // O cookie é válido para todo o site
  });

  return response;
};

// Função para criar um novo usuário fictício
const criarNovoUsuario = async (): Promise<string> => {
  const newUser = await prisma.user.create({
    data: {
      name: "New User", // Pode personalizar este valor
    },
  });
  return newUser.id; // Retorna o ID do novo usuário
};

export const GET = async (req: NextRequest) => {
  // Obter o JWT do cabeçalho do cookie token
  let token = req.cookies.get("token")?.value;

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
        name: "My List",
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

  // Envia o token JWT no cabeçalho 'Set-Cookie'
  const response = NextResponse.json(ret);
  response.cookies.set("token", token, {
    httpOnly: true, // Proteger contra ataques XSS
    path: "/", // O cookie é válido para todo o site
  });

  return response;
};
