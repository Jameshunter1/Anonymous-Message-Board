# Anonymous Message Board

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose_8-880000?style=flat-square)
![Mocha](https://img.shields.io/badge/Tested_with-Mocha_%2B_Chai-8D6748?style=flat-square&logo=mocha&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

A forum-style anonymous message board — boards, threads, and replies with password-protected deletion and content reporting. Built for the [freeCodeCamp Information Security certification](https://www.freecodecamp.org/learn/information-security/), endpoint by endpoint, with functional tests written alongside each feature.

> **Status: in active development.** Thread creation is implemented and tested; the remaining endpoints and the Helmet security hardening are being built out next. The roadmap below tracks exactly what's done and what's pending.

---

## How It Works

Anyone can post anonymously to any board — boards are created implicitly the first time someone posts to them. Every thread and reply carries a `delete_password` chosen at creation, which is later required to delete it. Any visitor can flag content as reported.

| Page | Route | Purpose |
| --- | --- | --- |
| Home | `/` | Landing page |
| Board | `/b/:board/` | All threads on a board |
| Thread | `/b/:board/:threadid` | A single thread with all replies |

---

## API Reference

Base path: `/api`. Boards are addressed by name in the URL; threads and replies by ID in the request body.

### Threads — `/api/threads/:board`

| Method | Body | Behavior | Status |
| --- | --- | --- | --- |
| `POST` | `text`, `delete_password` | Create a thread, then redirect to `/b/:board` | ✅ Implemented |
| `GET` | — | 10 most recently bumped threads with their 3 most recent replies; `reported` and `delete_password` excluded | 🔜 Planned |
| `DELETE` | `thread_id`, `delete_password` | Delete a thread — returns `success` or `incorrect password` | 🔜 Planned |
| `PUT` | `thread_id` | Mark a thread reported — returns `reported` | 🔜 Planned |

### Replies — `/api/replies/:board`

| Method | Body / Query | Behavior | Status |
| --- | --- | --- | --- |
| `POST` | `thread_id`, `text`, `delete_password` | Add a reply, bump the thread's `bumped_on`, redirect to `/b/:board/:thread_id` | 🔜 Planned |
| `GET` | `?thread_id=` | Full thread with every reply; sensitive fields excluded | 🔜 Planned |
| `DELETE` | `thread_id`, `reply_id`, `delete_password` | Replace the reply's text with `[deleted]` — returns `success` or `incorrect password` | 🔜 Planned |
| `PUT` | `thread_id`, `reply_id` | Mark a reply reported — returns `reported` | 🔜 Planned |

**Example — create a thread:**

```bash
curl -X POST http://localhost:3000/api/threads/general \
  -d "text=Hello board" \
  -d "delete_password=hunter2"
# → 302 redirect to /b/general
```

---

## Data Model

Threads are stored in MongoDB via Mongoose, with replies embedded as subdocuments:

```js
Thread {
  board:           String,
  text:            String,
  created_on:      Date,      // defaults to now
  bumped_on:       Date,      // defaults to now; updated on new replies
  reported:        Boolean,   // defaults to false
  delete_password: String,
  replies: [{
    text:            String,
    created_on:      Date,
    delete_password: String,
    reported:        Boolean
  }]
}
```

---

## Getting Started

**Prerequisites:** Node.js 18+, npm, and a MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas)).

```bash
# 1. Clone and install
git clone https://github.com/Jameshunter1/Anonymous-Message-Board.git
cd Anonymous-Message-Board
npm install

# 2. Configure environment
#    Create a .env file in the project root:
#    MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
#    PORT=3000            # optional, defaults to 3000

# 3. Run
npm start
# → Your app is listening on port 3000
```

Open `http://localhost:3000` and post to any board, e.g. `/b/general/`.

---

## Testing

Functional tests live in `tests/2_functional-tests.js` and use Mocha, Chai, and chai-http. The suite runs automatically on startup when `NODE_ENV` is set to `test`:

```bash
NODE_ENV=test npm start
```

Current coverage: thread creation (asserts the 302 redirect to the board page). Tests are added with each endpoint as the API grows.

---

## Security Roadmap

Hardening planned as part of the Information Security curriculum, on top of the CORS-open configuration required by the freeCodeCamp test harness:

* **Helmet middleware** — allow framing only by this site (`frameguard: sameorigin`), disable client-side DNS prefetching, and send the `Referrer` header for own pages only (`referrerPolicy: same-origin`).
* **Response filtering** — strip `reported` and `delete_password` from every API response.
* **Password handling** — hash `delete_password` before storage instead of keeping it in plaintext.

---

## Project Structure

```
.
├── public/            # Static assets (served at /public)
├── routes/
│   └── api.js         # API routes, Mongoose connection, Thread model
├── tests/
│   └── 2_functional-tests.js
├── views/             # index.html, board.html, thread.html
├── server.js          # Express app, view routes, test-runner hook
├── test-runner.js
└── package.json
```

---

## License

MIT — based on the freeCodeCamp [Anonymous Message Board boilerplate](https://www.freecodecamp.org/learn/information-security/).
