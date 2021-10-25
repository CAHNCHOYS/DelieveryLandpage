//Подключение скриптов
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();;

let _slideUp = (target, duration) => {
    target.style.transitionProperty = 'height, margin, padding'; /* [1.1] */
    target.style.transitionDuration = duration + 'ms'; /* [1.2] */
 
    target.style.height = target.offsetHeight + 'px'; /* [3] */
    target.offsetHeight;
    target.style.overflow = 'hidden'; /* [7] */
    target.style.height = 0; /* [4] */
target.style.paddingTop = 0; /* [5.1] */
target.style.paddingBottom = 0; /* [5.2] */
target.style.marginTop = 0; /* [6.1] */
target.style.marginBottom = 0; /* [7.2] */

window.setTimeout( () => {
    target.style.display = 'none'; /* [8] */
    target.style.removeProperty('height'); /* [9] */
    target.style.removeProperty('padding-top');  /* [10.1] */ 
    target.style.removeProperty('padding-bottom');  /* [10.2] */ 
    target.style.removeProperty('margin-top');  /* [11.1] */ 
    target.style.removeProperty('margin-bottom');  /* [11.2] */ 
    target.style.removeProperty('overflow');  /* [12] */ 
    target.style.removeProperty('transition-duration');  /* [13.1] */ 
    target.style.removeProperty('transition-property');  /* [13.2] */ 
  }, duration);
  }





  let _slideDown = (target, duration) => {
    
    target.style.removeProperty('display'); /* [1] */
    let display = window.getComputedStyle(target).display;
    if (display === 'none') { /* [2] */
      display = 'block';
    }
     target.style.display=display;
    let height = target.offsetHeight; /* [3] */
    target.style.overflow = 'hidden'; /* [7] */ 
    target.style.height = 0; /* [4] */
    target.style.paddingTop = 0; /* [5.1] */
    target.style.paddingBottom = 0; /* [5.2] */ 
    target.style.marginTop = 0; /* [6.1] */ 
    target.style.marginBottom = 0; /* [6.2] */ 
    target.offsetHeight;
    
target.style.transitionProperty = "height, margin, padding";  /* [9.1] */ 
target.style.transitionDuration = duration + 'ms'; /* [9.2] */
target.style.height = height + 'px'; /* [10] */
target.style.removeProperty('padding-top'); /* [11.1] */ 
target.style.removeProperty('padding-bottom'); /* [11.2] */ 
target.style.removeProperty('margin-top'); /* [12.1] */ 
target.style.removeProperty('margin-bottom'); /* [12.2] */
window.setTimeout( () => {
    target.style.removeProperty('height'); /* [13] */
    target.style.removeProperty('overflow'); /* [14] */
    target.style.removeProperty('transition-duration'); /* [15.1] */
    target.style.removeProperty('transition-property'); /* [15.2] */
  }, duration);
  }





let _slideToggle = (target, duration = 500) => {
    
    if (window.getComputedStyle(target).display === 'none') {
      return _slideDown(target, duration);
    } else {
      return _slideUp(target, duration);
    }
  }

  function ibg(){

    let ibg=document.querySelectorAll("._ibg");
    for (var i = 0; i < ibg.length; i++) {
    if(ibg[i].querySelector('img')){
    ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
    }
    }
    }
    
    ibg();


    
// Заполнение инпутов с емейлом
let errorDiv = document.createElement('div');
const emailInputs = document.querySelectorAll('.email-input');
if(emailInputs.length > 0){
for (const emailInput of emailInputs) {
      emailInput.addEventListener('blur',function(event){
         if(event.target.value.length<4 || !event.target.value.includes('@')){
           console.log(55);
           emailInput.classList.add('error');
         
           errorDiv.innerHTML = `<span> ${emailInput.getAttribute('data-message')}</span>`;
           errorDiv.classList.add('error-block');
           const inputCoords = emailInput.getBoundingClientRect();
           let topCoords = inputCoords.bottom+pageYOffset;
           let leftCoords = inputCoords.left + pageXOffset;
           errorDiv.style.top = topCoords + 'px';
           errorDiv.style.left = leftCoords + 'px';
           document.body.insertAdjacentElement('afterend',errorDiv);

         }
      });
      emailInput.addEventListener('focus',function(event){
        if(emailInput.classList.contains('error')){
          emailInput.classList.remove('error');
        }
        errorDiv.remove();
     });

    }


}




//Анимация при скоре (добавление класа при достижении 1/4 блока)
const anim_items  = document.querySelectorAll('._anim-items');
if(anim_items.length>0){
    
      window.addEventListener('scroll',animOnScroll);
    function animOnScroll(params) {
        for (let index = 0; index < anim_items.length; index++) {
            const animElement = anim_items[index];
            const animElementHeigt = animElement.offsetHeight;
            const animItemOffset = offset(animElement).top;
            const animStart = 4;


            let animStartPoint = document.documentElement.clientHeight  - animElementHeigt / animStart;
            if(animElementHeigt > document.documentElement.clientHeight ){
                   animStartPoint = document.documentElement.clientHeight  - document.documentElement.clientHeight / animStart;
            } 
            if((pageYOffset > animItemOffset - animStartPoint) && pageYOffset < (animItemOffset+animElementHeigt)){
               animElement.classList.add('_active');
            }else{
                if(!animElement.classList.contains('_noAnimAgain'))
                animElement.classList.remove('_active');
            }
        }

    }


    function offset(el) {
        
        const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {    top:rect.top + scrollTop,left: rect.left + scrollLeft}
    }

   setTimeout(() => {
    animOnScroll();
   }, 300);
   
}

//==================================================================================


//Проверка поддерживает ли браузер webp
function testWebP(callback) {

  var webP = new Image();
  webP.onload = webP.onerror = function () {
  callback(webP.height == 2);
  };
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  
  testWebP(function (support) {
  if (support == true) {
  document.querySelector('body').classList.add('webp');
  }
  });
;
const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };
  
  if (isMobile.any()) {
    document.body.classList.add("_mobile");
  } else {
    document.body.classList.add("_pc");
  }
  
  window.onload = function () {
  
    const headerBurger = document.querySelector(".bottom-header__burger");
    const burgerMenu = document.querySelector(".bottom-header__nav");
    const headerSubLinks = document.querySelectorAll(".top-header__link.sub");
    const searchButton = document.querySelector(".bottom-header__search");
    const searchPopUp = document.querySelector(".popup");
    const popUpCloseBtn = document.querySelector(".popup__close");
    const exploreButton = document.querySelector(".explore__button");
    const exploreValue = document.querySelector('.explore__value');
    const videoStartButton = document.querySelector('.video__play');
    const delieverVideo = document.querySelector('.video__video');
    const videoPauseButton = document.querySelector('.video__pause');
    const videoShowInfo = document.querySelector('.video__show-info');
    const tabLinks = document.querySelectorAll('.tabs__tab-link');
    const tabsMenu = document.querySelector('.tabs__menu');
    const tabsTabs = document.querySelector('.tabs__tabs');
    const tabSpollers = document.querySelectorAll('.tab__spoller');
    const footerSpollers = document.querySelectorAll('.footer__title');
  
  
  
    if (headerBurger) {
      headerBurger.addEventListener("click", function (event) {
        burgerMenu.classList.toggle("active");
        document.body.classList.toggle("_isLocked");
        this.classList.toggle("active");
      });
    }
  
    if (isMobile.any()) {
        if(headerSubLinks.length>0){
          for (const link of headerSubLinks) {
              link.addEventListener("click", function (event) {
                event.preventDefault();
                _slideToggle(link.parentElement.querySelector(".top-sub"), 700);
              });
            }
        }
      
    }
  
    //Закрытие меню по клику вне
    document.documentElement.addEventListener("click", function (e) {
      const target = e.target; // находим элемент, на котором был клик
      if (!target.closest(".top-header__list") && document.querySelectorAll('.top-header__list').length>0) {
        // если этот элемент или его родительские элементы не окно навигации и не кнопка
        for (const link of headerSubLinks) {
          _slideUp(link.parentElement.querySelector(".top-sub"), 100);
        }
      }
      if (
        !target.closest(".popup") &&
        !target.closest(".bottom-header__search") &&
        document.querySelector(".popup")
      ) {
        searchPopUp.classList.remove("active");
      }
      if (
        !target.closest(".explore__select") &&
        document.querySelector(".explore__select")
      ) {
       
        _slideUp(
          exploreButton.parentElement.querySelector(".explore__sub-values"),
          200
        );
      }
    });
  
    if (searchButton) {
      searchButton.addEventListener("click", function (eventt) {
        searchPopUp.classList.add("active");
      });
    }
  
    if (popUpCloseBtn) {
      popUpCloseBtn.addEventListener("click", function (e) {
        searchPopUp.classList.remove("active");
      });
    }
  
    if (exploreButton) {
      exploreButton.addEventListener("click", function (event) {
        _slideToggle(
          this.parentElement.querySelector(".explore__sub-values"),
          800
        );
      });
      const exploreSubValues = document.querySelectorAll('.explore__sub-value');
      for (const subValue of exploreSubValues) {
           subValue.addEventListener('click',function(e){
                 exploreValue.innerHTML = this.innerHTML;
           });
      }
    }
  
    if(videoStartButton && videoPauseButton){
        videoStartButton.addEventListener('click',function(e){
           
              delieverVideo.play();
            
  
              this.style.display='none';
              videoPauseButton.classList.add('active');
              if(document.body.clientWidth>800){
                _slideUp(videoShowInfo.parentElement.querySelector('.video__row'),500);
              }
             
             
  
        });
  
        videoPauseButton.addEventListener('click',function(event){
          delieverVideo.pause();
          this.classList.remove('active');
          videoStartButton.style.display='flex';
          if(document.body.clientWidth>800){
            _slideDown(videoShowInfo.parentElement.querySelector('.video__row'),500);
          }
      
        });
     
      videoShowInfo.addEventListener('click',function(e){
               
        _slideToggle(this.parentElement.querySelector('.video__row'),500);
  
   });
     
       
    }
  
  
  
    if(tabLinks.length>0){
      for (const tabLink of tabLinks) {
          tabLink.addEventListener('click',function (event) { 
  
            tabsTabs.querySelector('.active').classList.remove('active');
            const index =  [...this.parentElement.parentElement.children].indexOf(this.parentElement); //Какой по счету пункт меню нажали
             tabsMenu.querySelector('.active-tab').classList.remove('active-tab');
              this.classList.add('active-tab');
              tabsTabs.children[index].classList.add('active');
  
           });
      }
      for (const tabSpoller of tabSpollers) {
          tabSpoller.addEventListener('click',function (event) {  
            const activeSpoller = tabSpoller.parentElement.parentElement.querySelector('.active-spoller');
         
             //Чтобы работал только один спойлер одновременно в табе
            if(activeSpoller)  { 
              activeSpoller.classList.remove('active-spoller');
           _slideUp(activeSpoller.parentElement.querySelector('.tab__body'),200);
            }
            if(activeSpoller == tabSpoller) return;
  
          _slideToggle(tabSpoller.parentElement.querySelector('.tab__body'),500);
           tabSpoller.classList.toggle('active-spoller');
            
            
          
          
          });
      }
  
  
    }
  
    if(footerSpollers && document.documentElement.clientWidth <= 500){
            for (const footerSpoller of footerSpollers) {
               footerSpoller.addEventListener('click',function (e) { 
                 _slideToggle(footerSpoller.parentElement.querySelector('.footer__list'),700);
                 
                });
            }
    }
  };
  ;


//заготавка под свайпер и объявление и адаптация слайдеров ==============
let sliders = document.querySelectorAll('._swiper');
if(sliders.length>0){
    for (let index = 0; index < sliders.length; index++) {
        let slider = sliders[index];
        if(!slider.classList.contains('swiper-bild')){
             let sliderItems = slider.children;
           
             if(sliderItems.length>0){
                 for (const child of sliderItems) {
                        child.classList.add('swiper-slide');
                 }
             }

             let slider_content  = slider.innerHTML;
             let SwiperWrapper = document.createElement('div');
             SwiperWrapper.classList.add('swiper-wrapper');
             SwiperWrapper.innerHTML = slider_content;
             slider.innerHTML = '';
             slider.appendChild(SwiperWrapper);
             slider.classList.add('swiper-bild');


            let btnPrev = document.createElement('div');
             btnPrev.className = 'swiper-button-prev';
             slider.appendChild(btnPrev);
             let btnNext = document.createElement('div');
             btnNext.className = 'swiper-button-next';
             slider.appendChild(btnNext);

             if(slider.classList.contains('_swiper_scroll')){
                 let sliderScroll =  document.createElement('div');
                 sliderScroll.classList.add('swiper-scrollbar');
                 slider.appendChild(sliderScroll);
             }
             
            
             
        }
    }

}
    





function slide_Bind_content(params) {
    
}















//=============================================================;