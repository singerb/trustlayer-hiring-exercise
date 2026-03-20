# Event Feedback Coding Exercise

## Setup and run

Backend:
- `cd backend/`
- `yarn install`
- `yarn migrate`
- `yarn seed`
- `yarn start`

Frontend:
- `cd frontend/`
- `yarn install`
- `yarn run dev`

The app will be available at http://localhost:5174

## Testing/utility scripts

These are all in `backend/`.

- `yarn create-event`
    - Can take an optional `--name` argument, otherwise will generate a random name.
    - Adds a new event to the database.
- `yarn drip-feedback`
    - Can take an option `--event-id` argument; get these from the URL on the frontend; if none given, will pick a new event for every submission.
    - Drips feedback in at a rate of 1 new feedback every 1-5 seconds, with random data.
    - Use for testing the live update functionality on the frontend.
- To reset the database, just delete the `dev.sqlite3` file in the backend, re-run the migration, restart the server, and re-run the seeds if desired.

## Technology choices and reasoning

Backend:
GraphQL, as requested, via Apollo as the seeming standard in the space. Initially done via HTTP with the built-in server, but real-time updates needed websockets, and thus the servers were split apart. Database is SQLite for ease of use/setup, while maintaining persistence. Knex is used as an ORM as well as a schema/migration/seed layer, mostly because I knew it and it works nicely in my experience. TSX and nodemon get the dev server running and restarting on changes nicely. GraphQL codegen handles type information for the schemas, following the docs.

Frontend:
React and GraphQL (Apollo again), as requested. I added React Router (in framework mode and without any SSR) for basic page routing. Redux or similar was not needed at this scale, especially with the caching behavior built in to Apollo. Tailwind for styling, of course, Lucide icons, and a few ShadCN components for ease (cards, mostly). As with the backend, GraphQL codegen handles type information for the schemas, making the querying return nicely typed data for React.

## AI usage

This was developed with heavy Claude Code usage; the commits roughly mirror the rounds of prompting and iteration. Now that it's more fleshed out I'm adding a CLAUDE.md file as well.

## Things to clean up in the future that were cut for scope/time

**Update 3/19/26:** I'm going through this, turning it into a checklist, and prioritizing it. I'll pick off items here as I can.

**Update 3/20/26:** I've picked off a bunch of the higher priority ones, but I'm adding some more to tackle, some high priority; mostly around backend performance and ease of testing.

In order, highest to lowest:

- [x] Add prettier and run it. This makes me twitch a bit right now honestly, but it's not a functional issue.
- [x] No way to add events right now outside of the seeds or raw DB access. This is fine for the current case; you can see two different events and add feedback to each one. Adding a new mutation for this and either a script or some new UI wouldn't be hard.
- [x] Pagination on the feedback list doesn't persist in the URL params. This is annoying (refresh the page and lose your place in the pagination) but straightforward to fix by updating the location (correctly, with history; React Router helps here IIRC) when you update the pagination variables.
- [x] Page titles aren't set per routed page right now; also easy to fix with a standard pattern.
- [x] Add appropriate index to the feedback table.
- [x] Redo the add event script in TS, and use a GraphQL client for it, in preparation for more complex test scripts.
- [x] Add a script to dribble in responses for testing the live update more easily than having two tabs open; random interval between responses (say 1-10sec), random data generation. Will need to load the event IDs in.
- [ ] Add a script for load testing; should spin up multiple (configurable) worker threads and hammer the DB. Printing response time stats would be great too.
- [ ] Compute the average rating and count at feedback submission time, rather than retrieval; store in the DB. Compute synchronously for now.
- [ ] Move the computed fields to be re-done asynchronously, de-bounced. Ideally in-process, whether that's a worker thread to get it off the main event loop, or just a timeout.
- [ ] Some type issues in the backend; knex does a decent job but sometimes need help, and pubsub may need some help too.
- [x] Breaking the API code out of the components; this is a bit too much intermixing of API logic and component/display right now.
- [ ] Add a page showing all feedback responses for all events; live updates on this one, but do infinite scroll instead of pagination, for fun.
- [x] Non-default error boundary, better error handling from queries. Errors are just rendered right now, either with a stack trace (top-level) or just a message (API errors). Fine for development, but would need fixing for production.
- [x] Loading component with spinner for all those pages with a loading state. Moving some of the loading logic into client loaders in React Router and then adding a top-level loading state can help here too.
- [ ] Split the schemas up; having the backend and frontend schema bits in the same file makes it easy to read and understand, but is a bit weird from a GraphQL standpoint. The frontend queries could be moved elsewhere and codegen'ed from there.
- [ ] No pagination on the events list. Again, fine with the current limited events, and easy to add.
- [x] More components factored out; the event view in particular is right at the edge of being too big.
- [ ] Better design for larger screens; it's mobile first and only right now, and looks fine on larger screens. More could be done with a multi-column layout when the width is available though, or a sidebar with the events list, etc.
- [ ] Clickable star rating input in the submission form with nice hover state (you know the kind).
- [ ] Mobile usability pass (touch targets?).
- [ ] Accessibility pass.
- [ ] Anything in the codebase under `TODO` (just search for it).
- [ ] Form framework (Tanstack Form or similar) once the form gets more complex.
- [ ] No tests anywhere, but IMO this is less urgent; the backend has minimal logic to test right now, and the UI tests can be tricky and often brittle.
