import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createPoll(app: FastifyInstance) {
    app.post('/polls', async (request, reply) => {
        const createPollBody = z.object({
            title: z.string(),
            options: z.array(z.string()),
        });

        // Parse the request body to ensure it has the correct structure.
        const parsedBody = createPollBody.parse(request.body);

        try {
            // Use Prisma client to create a new poll with associated options.
            const poll = await prisma.poll.create({
                data: {
                    title: parsedBody.title,
                    options: {
                        create: parsedBody.options.map(optionTitle => ({
                            title: optionTitle,
                        })),
                    },
                },
            });

            // If successful, send back the created poll's ID with a 201 status code.
            return reply.status(201).send({ pollId: poll.id });
        } catch (error) {
            // If there's an error, send back a 500 internal server error.
            console.error("Failed to create poll:", error);
            return reply.status(500).send("Failed to create poll");
        }
    });
}
