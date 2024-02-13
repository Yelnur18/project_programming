const login = document.querySelector(".login-window");
const toast = document.querySelector(".toast");
let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");
let userInvalidAlert = document.querySelector(".invalid-feedback.username");
let passInvalidAlert = document.querySelector(".invalid-feedback.password");
[passwordInput,usernameInput].forEach(x=>{x.addEventListener("input",(event)=>{
    event.target.classList = "form-control";
})
})

login.addEventListener("submit",async function(event){
    event.preventDefault();
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    try{
        let response = await fetch("http://localhost:3000/login/",{
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        let data = await response.json();
        switch (response.status) {
            case 400:
                document.querySelector(".me-auto").textContent = "Error";
                document.querySelector(".toast-body").textContent = data.split(" ").splice(0,2).join(" ");
                toast.classList.toggle("show");
                passInvalidAlert.textContent = data;
                passwordInput.classList.add("is-invalid");
                passwordInput.value = "";
                setTimeout(()=>{
                    toast.classList.toggle("show");
                },3000)
                break;
            case 200:
                console.log(data)
                document.querySelector(".me-auto").textContent = "Success";
                document.querySelector(".toast-body").textContent = "Authorized successfully";
                toast.classList.toggle("show");
                setTimeout(async ()=>{
                    toast.classList.toggle("show");
                    localStorage.setItem("authorization",data.authorization)
                    window.location.href = "/app.html";
                    console.log(data.authorization)
                },3000);
                break;
            case 404:
                userInvalidAlert.textContent = data;
                usernameInput.classList.add("is-invalid");
                usernameInput.value = "";
            default:
                break;
        }
    }catch(error){
        console.log(error);
    }
})












// const login = document.querySelector(".login-window");
// const toast = document.querySelector(".toast");
// let usernameInput = document.querySelector("#username");
// let passwordInput = document.querySelector("#password");
// let userInvalidAlert = document.querySelector(".invalid-feedback.username");
// let passInvalidAlert = document.querySelector(".invalid-feedback.password");
// [passwordInput,usernameInput].forEach(x=>{x.addEventListener("input",(event)=>{
//     event.target.classList = "form-control";
// })
// })

// login.addEventListener("submit",async function(event){
//     event.preventDefault();
//     let username = document.querySelector("#username").value;
//     let password = document.querySelector("#password").value;
//     try{
//         let response = await fetch("http://localhost:3000/login/",{
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 username: username,
//                 password: password
//             })
//         })
//         let data = await response.json();
//         switch (response.status) {
//             case 400:
//                 document.querySelector(".me-auto").textContent = "Error";
//                 document.querySelector(".toast-body").textContent = data.split(" ").splice(0,2).join(" ");
//                 toast.classList.toggle("show");
//                 passInvalidAlert.textContent = data;
//                 passwordInput.classList.add("is-invalid");
//                 passwordInput.value = "";
//                 setTimeout(()=>{
//                     toast.classList.toggle("show");
//                 },3000)
//                 break;
//             case 200:
//                 document.querySelector(".me-auto").textContent = "Success";
//                 document.querySelector(".toast-body").textContent = data.split(" ").splice(0,2).join(" ");
//                 toast.classList.toggle("show");
//                 setTimeout(async ()=>{
//                     toast.classList.toggle("show");
//                     let response1 = await fetch("http://localhost:3000/",{
//                         method: "GET",
//                         headers:{
//                             "authorization": `Bearer ${data.split(" ").splice(2,2)[0]}`
//                         }
//                     })
//                     let dataData = await response1.json();                    
//                     console.log(response1)
//                     localStorage.setItem("authorization",dataData.authorization)
//                     window.location.href = "/app.html";
//                     console.log(dataData.authorization)
//                 },3000);
//                 break;
//             case 404:
//                 userInvalidAlert.textContent = data;
//                 usernameInput.classList.add("is-invalid");
//                 usernameInput.value = "";
//             default:
//                 break;
//         }
//     }catch(error){
//         console.log(error);
//     }
// })
