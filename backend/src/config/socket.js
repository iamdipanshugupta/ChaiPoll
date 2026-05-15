let io

const initSocket = (serverIO)=>{
    io = serverIO
}

const getIO = ()=>{
    if(!io){
        throw new Error("Socket.io not initialized")
    }
    return io
}

export {initSocket, getIO}