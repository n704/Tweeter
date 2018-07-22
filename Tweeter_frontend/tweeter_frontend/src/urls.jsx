const URL = {
  "messages": "http://localhost:8000/tweeter/v1/messages/",
  "threads": (thread_id) =>  `http://localhost:8000/tweeter/v1/thread/${thread_id}`,
}

export default URL;
