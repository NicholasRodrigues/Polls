import fastify from 'fastify';
import cookie from '@fastify/cookie';
import {createPoll} from './routes/create-poll';
import {getPoll} from "./routes/get-poll";
import {voteOnPoll} from "./routes/vote-on-poll";


const app = fastify();

app.register(cookie, {
    secret: "polls-app",
    hook: "onRequest",
    parseOptions: {}
});

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);


app.listen({port: 3000}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});