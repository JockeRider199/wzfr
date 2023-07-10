import { PrismaClient } from "../../node_modules/.prisma/client";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.PRODUCTION == "TRUE" || process.env.CONTAINER == "TRUE"
          ? process.env.PROD_DATABASE_URL
          : process.env.DATABASE_URL,
    },
  },
});

export async function init() {
  await prisma.$connect().then(() => {
    console.log("Connected to database");
  });
}

export async function ensureGuildCreated(guildId: string) {
  const found = await prisma.guild.findFirst({
    where: { id: guildId },
    select: { id: true },
  });

  if (!found) {
    await prisma.guild.create({
      data: {
        id: guildId,
      },
    });
  }
}

export async function isTicket(guildId: string, channelId: string) {
  await ensureGuildCreated(guildId);

  const found = await prisma.ticket.findFirst({
    where: {
      guildId,
      channelId
    }
  });

  return found ? true : false;
}
export async function createTicketConfig(guildId: string, modRoleId: string, categoryId: string) {
  await ensureGuildCreated(guildId);

  await prisma.ticketConfig.upsert({
    where: {
      guildId
    },
    update: {
      modRoleId,
      categoryId
    },
    create: {
      guildId,
      modRoleId,
      categoryId
    }
  });
}

export async function removeTicket(channelId: string) {
  await prisma.ticket.delete({
    where: {
      channelId
    }
  });
}

export async function createTicket(guildId: string, channelId: string, ownerId: string) {
  await ensureGuildCreated(guildId);

  const config = await prisma.ticketConfig.findFirst({
		where: {
			guildId,
		},
	});

  await prisma.ticket.create({
    data: {
      ownerId,
      channelId,
      opened: true,
      guildId,
      configId: config!.modelId
    }  
  })
}
export async function isAlreadyInTicket(guildId: string, ownerId: string) {
  await ensureGuildCreated(guildId);

  let found = await prisma.ticket.findFirst({
      where: {
      guildId,
      ownerId
    }
  });

  return found ? true : false;
}

export async function closeTicket(channelId: string) {
  await prisma.ticket.update({
    where: {
      channelId 
    },
    data: {
      opened: false
    }
  })
}
export async function openTicket(channelId: string) {
  const update = await prisma.ticket.update({
    where: {
      channelId
    },
    data: {
      opened: true 
    }
  });

  return update.ownerId;
}
export async function getTicketModRoleId(guildId: string) {
  await ensureGuildCreated(guildId);

  const search = await prisma.ticketConfig.findUnique({
    where: {
      guildId
    },
    select: {
      modRoleId: true
    }
  });

  return search!.modRoleId;
}
export async function getTicketCategory(guildId: string) {
  await ensureGuildCreated(guildId);

  const search = await prisma.ticketConfig.findUnique({
    where: {
      guildId
    },
    select: {
      categoryId: true
    }
  });

  return search!.categoryId;
}

export async function increaseTicketCount(guildId: string) {
	await ensureGuildCreated(guildId);

	const config = await prisma.ticketConfig.update({
		where: {
			guildId: guildId,
		},
		data: {
			count: {
				increment: 1,
			},
		},
	});

	return formatTicketNumber(config.count);
}

function formatTicketNumber(number: number) {
	let out = number.toString();
	while (out.length < 4) {
		out = "0" + out;
	}

	return out;
}
