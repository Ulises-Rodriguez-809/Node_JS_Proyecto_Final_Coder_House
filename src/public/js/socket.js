const socket = io();

const userBox = document.getElementById("userBox");
const chatBox = document.getElementById("chatBox");
const chatBtn = document.getElementById("chatBtn");
const logs = document.getElementById("messageLogs");

chatBox.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        if (userBox.value.trim().length > 0 && chatBox.value.trim().length > 0) {

            socket.emit("message", {
                user: userBox.value,
                message: chatBox.value
            })

            chatBox.value = "";
        }
    }
})

chatBtn.addEventListener("click", () => {
    if (userBox.value.trim().length > 0 && chatBox.value.trim().length > 0) {
        socket.emit("message", {
            user: userBox.value,
            message: chatBox.value
        })

        chatBox.value = "";
    }

})

socket.on("nuevo-usuario", data => console.log(data));

socket.on("cargar-mensajes",data=>{
    const fragment = document.createDocumentFragment();
    
    data.forEach(msg => {
        const newLi = document.createElement("li");
        newLi.innerText = `${msg.user} dice : ${msg.message}`;
        
        fragment.appendChild(newLi);
    });
    
    logs.appendChild(fragment);
})

socket.on("mensajes-actualizados",data=>{
    const newLi = document.createElement("li");
    newLi.innerText = `${data.user} dice : ${data.message}`;
    
    logs.appendChild(newLi);
})