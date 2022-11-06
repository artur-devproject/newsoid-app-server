## Newsoid APP (server)

### 'NEWSOID' - news aggregator

**API functions:**
- executes periodic requests (scheduled in time) to various sources to download news publications in RSS-format;
- converts the received xml data into an array of publications in the format of json objects and stores them in a document-oriented database;
- at the request of the client, gives a portion of fresh posts, with an additional request, gives the next portion of posts, older by the date of publication, etc.

**API tech stack:** NodeJS / ExpressJS / MongoDB