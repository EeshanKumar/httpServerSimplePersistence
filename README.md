# httpServerSimplePersistence
HTTP Server With Simple Persistence

Make sure you add a 'data' folder to your root folder to store your database
or 
set 'process.env.DATAFOLDER' to where you want your data to be stored.
Same is true for test cases (default folder is './test/data')

See credit inline

ps: Data storage is setup to mimic mongoose, but with save new data, I had trouble
following their setup to use the Dog constructor function appropriately. 
So Dog isn't really acting as a constructor function. It's something to fix later on. 