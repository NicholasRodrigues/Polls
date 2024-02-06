import {z} from "zod";
import {randomUUID} from "node:crypto";
import {prisma} from "../../lib/prisma";
import {FastifyInstance} from "fastify";

export async function voteOnPoll(app: FastifyInstance) {
    app.post('/polls/:pollId/votes', async (request, reply) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
        });

        const voteOnPollParams = z.object({
            pollId: z.string().uuid(),
        });

        // Parse the request body to ensure it has the correct structure.
        const {pollId} = voteOnPollParams.parse(request.params);
        const {pollOptionId} = voteOnPollBody.parse(request.body);

        let sessionId = request.cookies.sessionId;

        if (sessionId) {
            const userPreviousVoteOnPoll = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        sessionId,
                        pollId,
                    },
                },
            });

            if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {


                await prisma.vote.delete({
                    where: {
                        id: userPreviousVoteOnPoll.id,
                    },
                })
            } else if (userPreviousVoteOnPoll){
                return reply.status(400).send("User has already voted for this option");
            }
        }

        if (!sessionId) {
            sessionId = randomUUID();
            reply.setCookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 30,
                signed: true,
                httpOnly: true,
            });
        }

        await prisma.vote.create({
            data: {
                sessionId,
                pollId,
                pollOptionId,

            },
        });

        return reply.status(201).send();
    })
}