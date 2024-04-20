class MessageController{
    static chat = async (req,res)=>{
        res.render('chat', { title: "Chat con socket y mongo"});
    }
}

export {MessageController}