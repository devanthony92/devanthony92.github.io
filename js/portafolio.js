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