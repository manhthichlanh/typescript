  import { getSource, getUser, PostNewHistory } from "./CRUD.js";
  const loadImg = document.getElementById("loadImg") as HTMLDivElement;

  let level = 1;

   interface img {
    id:Number,
    ten:String,
    url:String,
    mota:String,
  }
  interface source {
    id: number,
    name: String,
    image: String,
    description: String,
  }


  const renderNav= () => {
    const nav = document.getElementById("nav") as HTMLDivElement;
    nav.innerHTML = 
   `<div class="col-2 border border-light rounded-pill " id="hoten" ></div>
    <div class="col-2 border border-light rounded-pill ">Level: <span id="level"></span></div>
    <div class="col-2 border border-light rounded-pill ">Score: <span id="score"></span></div>
    <div class="col-2 border border-light rounded-pill ">Thời gian: <span id="counttime"></span></div>
    <div class="col-2 border border-light rounded-pill ">Lật: <span id="count">0</span></div>
    <div class="col-2 border border-light rounded-pill logout">Log Out</div>
    `
  }
  const dataProcessing = async (data,level:number,callback) => {
      for (let index = 0; index < level; index++) {
          const newarr = await Promise.all(data.sort((a, b) => 0.5 - Math.random())) ;
          await callback(newarr)
      }
  };
  
  const images = async (data:any) => {
    const html = await Promise.all(
      data.map((item:source)=> {
          return `<div class="flip-card col-2" data-id="${item.id}" style="cursor: pointer;">
                      <div class="flip-card-inner" >
                      <div class="flip-card-front">
                      </div>
                      <div class="flip-card-back">
      
                          <img src="./public/images/${item.image}" alt="Avatar" >
      
                      </div>
                      </div>
                  </div>`;
        })
    ) 
  
  
    loadImg.innerHTML += html.join("");
  }
  
  const login = async () => {
    const login_form = document.getElementById("login_form");
    await Promise.all(
      login_form.innerHTML =`<form action="javascript:void(0)" id="frm">
      <div id="quest">Have you have an account?</div>
      <input type="text" name="username" id="name" placeholder="username">
      <input type="password" name="password" id="pass" placeholder="password">
      <input type="submit" value="Đăng nhập" id="submit">
    </form>`
    ) 
    const frm = document.getElementById("frm");
    frm.addEventListener("submit" , async (e)=>{
      e.defaultPrevented;
      const username = document.getElementById("name") as HTMLInputElement;
      const password = document.getElementById("pass") as HTMLInputElement;
      const user = [];

      await (
        getUser()
        .then(data=>{
            user.push(...data)
        })
      )

      const member = user.filter((item,index)=>(item.username === username.value && item.password === password.value ))
      if (member.length>0)  {
        localStorage.setItem("user",JSON.stringify(member));
        window.location.reload();
      }
    })
    
  }
  const startGame = async (level) => {
  
      const userStorages = localStorage.getItem("user");
      if (!userStorages) {
        console.log("cóa")
        return login();
      }
      // if (userStorages ) return 0; 
  
      renderNav();
      
      const arr_hinh = [];
      
      await (
        getSource()
        .then(data=>{
            arr_hinh.push(...data)
        })
      )
      await(
        dataProcessing(arr_hinh,level,images)
        .then(data=>{

            const flipCards = document.querySelectorAll(".flip-card") as NodeList;
            const counttime = document.getElementById("counttime") as HTMLSpanElement;
            const scoreHTML = document.getElementById("score") as HTMLSpanElement;
            const levelHTML = document.getElementById("level") as HTMLSpanElement;
            const Click = document.getElementById("count") as HTMLSpanElement;
            const hoten = document.getElementById("hoten") as HTMLDivElement;
            const logout = document.querySelector(".logout") as HTMLDivElement;
            let score = 0;
            let prevId = null;
            let count = 0;
            Click.innerHTML = String(count);
            const timeLimit = 45; // Thời gian giới hạn là 45 giây
            let timeRemaining = timeLimit;
            let countdown = null;
            hoten.innerHTML = JSON.parse(localStorage.getItem("user"))[0].username;
            levelHTML.innerHTML = level;
            scoreHTML.innerHTML = String(score) ;
            counttime.innerHTML = String(timeLimit);
            //logout
            logout.addEventListener("click",()=>{
                localStorage.removeItem("user");
                window.location.reload();
            })
            //flipcart Logic
            flipCards.forEach((flipCard:HTMLDivElement ) => {
                flipCard.addEventListener("click", (event) => {
                    event.preventDefault();
                    const currentId = flipCard.dataset.id;
                    const currentElement = flipCard.querySelector(".flip-card-inner")
                    if (currentElement.classList.contains('flip')) {
                    return;
                    }
    
                    if (countdown === null) {
                    countdown = setInterval(() => {
                        timeRemaining--;
                        counttime.innerHTML = String(timeRemaining);
                        if (timeRemaining === 0) {
                            endGame(score, timeRemaining,countdown);
                        }
                    }, 1000);
                }
                    currentElement.classList.add("flip");
                    if (prevId && prevId === currentId ) {
                    score += 2;
                    } else {
                    score += 1;
                    }
    
                    prevId = currentId;
            
                    //Xuất điểm,level
                //   const scoreElement = document.querySelector("#score");
                //   scoreElement.textContent = `Score: ${score}`;
                    scoreHTML.innerHTML = String(score) ;
                    
                    count ++;
                    Click.innerHTML = String(count);
    
                    if (count===flipCards.length) {
                        setTimeout(() => {
                            endGame(score,timeRemaining,countdown)
                
                        }, 1000); 
                    }  
                });
            
                });
            
                
        })
      )  
  }
  const endGame = (score:number,time:number,countdown:number) => {
      const aq = prompt(`Bạn đã hoàn thành trò chơi tại level ${level} với số điểm ${score} trong ${time} còn lại !Bạn có muốn tiếp tục level tiếp theo! Yes or No`)
      if (aq==='No') {
        clearInterval(countdown)
        return loadImg.innerHTML = ``;
      } 
      clearInterval(countdown);
      loadImg.innerHTML = ``;
      level++;
      PostNewHistory(countdown, level, score);
      startGame(level)
    }

export { startGame } 