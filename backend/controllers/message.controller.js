



//!server side events (sse) for real time chat
const connections = {}

//!controller function for sse endpoints

export const sseController =  (req, res) => {
    const {userId} = req.params
    console.log("New Client Connected", userId)

    //! set sse headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    //! add the client's response to the connection object 
    connections[userId] = res

    /*
    connections[userId] = "Hello";  // key: "abc123", value: "Hello"
    connections["userId"] = "Hi";   // key: "userId", value: "Hi"

    */

    //! send an initial event to the client                                     
    res.write('log: Connected to SSE stream\n\n')

    //! handle client disconnection
    req.on('close', ()=>{
        //! remove client's response from the connection array
        delete connections[userId]
        console.log("Client disconnected")
    })
}