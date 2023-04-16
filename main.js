let btn = document.querySelector(".formChat").querySelector("input[type='submit']")
let content = document.querySelector("textarea[name='content']")
let HTMLMessages = document.querySelector(".messages")
let ans = document.querySelector(".answerChat")

 name = null
let oldMessagesLength =0
let newMessagesLength = 0

window.addEventListener("load",()=>{
	document.querySelector("textarea[name='content']").focus()
	document.querySelector("textarea[name='content']").value = ""

	if(localStorage.getItem("user")){
		name = localStorage.getItem("user")
	}
})

btn.addEventListener("click",postMsg)
function getName(){
	let n = prompt("Votre Nom ou Pseudo")

	return n
}
function getMsg(){

	let i=1
	let messages = null
    fetch("main.php" , {mode:"no-cors"})
	.then( (resp)=>{
		return resp.json()
	}) 
	.then( (data)=>{
		console.log(data)
		let messages = data.map((msg)=>{
			let test="message--right"
			if (name!=null && msg.author===name) {
	  			 test = "message--left"
			}
			return `
			<div class="${test}">
				<div class="message">
					<div class="message__header">
						<span class="author">${msg.author}</span>
					</div>
					<p class="message__body">${msg.content}.</p>
					<div class="message__footer">
						<span class="created_at">${msg.created_at.slice(11,16)}</span>
					</div>
				</div>
			</div>`
		})

		HTMLMessages.innerHTML = messages.reverse().join("")

		newMessagesLength = messages.length
		if (newMessagesLength!==oldMessagesLength) {
			HTMLMessages.scrollTop =HTMLMessages.scrollHeight
			oldMessagesLength=newMessagesLength
		}

	})	
}


function postMsg(e){
	e.preventDefault()
	ans.classList.remove("error")
	ans.textContent = ""

	if (content.value=="") {

		ans.classList.add("error")
		ans.textContent = "Vous n'avez rien saisi"
		return 0
	}
	if (/[^a-zA-Z ]/.test(content.value)) {
		
		ans.classList.add("error")
		ans.textContent = "Vous ne pouvez envoyer des messages uniquement qu'avec les lettres de l'alphabet pas de caractères special"
		return 0
	}


	if (localStorage.getItem('user')==null) {
			for(var i=0;i<3;i++) {
				name = getName()
				if (!(name==""||name==null)) {
					
					break;
				}
		    }
		    if (i==3) {
			   alert("Vous n'avez pas entrer de pseudo, votre message n'a pas été envoyé")
			   return
		    }
	}

    localStorage.setItem('user',name)



	let data = new FormData()
	data.append('author', name);
	data.append('content', content.value);
	console.log(data)
	content.value = ""

    fetch("main.php?task=postMsg",{
    	method:"POST",
    	body:data

    })
	.then( (resp)=>{
		console.log(resp)
		return resp.json()
	})
	.then( (data)=>{
		if (data.status == "error") {
			ans.classList.add("error")
			ans.textContent = data.message
		}

	})	
}

setInterval(()=>{
	getMsg()
},1000)



