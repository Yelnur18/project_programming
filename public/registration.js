const toast = document.querySelector(".toast");
let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");
let userInvalidAlert = document.querySelector(".invalid-feedback.username");
let passInvalidAlert = document.querySelector(".invalid-feedback.password");
[passwordInput,usernameInput].forEach(x=>{x.addEventListener("input",(event)=>{
    event.target.classList = "form-control";
})
})

document.querySelector(".registration-window").addEventListener("submit",async function(event){
    event.preventDefault();
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if(password==document.querySelector("#repetition").value){
        try{
            let response = await fetch("http://localhost:3000/registration/",{
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
                case 404:
                    userInvalidAlert.textContent = data;
                    usernameInput.classList.add("is-invalid");
                    break;
                case 400:
                    document.querySelector(".me-auto").textContent = "Error";
                    document.querySelector(".toast-body").textContent = data[0].msg;
                    console.log(data)
                    toast.classList.toggle("show");
                    passInvalidAlert.textContent = data[0].msg;
                    passwordInput.classList.add("is-invalid");
                    passwordInput.value = "";
                    setTimeout(()=>{
                        toast.classList.toggle("show");
                    },3000)
                    break;
                case 200:
                    userInvalidAlert.textContent = data;
                    usernameInput.classList.add("is-invalid");
                    break;
                case 201:
                    document.querySelector(".me-auto").textContent = "Success";
                    document.querySelector(".toast-body").textContent = data.split(" ").splice(0,3).join(" ");
                    toast.classList.toggle("show");
                    setTimeout(()=>{
                        toast.classList.toggle("show");
                        window.location.href = "/login"
                    },1500);
                default:
                    break;
            }
        }catch(error){
            console.log(error);
        }
    }else{
        document.querySelector(".me-auto").textContent = "Error";
        document.querySelector(".toast-body").textContent = "Password doesn`t match with confirmation!"
        toast.classList.toggle("show");
        setTimeout(()=>toast.classList.toggle("show"),3000);
    } 
})














// registration.addEventListener("submit",async function(event){
//     event.preventDefault();
//     let username = document.querySelector("#username").value;
//     let password = document.querySelector("#password").value;
//     if(password==document.querySelector("#repetition").value){
//         let response = await fetch("http://localhost:3000/registration/",{
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 username: username,
//                  password: password
//             })
//          })
//         let data = await response.json();
//         console.log(data)
        
//     }else{
        
//     } 
// })