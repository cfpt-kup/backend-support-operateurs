LOGIN : 

It works but I have 2 issues : 

- If the token is the same I can add it to the array creating replications. Can we fix that ?

- In the http response we return the user __v, _id and password and that's an issue for clarity and security

LOGOUT : 

Prompt -> I also want to include the disconnect feature to clear the credentials when triggered (delete the JWT assiciated to the user). The JWT token has a lifetime and I would like to clear the database of the expired JWT token when disconnected to make some clean up.