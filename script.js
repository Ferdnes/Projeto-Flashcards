const container = document.querySelector(".container");
const addQuestionModal = document.getElementById("add-card-modal");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const saveBtn = document.getElementById("save-btn")
const addQuestion = document.getElementById("add-card");
const closeBtn = document.getElementById("close-btn");

let editBool = false;
let originalId = null;
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

addQuestion.addEventListener("click", () => {
    container.classList.add("hide");
    question.value = "";
    answer.value = "";
    addQuestionModal.classList.remove("hide"); 
});

closeBtn.addEventListener("click", () =>{
    container.classList.remove("hide");
    addQuestionModal.classList.add("hide");
    if (editBool) {
        editBool = false;
    }
});

saveBtn.addEventListener("click", () =>{
    let tempQuestion = question.value.trim();
    let tempAnswer = answer.value.trim();
    if(!tempQuestion || !tempAnswer){
        errorMessage.classList.remove('hide');
    }else{
        if(editBool){
            flashcards = flashcards.filter(flashcard => flashcard.id !== originalId); 
        }
        errorMessage.classList.add('hide');
        let id = Date.now()
        flashcards.push({id, question: tempQuestion, answer: tempAnswer});
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
        container.classList.remove("hide");
        addQuestionModal.classList.add("hide");
        viewList();
        question.value = "";
        answer.value = "";
        editBool = false;
        
    }
});

function viewList(){
    const cardsList = document.querySelector(".cards-list-container");
    cardsList.innerHTML = " ";
    flashcards = JSON.parse(localStorage.getItem("flashcard")) || [];
    flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    flashcards.forEach(flashcard => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <p class="que-div">${flashcard.question}</p>
            <p class="ans-div">${flashcard.answer}</p>
            <a href="#" class="show-hide-btn">Show/Hide</a>
            <div class="btns-con">
                <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;

        div.setAttribute("data-id", flashcard.id);
        const displayAns = div.querySelector(".ans-div");
        const showHideBTn = div.querySelector(".show-hide-btn");
        const editBtn = div.querySelector(".edit")
        const deleteBtn = div.querySelector(".delete")

        showHideBTn.addEventListener("click", () =>{
            displayAns.classList.toggle('hide');
        });

        editBtn.addEventListener("click", () =>{
            editBool = true;
            modifyElement(editBtn, true);
            addQuestionModal.classList.remove("hide");
        });

        deleteBtn.addEventListener("click", ()=>{
            modifyElement(deleteBtn);
        })

        cardsList.appendChild(div);
    });
}

const modifyElement = (element, edit = false) =>{
    const parentDiv = element.parentElement.parentElement;
    const id = Number(parentDiv.getAttribute('data-id'));
    const parentQuestion = parentDiv.querySelector('.que-div').innerText;
    if(edit){
        const parentAnswer = parentDiv.querySelector('.ans-div').innerText;
        answer.value = parentAnswer;
        question.value = parentQuestion;
        originalId = id;
    
    }else{
        flashcards = flashcards.filter(flashcard =>
        flashcard.id !== id);
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
        parentDiv.remove();
    }
}

document.addEventListener("DOMContentLoaded", viewList);