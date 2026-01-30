arrActLink = [
  [
    //page 0
  ],
  [
    //page 1
  ],
  [
    //page 2        
  ],
  [
    //page 3        
  ],
  [
    //page 4       
  ],
  [
    //page 5
  ],
  [
    //page 6       
  ],
  [
    //page 7 
  ],
  [
    //page 8     
  ],
  [
    //page 9   
  ],
  [
    //page 10
  ],
  [
    //page 11
  ],
  [
    //page 12
  ],
  [
    //page 13
  ],
  [
    //page 14
  ],
  [
    //page 15
  ]


];

BookIcons = {
  "readIcon": true,
  "hindiwriteIcon": true,
  "speakIcon": true,
  "paintIcon": true,
  "drawIcon": true,
  "circleIcon": true,
  "stickerIcon": true,
  "writeIcon": true,
  "listenIcon": true,
  "traceIcon": true,
  "audioIcon": true,
  "meriDuniyaSeIcon": true
}

tocData = [
  {
    "title": "Fun with Words",
    "target": "9",
    // "subTitle":[
    //   { "title": "Count and write", "target": "11"}     
    // ]
  }
  // ,
  // {
  //   "title": "Place Value of Numbers",
  //   "target": "12",
  //   "subTitle":[
  //     { "title": "Fill in the missing numbers", "target": "13"}   
  //   ]
  // },
  // {
  //   "title": "Numbers: Before-After-Between",
  //   "target": "14",
  //   "subTitle":[
  //     { "title": "Write the number that comes in between", "target": "15"}
  //   ]
  // },
  // {
  //   "title": "Smaller and Bigger Numbers",
  //   "target": "16",
  //   "subTitle":[

  //   ]
  // }
]

function toggleAudioIcons() {
  var allIcons = document.getElementsByClassName("audioIcon");
  for (let index = 0; index < allIcons.length; index++) {
    var eItem = allIcons[index],
      thisOp = eItem.style.opacity;
    eItem.style.opacity = thisOp == 1 || thisOp === "" ? 0 : 1;
    eItem.style.pointerEvents = thisOp == 1 || thisOp === "" ? "none" : "auto";
  }
  var tibElem = document.getElementById("tibElem");
  if (tibElem.classList[1] == "active") {
    tibElem.classList.remove("active");
  } else {
    tibElem.classList.add("active");
  }
}

function resetInput(input) {
  input.classList.remove("error", "correct");
  // console.log(input);
}
function validateInput(input) {
  var inputValue = (input.value.trim()).toLowerCase();
  var answer = input.attributes["data-answer"].value;

  if (inputValue === "") return;
  var answerN = answer.split(",");

  // console.log("input",input);
  if (typeof answerN !== String) {
    for (let index = 0; index < answerN.length; index++) {
      const answerOption = answerN[index].trim();
      console.log(answerOption, inputValue)
      if (inputValue === answerOption) {
        input.classList.remove("error");
        input.classList.add("correct");
        return
      }
    }
    input.classList.remove("correct");
    input.classList.add("error");
  } else {
    if (inputValue !== answer) {
      input.classList.remove("correct");
      input.classList.add("error");
    } else {
      input.classList.remove("error");
      input.classList.add("correct");
    }
  }
}

function validatevalue(input) {
  // console.log(input.classList);
  var inputValue = input.attributes["data-value"].value;
  if (inputValue === "") return;
  
  // console.log(TempCls, TempClsArr);
  if (input.childNodes[1].classList.length > 1) {
    input.childNodes[1].classList.remove("corrects");
    input.childNodes[1].classList.remove("errors");
    return
  }

  var TempClsArr = input.attributes["class"].value.split(" ");
  var TempCls = TempClsArr[2];
  var tempcom = document.querySelectorAll(`.${TempCls}`);
  // console.log(tempcom);
  for (let i = 0; i < tempcom.length; i++) {
    var child = tempcom[i].childNodes;
    if (child.length > 0) {
      child[1].classList.remove("corrects");
      child[1].classList.remove("errors");
      // console.log(child);
    }
  }

  var answer = input.attributes["data-answer"].value;
  if (inputValue !== answer) {
    // input.childNodes[1].classList.remove("corrects");
    input.childNodes[1].classList.add("errors");
  } else {
    // input.childNodes[1].classList.remove("errors");
    input.childNodes[1].classList.add("corrects");
  }
}


// Add tabindex and role to elements with onclick, for accessibility / remote control compatibility
window.addEventListener('load', () => {
  // Select all elements that have an inline onclick attribute
  const clickableElements = document.querySelectorAll('[onclick]');

  clickableElements.forEach(el => {
    // 1. Add tabindex if not already present
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }

    // 2. Add role="button" if not present
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'button');
    }

    // 3. Add onkeydown to trigger onclick on Enter key
    el.onkeydown = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault(); // optional but helps avoid double key processing
        el.click(); // triggers whatever is already bound to onclick
      }
    };
  });
});