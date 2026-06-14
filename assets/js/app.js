const cl=console.log;

const commentForm=document.getElementById('commentForm')
const nameControl=document.getElementById('name')
const emailControl=document.getElementById('email')
const bodyControl=document.getElementById('body')
const postIdControl=document.getElementById('postId')
const addBtn=document.getElementById('addBtn')
const updateBtn=document.getElementById('updateBtn')
const commentContainer=document.getElementById('commentContainer')
const spinner=document.getElementById('spinner')

let commentArr=[];

let BASE_URL='https://jsonplaceholder.typicode.com'
let POST_URL=`${BASE_URL}/comments`

function snackBar(msg,i){
    Swal.fire({
        title:msg,
        icon:i,
        timer:3000
    }) 
}

function updateSrNO(){
    let allrows=commentContainer.querySelectorAll('tr')
    allrows.forEach((r,i)=>{
        r.children[0].innerText=i+1
    })
}

function fetchComment(){
    let xhr=new XMLHttpRequest()
    xhr.open('GET',POST_URL)
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            commentArr=res
            templating(res.reverse())
        }else{
            snackBar('Error..','error')
        }
    }
    xhr.onerror=function(){
            snackBar('Error..','error')

    }
}
fetchComment()
function templating(arr){
    let res='';
    arr.forEach((c,i)=>{
        res += ` <tr id="${c.id}">
                                    <td>${i+1}</td>
                                    <td>${c.name}</td>
                                    <td>${c.email}</td>
                                    <td>${c.body}</td>
                                    <td>${c.postId}</td>
                                    <td><i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                                    <td><i onclick="onDelete(this)"  class="fa-solid fa-trash-can fa-2x text-danger"></i></td>
                                </tr>`
    })
    commentContainer.innerHTML=res
}

function onCommentSub(e){
    spinner.classList.remove('d-none')

    e.preventDefault()
    let New_Comment={
        name:nameControl.value ,
        email:emailControl.value,
        body:bodyControl.value,
        postId:postIdControl.value
    }
    let xhr=new XMLHttpRequest()
    xhr.open('POST',POST_URL)
    xhr.send(JSON.stringify(New_Comment))
    xhr.onload=function (){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            let tr=document.createElement('tr')
            tr.id=res.id
            tr.innerHTML=` <td></td>
                                    <td>${New_Comment.name}</td>
                                    <td>${New_Comment.email}</td>
                                    <td>${New_Comment.body}</td>
                                    <td>${New_Comment.postId}</td>
                                    <td><i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                                    <td><i onclick="onDelete(this)"  class="fa-solid fa-trash-can fa-2x text-danger"></i></td>`
                        commentContainer.prepend(tr);
                        commentArr.unshift(res)
                        updateSrNO()
                        
                        commentForm.reset()
                        spinner.classList.add('d-none')
                        snackBar(`New Comment ${New_Comment.name} is Created Successfully..`,'success')
        }else{
            spinner.classList.add('d-none')
            snackBar('Error','error')
        }
    }
}
function onDelete(e){

        Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
    if (result.isConfirmed) {
        
    spinner.classList.remove('d-none')
    let DELETE_ID=e.closest('tr').id
    let DELETE_URL=`${BASE_URL}/comments/${DELETE_ID}`
    let xhr=new XMLHttpRequest()
    xhr.open('DELETE',DELETE_URL)
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            document.getElementById(DELETE_ID).remove()
              spinner.classList.add('d-none')
            updateSrNO()
            snackBar(`The Comment Id ${DELETE_ID} is Deleted ..`,'success')
        }else{
           spinner.classList.add('d-none')
            snackBar('Error','error')
        }
    }
    }
    });
}

function onEdit(e){
    spinner.classList.remove('d-none')
    
    let EDIT_ID=e.closest('tr').id
    localStorage.setItem('EDIT_ID',EDIT_ID)
    let EDIT_URL=`${BASE_URL}/comments/${EDIT_ID}`
    let xhr=new XMLHttpRequest()
    xhr.open('GET',EDIT_URL)
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            nameControl.value=res.name;
            emailControl.value=res.email;
            bodyControl.value=res.body;
            postIdControl.value=res.postId;

            spinner.classList.add('d-none')
            addBtn.classList.add('d-none')
            updateBtn.classList.remove('d-none')


            
        }else{
            spinner.classList.add('d-none')
            snackBar('Error','error')
        }
    }

}
function onUpdateComment(){
    let UPDATE_ID=localStorage.getItem('EDIT_ID')
    let UPDATE_URL=`${BASE_URL}/comments/${UPDATE_ID}`
    let UPDATE_ONJ={
        name:nameControl.value ,
        email:emailControl.value,
        body:bodyControl.value,
        postId:postIdControl.value
    }
    let xhr=new XMLHttpRequest()
    xhr.open('PATCH',UPDATE_URL)
    xhr.send(JSON.stringify(UPDATE_ONJ))
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response);
            let tr=document.getElementById(UPDATE_ID).children
            tr[1].innerHTML=res.name;
            tr[2].innerHTML=res.email;
            tr[3].innerHTML=res.body;
            tr[4].innerHTML=res.postId
            
           
            spinner.classList.add('d-none')
            addBtn.classList.remove('d-none')
            updateBtn.classList.add('d-none')

            
        }else{
            spinner.classList.add('d-none')
            snackBar('error','error')
        }
    }
}

commentForm.addEventListener('submit',onCommentSub)
updateBtn.addEventListener('click',onUpdateComment)