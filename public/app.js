// let init = async () =>{
//     let response = await fetch("/main",{
//      method: "GET",
//      headers: {
//          "authorization": `Bearer ${localStorage.getItem("authorization")}`
//      }    
//     });  
//     console.log(response)
//     if(response.ok){
//     let data = await response.json()
//     document.querySelector(".add").innerHTML = `What is upp ${data.info.username} `
//     document.querySelector(".in").style.display = "none";
//     }else{
//         document.querySelector(".out").style.display = "none";
//     }
// } 
// init()

let init = async () =>{
    let response = await fetch("/main",{
     method: "GET",
     headers: {
         "authorization": `Bearer ${localStorage.getItem("authorization")}`
     }    
    }); 
    let data = await response.json();
    return [response,data];
} 
init().then(data=>{
    if(data[0].ok){
    document.querySelector(".add").innerHTML = `What is upp ${data[1].info.username} `
    document.querySelector(".in").style.display = "none";
    localStorage.setItem("info",JSON.stringify(data[1].info))
    console.log(data[1])

    localStorage.setItem("id",data[1].info.tasks.length);
    for(let i = 0;i<data[1].info.tasks.length;i++){
        localStorage.setItem(i,data[1].info.tasks[i].task)
    }

    for(let i = 0;i<Number(localStorage.getItem("id"));i++){
        currentTask = JSON.parse(localStorage.getItem(i));
        console.log(currentTask)
        if(currentTask!=null){
        taskManipul(currentTask.title,currentTask.time,i,currentTask.importance)
        console.log(currentTask)
        console.log(i)
        }
    }

    if(tasks.children.length==0){
        tasks.style.display == "none";
        document.querySelector(".empty").style.display = "block";
    }else{
        tasks.style.display== "flex";
        document.querySelector(".empty").style.display= "none";
    }
 }else{
    document.querySelector(".out").style.display = "none";
 }
})





let addButton = document.querySelector(".add");
let modalWindow = document.querySelector(".modal-add");
let main = document.querySelector(".main");
let descripted = document.querySelector(".modal-description");
let more = document.querySelectorAll(".icon");
let taskAdButton = document.querySelector(".confirm");
let tasks = document.querySelector(".tasks");

let taskId;
function formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString("en-US", options);
}

addButton.addEventListener("click",()=>{
    init().then((data)=>{
        if(data[0].ok){
            modalWindow.style.display="flex";
            main.style.opacity="0.3";
        }else{
            alert("Log in to add tasks!");
        }
    })
})
window.addEventListener("mousedown",(event)=>{
    if((event.target!=modalWindow)&&(event.target!=addButton)&&(!modalWindow.contains(event.target))&&(event.target!=descripted)&&(!event.target.classList.contains("icon"))&&(!descripted.contains(event.target))){
        modalWindow.style.display="none";
        main.style.opacity="1";
        descripted.style.display = "none";
        document.querySelector(".noteWindow").innerHTML = "";
    }
    if(event.target.classList.contains("icon")){
        let chosed = event.target.parentNode.parentNode.parentNode;
    }
})

more.forEach(function(x){
    x.addEventListener("click",()=>{
            descripted.style.display="flex";
            main.style.opacity="0.3";
        })
}) 

function finish(event){
    task = event.parentNode.parentNode.parentNode;
    event.name = "flag"; 
    task.classList.add("disappearing");
        setTimeout(() => {
            toDel(event);
        }, 1100);
            
    }

async function sendData(title,time,importance,date){
    let dbTask = JSON.stringify({
        title: title,
        time:time,
        notes: [],
        importance,
        date
    })

    localStorage.setItem(localStorage.getItem("id"),dbTask)
    localStorage.setItem("id",Number(localStorage.getItem("id"))+1);
    let response = await fetch("/add",{
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            profileName:JSON.parse(localStorage.getItem("info")).username,
            task: dbTask
        })
    }
    )
    let data = await response.json();
    console.log(response,data)
}

function taskManipul(title,time,id,importance){
    newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.classList.add(`${importance=="Priority"?"Medium":importance}`);
    newTask.id = id;
    newTask.innerHTML = `
        <div class="title">
            ${title}
        </div>
        <div class="time">
        ${time}
        </div>
        <div class="more">
            <div><img src="assets/circle-ellipsis.svg" alt="#" class="icon" onclick="getDescr(this)"></div>
            <div><ion-icon name="flag-outline" class="finished" onclick="finish(this)"></ion-icon></div>
        </div>
`
    tasks.appendChild(newTask);
    let more = document.querySelectorAll(".icon");
    more.forEach(function(x){
        x.addEventListener("click",()=>{
                descripted.style.display="flex";
                main.style.opacity="0.3";
            })
    }) 
}
let date = document.querySelector(".dateDay");
date.addEventListener("keydown",(event)=>{
    event.preventDefault();
})
function addTask(){
    let titleName = document.querySelector(".title-modal");
    let dataTime = document.querySelector(".date").value;
    let importance = document.querySelector("#priority").value
    console.log(date.value)
    if(titleName.value!=""){
        taskManipul(titleName.value,`${dataTime} ${((dataTime!="")&&(Number(dataTime.slice(0,2))>=12))?"p.m.":dataTime==""?"":"a.m."}`,localStorage.getItem("id"),importance);
        sendData(titleName.value,
            `${dataTime} ${((dataTime!="")&&(Number(dataTime.slice(0,2))>=12))?"p.m.":dataTime==""?"":"a.m."}`,importance,date.value);
 
        modalWindow.style.display="none";
        main.style.opacity="1";
        document.querySelector(".title-modal").value = "";
        document.querySelector(".date").value = "";
        if(tasks.children.length==0){
            tasks.style.display == "none";
            document.querySelector(".empty").style.display = "block";
        }else{
            tasks.style.display== "flex";
            document.querySelector(".empty").style.display= "none";
        }
    }else{
        modalWindow.classList.add("zoom");
        titleName.classList.add("zoom");
        setTimeout(()=>{
            modalWindow.classList.remove("zoom");
            titleName.classList.remove("zoom");
        },810);
    }
}
async function toDel(event){
    let deleteTask = event.parentNode.parentNode.parentNode;
    tasks.removeChild(deleteTask);
    let response = await fetch("/delete",{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },body: JSON.stringify({
            profileName: JSON.parse(localStorage.getItem("info")).username,
            task: localStorage.getItem(deleteTask.id)
        })
    })
    let data = await response.json()
    if(response.ok){
        console.log(response)
        console.log(data)
    }else{
        console.log(response);
        console.log(data)
    }

    localStorage.removeItem(deleteTask.id);
    localStorage.setItem("id",Number(localStorage.getItem("id"))-1);
    if(tasks.children.length==0){
        tasks.style.display == "none";
        document.querySelector(".empty").style.display = "block";
    }else{
        tasks.style.display== "flex";
        document.querySelector(".empty").style.display= "none";
    }
}



const url = 'http://localhost:3000/find-complexity';

const fetchData = async (value,option) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: value, option: option }),
    });

    if (response.status === 200) {
      let data = await response.text();
      return data;
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error occured:', error);
  }
};

let opened = false;
function getDescr(event){
    opened = false;
    document.querySelector(".splitted-description").innerHTML = "<div class='custom-loader loader'></div>"
    document.querySelector("#multiCollapseExample1").classList.remove("show");
    taskId = event.parentNode.parentNode.parentNode.id;
    document.querySelector(".description").innerText = JSON.parse(localStorage.getItem(taskId)).title;
    let notesObject = JSON.parse(localStorage.getItem(taskId));
    console.log(typeof taskId)
    if(notesObject.notes.length>0){notesObject.notes.forEach(x=>{
        refreshNotes(x[0],x[1]);
    })
    }
    else{
        document.querySelector(".noteWindow").innerHTML = "";
    }

}    


async function split(event){
    if(opened==false){
        let changedObj = JSON.parse(localStorage.getItem(taskId));
        let toSplit = JSON.parse(localStorage.getItem(taskId)).title;
        console.log(toSplit)
        tips = await fetchData(toSplit.trim(),event.textContent);
        localStorage.setItem(taskId,JSON.stringify(changedObj));
        console.log(JSON.parse(localStorage.getItem(taskId)))
        if(event.textContent=="Split"){
        document.querySelector(".splitted-description").innerText = tips;
        }else{
            document.querySelector(".helped-description").innerText = tips;
        }
    }
    opened = opened==false?true:false;
 
} 
async function addNode(event){
    let date = new Date();
    let inputtedNote = event.parentElement;
    console.log(inputtedNote.children[0].value)
    if(inputtedNote.children[0].value.trim()!=""){
        objectNoted = JSON.parse(localStorage.getItem(taskId))
        objectNoted.notes.push([formatDate(date),inputtedNote.children[0].value])
        try{
        let response = await fetch("/change",{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },body:JSON.stringify({
                profileName: JSON.parse(localStorage.getItem("info")).username,
                task: JSON.parse(localStorage.getItem(taskId)),
                updatedTask: objectNoted
            })
        })
        let data = await response.json();
        console.log(data)
    }catch(e){console.log(e)}
        localStorage.setItem(taskId,JSON.stringify(objectNoted));
        refreshNotes(formatDate(date),inputtedNote.children[0].value);
        inputtedNote.children[0].value = "";
    }
}
function refreshNotes(time,note){
    let noteWindow = document.querySelector(".noteWindow");
    let toAdd = `
    <div class="addedNode">
    <div class="nodeText">
        ${note}
    </div>
    <div class="nodeTime">
      ${time}
    </div>
  </div>
    `
    noteWindow.innerHTML+=toAdd;
    console.log([...noteWindow.children].includes(toAdd))
//     if(!noteWindow.childNodes.contains(toAdd)){
//         noteWindow.innerHTML+=toAdd;
//     }
}
async function saveNote(event){
    console.log(event.name)
    let element = event.name=="Split" ? ".splitted-description" : ".helped-description"
    let date = new Date();
    let addNoteTo = JSON.parse(localStorage.getItem(taskId));
    addNoteTo.notes.push([formatDate(date),document.querySelector(element).innerText]);

    try{
        let response = await fetch("/change",{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },body:JSON.stringify({
                profileName: JSON.parse(localStorage.getItem("info")).username,
                task: JSON.parse(localStorage.getItem(taskId)),
                updatedTask: addNoteTo
            })
        })
        let data = await response.json();
        console.log(data)
    }catch(e){console.log(e)}
    localStorage.setItem(taskId,JSON.stringify(addNoteTo));
    refreshNotes(formatDate(date),document.querySelector(element).innerText);
    
}

function logOut(){
    localStorage.clear()
}
function toClose(button){
    button.parentNode.style.display = "none";
    main.style.opacity="1";
    document.querySelector(".noteWindow").innerHTML = "";
}
function openCalendar(){
  document.querySelector(".calendar").style.display = "block";  
}
// bootstrap //
