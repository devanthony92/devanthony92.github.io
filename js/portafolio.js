let navmenu = false;
function menu(){
    if (navmenu){
        document.getElementById("nav").classList = "";
        navmenu= false;
    } else {
        document.getElementById("nav").classList = "responsive";
        navmenu= true;
    }
};
function selecccionar(){
    document.getElementById("nav").classList = "";
    navmenu= false;
}

const $form = document.querySelector('#form')

$form.addEventListener('submit',submit) 

async function submit(event){
    event.preventDefault()
    const form = new FormData(this)
    const response = await fetch(this.action,{
        method: this.method,
        body: form,
        headers: {
            'Accept': 'application/json'
        }
    })
    if (response.ok) {
        alert ('Gracias por conctactarme, le enviare una respuesta tan pronto como sea posible')
    }
}