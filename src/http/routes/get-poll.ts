import {z} from "zod";
import {prisma} from "../../lib/prisma";
import {FastifyInstance} from "fastify";

export async function getPoll(app: FastifyInstance) {
    app.get('/polls/:pollId', async (request, reply) => {
        const createPollBody = z.object({
            pollId: z.string().uuid(),
        });

        // Parse the request body to ensure it has the correct structure.
        const parsedParams = createPollBody.parse(request.params);

        try {
            // Use Prisma client to create a new poll with associated options.
            const poll = await prisma.poll.findUnique({
                where: {
                    id: parsedParams.pollId,
                },
                include: {
                    options: {
                        select: {
                            id: true,
                            title: true,
                        },
                    }
                },
            });

            // If successful, send back the created poll's ID with a 201 status code.
            return reply.status(200).send({pollId: poll?.id, title: poll?.title, options: poll?.options});
        } catch (error) {
            // If there's an error, send back a 500 internal server error.
            console.error("Failed to create poll:", error);
            return reply.status(500).send("Failed to create poll");
        }
    });
}
